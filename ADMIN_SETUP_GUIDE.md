# Admin Dashboard Setup Guide

## Complete Authentication System Setup

Your admin dashboard now has **secure authentication** with both **Email/Password** and **Google Sign-In**.

---

## 🔥 Firebase Configuration

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the **gear icon** → **Project Settings**
4. Scroll down to **Your apps** section
5. Click the **Web app** icon `</>` to register a web app
6. Copy the config values

### Step 2: Create `.env` File

Create `frontend/.env` file with your Firebase credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🔐 Enable Authentication Methods

### Email/Password Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. **Enable** the first switch (Email/Password)
4. Click **Save**

### Google Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Google**
3. **Enable** the switch
4. Enter your **Project support email**
5. Click **Save**

### Configure Authorized Domains

1. In Authentication → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (already there)
   - Your production domain (e.g., `yourdomain.com`)

---

## 👤 Create First Admin User

### Option 1: Using Firebase Console (Recommended)

1. **Enable Email/Password Authentication** (see above)

2. **Create User in Authentication**:
   - Go to Firebase Console → **Authentication** → **Users**
   - Click **Add user**
   - Email: `admin@yourstore.com`
   - Password: Create a strong password
   - Click **Add user**
   - **Copy the User UID** (you'll need it)

3. **Create Admin Document in Firestore**:
   - Go to Firebase Console → **Firestore Database**
   - Click **Start collection**
   - Collection ID: `admins`
   - Click **Next**
   - Document ID: Paste the **User UID** you copied
   - Add these fields:
     ```
     email: "admin@yourstore.com" (string)
     name: "Admin User" (string)
     role: "admin" (string)
     isActive: true (boolean)
     loginAttempts: 0 (number)
     isLocked: false (boolean)
     lockedUntil: null
     lastLogin: null
     createdAt: [Click timestamp]
     updatedAt: [Click timestamp]
     ```
   - Click **Save**

### Option 2: Using Script (After Firebase Setup)

1. Create a script file `frontend/scripts/create-admin.ts`:

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../src/config/firebase';

const createAdmin = async () => {
  const email = 'admin@yourstore.com';
  const password = 'YourStrongPassword123!'; // Change this!
  const name = 'Admin User';

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ User created in Authentication:', user.uid);

    // Create admin document in Firestore
    await setDoc(doc(db, 'admins', user.uid), {
      email,
      name,
      role: 'admin',
      isActive: true,
      loginAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      lastLogin: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Admin document created in Firestore');
    console.log('🎉 Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
```

2. Run the script:
```bash
cd frontend
npx tsx scripts/create-admin.ts
```

---

## 🔒 Deploy Secure Firestore Rules

### Development (Current - Open Access)
Your current rules allow public access for development.

### Production (Secure)
When ready to go live, deploy secure rules:

1. Replace `firestore.rules` content with `firestore.rules.secure`
2. Deploy rules:
```bash
firebase deploy --only firestore:rules
```

---

## 🚀 Testing the Login System

### 1. Start Development Server
```bash
cd frontend
npm run dev
```

### 2. Test Email/Password Login
1. Go to http://localhost:3001/login
2. Enter admin credentials:
   - Email: `admin@yourstore.com`
   - Password: Your password
3. Click **Sign In**
4. Should redirect to http://localhost:3001/admin/dashboard

### 3. Test Google Sign-In
1. Go to http://localhost:3001/login  
2. Click **Sign in with Google**
3. Select your Google account
4. **First time**: Creates admin account automatically
5. Should redirect to admin dashboard

---

## 🔐 Security Features

### ✅ Implemented Security
- **Firebase Authentication** - Secure token-based auth
- **Protected Routes** - Admin dashboard requires login
- **Role-Based Access** - Admin, Editor, Viewer roles
- **Account Locking** - 5 failed attempts = 15 min lock
- **Audit Logging** - All auth events logged
- **Google OAuth** - Secure social login
- **Password Reset** - Email-based password recovery

### 🛡️ Firestore Rules
- **Public Read** - Products and categories (for customers)
- **Admin Write** - Only authenticated admins can modify
- **Analytics** - Anyone can create, admins can read
- **Audit Logs** - Read-only, no deletion

---

## 📝 Admin Roles

### Admin (Super User)
- Full access to everything
- Can create/delete other admins
- Can modify products, categories
- Can view analytics

### Editor
- Can create/edit/delete products and categories
- Cannot manage other admins
- Can view analytics

### Viewer
- Read-only access
- Can view products, categories, analytics
- Cannot make changes

---

## 🐛 Troubleshooting

### "User is not an admin" Error
**Problem**: User authenticated but not in `admins` collection.  
**Solution**: Create admin document in Firestore with their UID.

### "Missing Firebase environment variables"
**Problem**: `.env` file missing or incorrect.  
**Solution**: Create `frontend/.env` with Firebase config values.

### "Firebase: Error (auth/unauthorized-domain)"
**Problem**: Domain not authorized in Firebase.  
**Solution**: Add domain in Firebase Console → Authentication → Authorized domains.

### Google Sign-In popup closes immediately
**Problem**: OAuth configuration missing.  
**Solution**: 
1. Enable Google provider in Firebase Console
2. Add authorized domains
3. Check browser pop-up blocker

### "Permission denied" when accessing Firestore
**Problem**: Firestore rules blocking access.  
**Solution**: 
1. Check rules in Firebase Console → Firestore → Rules
2. For development, use open rules (current)
3. For production, deploy secure rules

---

## 📋 Quick Checklist

- [ ] Firebase project created
- [ ] `.env` file created with credentials
- [ ] Email/Password authentication enabled
- [ ] Google authentication enabled
- [ ] First admin user created in Authentication
- [ ] Admin document created in Firestore
- [ ] Authorized domains configured
- [ ] Login tested successfully
- [ ] Admin dashboard accessible

---

## 🎯 Next Steps

1. **Test the system**: Try logging in with both methods
2. **Add more admins**: Use the admin dashboard (coming soon)
3. **Deploy secure rules**: Before production launch
4. **Set up email templates**: Customize password reset emails
5. **Add 2FA** (Optional): Extra security layer

---

## 📞 Need Help?

Check the browser console for detailed error messages:
- Press F12 → Console tab
- Look for Firebase error codes
- Check network tab for failed requests

Common error codes:
- `auth/user-not-found`: Email doesn't exist
- `auth/wrong-password`: Incorrect password
- `auth/invalid-email`: Email format invalid
- `auth/user-disabled`: Account inactive in Firebase

---

**You now have a complete, secure admin authentication system! 🎉**
