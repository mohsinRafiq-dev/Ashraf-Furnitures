import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
  onAuthChange,
  AdminUser,
  AdminRole,
  auth
} from "../services/firebase";

export interface User {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar?: string;
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  initializeAuth: () => void;
  validateToken: () => boolean;
}

/**
 * Convert Firebase AdminUser to local User type
 */
const adminUserToUser = (adminUser: AdminUser): User => ({
  id: adminUser.uid,
  email: adminUser.email,
  name: adminUser.name,
  role: adminUser.role,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
    adminUser.name
  )}&background=f59e0b&color=fff`,
});

// Flag to prevent multiple simultaneous initializations
let isInitializing = false;
let hasInitialized = false;
let tokenRefreshInterval: number | null = null;

/**
 * Setup automatic token refresh
 * Firebase tokens expire after 1 hour, refresh every 45 minutes
 */
const setupTokenRefresh = (set: any) => {
  // Clear existing interval
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
  }

  // Refresh token every 45 minutes (45 * 60 * 1000 ms)
  tokenRefreshInterval = setInterval(async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        // Force token refresh
        const newToken = await firebaseUser.getIdToken(true);
        set({ token: newToken });
        console.log("[AuthStore] Token refreshed successfully");
      }
    } catch (error) {
      console.error("[AuthStore] Token refresh failed:", error);
    }
  }, 45 * 60 * 1000);
};

/**
 * Clear token refresh interval
 */
const clearTokenRefresh = () => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
    tokenRefreshInterval = null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setToken: (token) => {
        set({ token });
      },

      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          
          // Use Firebase authentication
          const response = await loginWithEmail({ email, password });
          
          const user = adminUserToUser(response.user);
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          
          // Setup automatic token refresh
          setupTokenRefresh(set);
        } catch (error: any) {
          set({ loading: false });
          console.error("Login failed:", error);
          throw new Error(error.message || "Login failed");
        }
      },

      loginWithGoogle: async () => {
        try {
          set({ loading: true });
          
          // Use Firebase Google OAuth (now with popup)
          const response = await loginWithGoogle();
          
          const user = adminUserToUser(response.user);
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          
          // Setup automatic token refresh
          setupTokenRefresh(set);
        } catch (error: any) {
          set({ loading: false });
          console.error("[AuthStore] Google login failed:", error);
          throw new Error(error.message || "Google login failed");
        }
      },

      logout: async () => {
        try {
          // Clear token refresh interval
          clearTokenRefresh();
          
          await firebaseLogout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },

      isAdmin: () => {
        const role = get().user?.role;
        return role === "admin" || role === "editor";
      },

      initializeAuth: async () => {
        // Prevent multiple simultaneous calls
        if (isInitializing) {
          return;
        }
        
        if (hasInitialized) {
          return;
        }
        
        isInitializing = true;
        
        // No need to check redirect result since we're using popup now

        // Subscribe to Firebase auth state changes
        const unsubscribe = onAuthChange(async (adminUser) => {
          
          if (adminUser) {
            // Get Firebase ID token
            const firebaseUser = auth.currentUser;
            const token = firebaseUser ? await firebaseUser.getIdToken() : null;
            
            const user = adminUserToUser(adminUser);
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });
            
            // Setup automatic token refresh for authenticated users
            setupTokenRefresh(set);
          } else {
            // Clear token refresh for logged out users
            clearTokenRefresh();
            
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        });

        // Mark as initialized
        hasInitialized = true;
        isInitializing = false;

        // Store unsubscribe function for cleanup (optional)
        // You could add this to the store if needed for manual cleanup
        return unsubscribe;
      },

      validateToken: () => {
        // With Firebase, token validation is handled automatically
        // Just check if user is authenticated
        return get().isAuthenticated;
      },
    }),
    {
      name: "furniture-auth-store",
      version: 3, // Increment version to clear old JWT-based auth data
      storage: {
        getItem: (key: string) => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: (key: string, value: unknown) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key: string) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
