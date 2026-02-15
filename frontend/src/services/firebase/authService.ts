/**
 * Firebase Authentication Service
 * 
 * Handles admin authentication using Firebase Auth.
 * Replaces JWT-based authentication with Firebase tokens.
 */

import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

// ==================== Types ====================

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: Timestamp | Date | null;
  loginAttempts: number;
  isLocked: boolean;
  lockedUntil: Timestamp | Date | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AdminUser;
  token: string;
}

// ==================== Helper Functions ====================

/**
 * Get admin user data from Firestore
 */
const getAdminData = async (uid: string): Promise<AdminUser | null> => {
  const adminDoc = doc(db, 'admins', uid);
  const adminSnap = await getDoc(adminDoc);
  
  if (!adminSnap.exists()) return null;
  
  const data = adminSnap.data();
  return {
    uid,
    email: data.email,
    name: data.name,
    role: data.role,
    isActive: data.isActive,
    lastLogin: data.lastLogin,
    loginAttempts: data.loginAttempts || 0,
    isLocked: data.isLocked || false,
    lockedUntil: data.lockedUntil || null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

/**
 * Create audit log for authentication events
 */
const createAuditLog = async (
  action: string,
  email: string,
  status: 'success' | 'failed' | 'blocked',
  reason?: string
) => {
  try {
    await setDoc(doc(db, 'auditLogs', `${Date.now()}-${email}`), {
      action,
      email,
      ipAddress: 'unknown', // In browser, IP is not directly accessible
      userAgent: navigator.userAgent,
      status,
      reason: reason || '',
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging shouldn't break authentication
  }
};

// ==================== Authentication Functions ====================

/**
 * Login with email and password
 */
export const loginWithEmail = async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Sign in with Firebase Auth
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Restrict login to specific admin email only
    const allowedAdminEmail = 'admin@ashraffurnitures.com';
    if (email !== allowedAdminEmail) {
      await signOut(auth);
      await createAuditLog('login_attempt', email, 'blocked', `Access denied. Only ${allowedAdminEmail} can login`);
      throw new Error(`Access denied. Only ${allowedAdminEmail} can login.`);
    }

    // Get admin data from Firestore
    const adminData = await getAdminData(firebaseUser.uid);

    if (!adminData) {
      await signOut(auth);
      await createAuditLog('login_attempt', email, 'failed', 'User not found in admins collection');
      throw new Error('User is not an admin');
    }

    // Check if admin is active
    if (!adminData.isActive) {
      await signOut(auth);
      await createAuditLog('login_attempt', email, 'blocked', 'Account inactive');
      throw new Error('Admin account is inactive');
    }

    // Check if account is locked
    if (adminData.isLocked && adminData.lockedUntil) {
      const lockedUntil = adminData.lockedUntil instanceof Timestamp 
        ? adminData.lockedUntil.toDate() 
        : new Date(adminData.lockedUntil);

      if (lockedUntil > new Date()) {
        const remainingMinutes = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / 1000 / 60);
        await signOut(auth);
        await createAuditLog('login_attempt', email, 'blocked', `Account locked for ${remainingMinutes} minutes`);
        throw new Error(`Account is locked. Try again in ${remainingMinutes} minutes`);
      }

      // Unlock account if lock period expired
      await updateDoc(doc(db, 'admins', firebaseUser.uid), {
        isLocked: false,
        lockedUntil: null,
        loginAttempts: 0,
        updatedAt: serverTimestamp()
      });
    }

    // Reset login attempts and update last login
    await updateDoc(doc(db, 'admins', firebaseUser.uid), {
      loginAttempts: 0,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await createAuditLog('login_success', email, 'success', 'Successful login');

    // Get token
    const token = await firebaseUser.getIdToken();

    return {
      user: { ...adminData, loginAttempts: 0, lastLogin: new Date() },
      token
    };
  } catch (error: any) {
    // Handle failed login attempts
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      try {
        // Try to get admin data to update login attempts
        const usersSnapshot = await getDoc(doc(db, 'admins', email));
        if (usersSnapshot.exists()) {
          const adminRef = doc(db, 'admins', usersSnapshot.id);
          const adminData = usersSnapshot.data();
          const loginAttempts = (adminData.loginAttempts || 0) + 1;

          if (loginAttempts >= 5) {
            // Lock account for 15 minutes
            const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            await updateDoc(adminRef, {
              isLocked: true,
              lockedUntil,
              loginAttempts,
              updatedAt: serverTimestamp()
            });
            await createAuditLog('login_attempt', email, 'blocked', 'Account locked after 5 failed attempts');
            throw new Error('Too many failed login attempts. Account locked for 15 minutes');
          }

          await updateDoc(adminRef, {
            loginAttempts,
            updatedAt: serverTimestamp()
          });

          await createAuditLog('login_attempt', email, 'failed', `Invalid password (${5 - loginAttempts} attempts left)`);
          throw new Error(`Invalid email or password. ${5 - loginAttempts} attempts remaining`);
        }
      } catch (innerError: any) {
        if (innerError.message.includes('attempts')) {
          throw innerError;
        }
      }

      await createAuditLog('login_attempt', email, 'failed', 'Invalid credentials');
      throw new Error('Invalid email or password');
    }

    await createAuditLog('login_attempt', email, 'failed', error.message);
    throw error;
  }
};

/**
 * Login with Google OAuth
 */
export const loginWithGoogle = async (): Promise<LoginResponse> => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Use popup for localhost compatibility
    const userCredential = await signInWithPopup(auth, provider);
    
    const firebaseUser = userCredential.user;

    // Validate admin email if restriction is set
    const allowedAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    
    if (allowedAdminEmail && firebaseUser.email !== allowedAdminEmail) {
      await signOut(auth);
      await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'blocked', `Email not allowed. Only ${allowedAdminEmail} can login`);
      throw new Error(`Access denied. Only ${allowedAdminEmail} can login.`);
    }
    
    // Check if user exists in admins collection
    let adminData = await getAdminData(firebaseUser.uid);

    if (!adminData) {
      
      const newAdminData = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Admin User',
        role: 'admin' as AdminRole,
        isActive: true,
        loginAttempts: 0,
        isLocked: false,
        lockedUntil: null,
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'admins', firebaseUser.uid), newAdminData);
      
      adminData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Admin User',
        role: 'admin',
        isActive: true,
        loginAttempts: 0,
        isLocked: false,
        lockedUntil: null,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'success', 'First-time Google OAuth login');
    } else {
      
      if (!adminData.isActive) {
        await signOut(auth);
        await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'blocked', 'Account inactive');
        throw new Error('Admin account is inactive');
      }

      await updateDoc(doc(db, 'admins', firebaseUser.uid), {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'success', 'Successful Google OAuth login');
    }

    const token = await firebaseUser.getIdToken();

    return {
      user: { ...adminData, lastLogin: new Date() },
      token
    };
  } catch (error: any) {
    // Handle popup closed by user
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in cancelled. Please try again.');
    }
    
    await createAuditLog('google_oauth', 'unknown', 'failed', error.message);
    throw error;
  }
};

