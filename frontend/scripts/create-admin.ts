import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Create First Admin User
 * 
 * This script creates an admin user in Firebase Authentication
 * and adds their admin document to Firestore.
 * 
 * Usage:
 *   npm run create-admin
 * 
 * Or with custom values:
 *   EMAIL=admin@example.com PASSWORD=SecurePass123! NAME="Admin Name" npm run create-admin
 */

// Load .env file manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      const value = values.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
} catch (error) {
  console.error('⚠️  Warning: Could not read .env file. Make sure it exists in the frontend directory.');
  console.error('   Create it with your Firebase credentials before running this script.\n');
}

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config
const missingVars = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value && key !== 'measurementId')
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Error: Missing required Firebase environment variables:\n');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('\n📝 Create a .env file in the frontend directory with your Firebase credentials.');
  console.error('   See ADMIN_QUICKSTART.md for instructions.\n');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const createAdmin = async () => {
  // Get values from environment or use defaults
  const email = process.env.EMAIL || 'admin@ashraffurnitures.com';
  const password = process.env.PASSWORD || 'Admin@123456';
  const name = process.env.NAME || 'Admin User';
  const role = process.env.ROLE || 'admin';

  console.log('\n🔐 Creating Admin User...\n');
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Name: ${name}`);
  console.log(`🎭 Role: ${role}`);
  console.log(`🔑 Password: ${password}\n`);

  try {
    // Create user in Firebase Authentication
    console.log('⏳ Creating user in Firebase Authentication...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log(`✅ User created with UID: ${user.uid}\n`);

    // Create admin document in Firestore
    console.log('⏳ Creating admin document in Firestore...');
    await setDoc(doc(db, 'admins', user.uid), {
      email,
      name,
      role: role as 'admin' | 'editor' | 'viewer',
      isActive: true,
      loginAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      lastLogin: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Admin document created in Firestore\n');
    console.log('🎉 SUCCESS! Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 You can now login at: http://localhost:3001/login\n');
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ ERROR creating admin user:\n');
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('This email is already registered.');
      console.error('Try using a different email or delete the existing user from Firebase Console.\n');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email format.\n');
    } else if (error.code === 'auth/weak-password') {
      console.error('Password is too weak. Use at least 6 characters.\n');
    } else if (error.code === 'auth/network-request-failed') {
      console.error('Network error. Check your internet connection and Firebase configuration.\n');
    } else {
      console.error(`Error: ${error.message}\n`);
    }
    
    console.error('💡 Make sure:');
    console.error('   1. You have created frontend/.env with Firebase credentials');
    console.error('   2. Email/Password auth is enabled in Firebase Console');
    console.error('   3. Your Firebase project is properly configured\n');
    
    process.exit(1);
  }
};

// Check if Firebase is configured
if (!auth || !db) {
  console.error('\n❌ Firebase not configured!');
  console.error('Create frontend/.env file with your Firebase credentials.\n');
  console.error('See ADMIN_SETUP_GUIDE.md for detailed instructions.\n');
  process.exit(1);
}

// Run the script
createAdmin();