/**
 * Check for Google OAuth redirect result
 * Call this on app initialization
 */
export const checkGoogleRedirectResult = async (): Promise<LoginResponse | null> => {
  try {
    const pendingSignIn = sessionStorage.getItem('pendingGoogleSignIn');
    
    const userCredential = await getRedirectResult(auth);
    
    // Clear the pending flag regardless of result
    if (pendingSignIn) {
      sessionStorage.removeItem('pendingGoogleSignIn');
    }
    
    if (!userCredential) {
      return null;
    }

    const firebaseUser = userCredential.user;

    // Validate admin email if restriction is set
    const allowedAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    
    if (allowedAdminEmail && firebaseUser.email !== allowedAdminEmail) {
      await signOut(auth);
      await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'blocked', `Email not allowed. Only ${allowedAdminEmail} can login`);
      throw new Error(`Access denied. Only ${allowedAdminEmail} can login.`);
    }

    // Check if user exists in admins collection
    let adminData = await getAdminData(firebaseUser.uid);

    if (!adminData) {
      // Auto-create admin document for first-time Google login
      
      const newAdminData = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Admin User',
        role: 'admin' as AdminRole,
        isActive: true,
        loginAttempts: 0,
        isLocked: false,
        lockedUntil: null,
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'admins', firebaseUser.uid), newAdminData);
      
      adminData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Admin User',
        role: 'admin',
        isActive: true,
        loginAttempts: 0,
        isLocked: false,
        lockedUntil: null,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'success', 'First-time Google OAuth login - admin account created');
    } else {
      if (!adminData.isActive) {
        await signOut(auth);
        await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'blocked', 'Account inactive');
        throw new Error('Admin account is inactive');
      }

      // Update last login
      await updateDoc(doc(db, 'admins', firebaseUser.uid), {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await createAuditLog('google_oauth', firebaseUser.email || 'unknown', 'success', 'Successful Google OAuth login');
    }

    const token = await firebaseUser.getIdToken();

    return {
      user: { ...adminData, lastLogin: new Date() },
      token
    };
  } catch (error: any) {
    await createAuditLog('google_oauth', 'unknown', 'failed', error.message);
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser?.email) {
    await createAuditLog('logout', currentUser.email, 'success', 'User logged out');
  }
  await signOut(auth);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<AdminUser | null> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  return await getAdminData(firebaseUser.uid);
};

/**
 * Subscribe to authentication state changes
 */
export const onAuthChange = (callback: (user: AdminUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Validate admin email if restriction is set
      const allowedAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      
      if (allowedAdminEmail && firebaseUser.email !== allowedAdminEmail) {
        await signOut(auth);
        callback(null);
        return;
      }
      
      let adminData = await getAdminData(firebaseUser.uid);
      
      if (!adminData) {
        // Auto-create admin document for first-time login
        const newAdminData = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Admin User',
          role: 'admin' as AdminRole,
          isActive: true,
          loginAttempts: 0,
          isLocked: false,
          lockedUntil: null,
          lastLogin: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'admins', firebaseUser.uid), newAdminData);
        
        adminData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Admin User',
          role: 'admin',
          isActive: true,
          loginAttempts: 0,
          isLocked: false,
          lockedUntil: null,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await createAuditLog('auth_state_change', firebaseUser.email || 'unknown', 'success', 'First-time login - admin account created');
      }
      
      if (!adminData.isActive) {
        await signOut(auth);
        callback(null);
        return;
      }
      
      callback(adminData);
    } else {
      callback(null);
    }
  });
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Update user password (requires recent authentication)
 */
export const changePassword = async (newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  await updatePassword(user, newPassword);
};

/**
 * Get current user's ID token (for API requests if needed)
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  return await user.getIdToken();
};

// ==================== Admin Management (Admin Only) ====================

/**
 * Create a new admin user
 * Note: This should only be called by existing admins
 */
export const createAdmin = async (
  email: string,
  password: string,
  name: string,
  role: AdminRole = 'editor'
): Promise<AdminUser> => {
  // Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Create admin document in Firestore
  const adminData: Omit<AdminUser, 'uid'> = {
    email: firebaseUser.email!,
    name,
    role,
    isActive: true,
    lastLogin: null,
    loginAttempts: 0,
    isLocked: false,
    lockedUntil: null,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  };

  await setDoc(doc(db, 'admins', firebaseUser.uid), adminData);

  // Sign out the newly created user (so the current admin stays logged in)
  await signOut(auth);

  return {
    uid: firebaseUser.uid,
    ...adminData
  };
};

/**
 * Update admin user data
 */
export const updateAdmin = async (uid: string, updates: Partial<AdminUser>): Promise<void> => {
  const adminRef = doc(db, 'admins', uid);
  await updateDoc(adminRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

/**
 * Delete admin user
 */
export const deleteAdmin = async (uid: string): Promise<void> => {
  // Note: Deleting Firebase Auth user requires admin SDK (backend)
  // For now, just deactivate the admin
  await updateAdmin(uid, { isActive: false });
};
