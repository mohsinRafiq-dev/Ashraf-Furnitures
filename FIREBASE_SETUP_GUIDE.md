# Firebase Migration Setup Guide

## Prerequisites
1. Node.js (v18 or higher)
2. Firebase account
3. Firebase CLI installed globally: `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "furniture-mart" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** authentication
4. Enable **Google** authentication (optional)
   - Add authorized domains (your production domain)
   - Download Google OAuth credentials

### Create Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode**
4. Select database location (choose closest to your users)
5. Click "Enable"

### Enable Firebase Storage
1. In Firebase Console, go to **Storage**
2. Click "Get started"
3. Choose **Start in production mode**
4. Click "Done"

### Enable Firebase Hosting (for deployment)
1. In Firebase Console, go to **Hosting**
2. Click "Get started"
3. Follow the setup wizard

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (</>)
4. Register your app (name: "Furniture Mart Web")
5. Copy the Firebase configuration object

## Step 4: Configure Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Create `.env` file from template:
   ```bash
   cp .env.template .env
   ```

3. Edit `.env` and paste your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Step 5: Deploy Security Rules

1. Login to Firebase CLI:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project root:
   ```bash
   cd "c:\Users\iamas\Desktop\Furniture Mart"
   firebase init
   ```

3. Select the following:
   - ✅ Firestore
   - ✅ Storage
   - ✅ Hosting
   
4. Choose options:
   - Use existing project: Select your Firebase project
   - Firestore rules: `firestore.rules`
   - Firestore indexes: `firestore.indexes.json`
   - Storage rules: `storage.rules`
   - Public directory: `frontend/dist`
   - Single-page app: **Yes**
   - GitHub deploys: **No**

5. Deploy Firestore rules and indexes:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

6. Deploy Storage rules:
   ```bash
   firebase deploy --only storage
   ```

## Step 6: Create First Admin User

Since Firebase Auth doesn't have a direct admin panel, you need to create the first admin manually.

### Option A: Using Firebase Console (Recommended)

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Enter email and password
4. Copy the generated **User UID**
5. Go to **Firestore Database**
6. Create a new collection: `admins`
7. Add a document with ID = the User UID you copied
8. Add the following fields:
   ```
   email: "your-admin@email.com" (string)
   name: "Admin Name" (string)
   role: "admin" (string)
   isActive: true (boolean)
   lastLogin: null
   loginAttempts: 0 (number)
   isLocked: false (boolean)
   lockedUntil: null
   createdAt: [current timestamp]
   updatedAt: [current timestamp]
   ```

### Option B: Using Firebase Admin SDK (Temporary Script)

Create a temporary Node.js script to initialize the first admin:

```javascript
// init-admin.js (create this file temporarily)
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Download service account key from Firebase Console > Project Settings > Service Accounts
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createFirstAdmin() {
  const email = 'admin@furnituremartcom';
  const password = 'your-secure-password';
  const name = 'Admin User';

  try {
    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Create Firestore admin document
    await db.collection('admins').doc(userRecord.uid).set({
      email: userRecord.email,
      name,
      role: 'admin',
      isActive: true,
      lastLogin: null,
      loginAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ First admin created successfully!');
    console.log('UID:', userRecord.uid);
    console.log('Email:', email);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }

  process.exit();
}

createFirstAdmin();
```

Run the script:
```bash
node init-admin.js
```

**Important:** Delete `init-admin.js` and `serviceAccountKey.json` after creating the first admin!

## Step 7: Migrate Existing Data (Optional)

If you have existing MongoDB data, create a migration script:

### Export MongoDB Data

```bash
# Export products
mongoexport --db=furniture_mart --collection=products --out=products.json --jsonArray

# Export categories
mongoexport --db=furniture_mart --collection=categories --out=categories.json --jsonArray
```

### Import to Firestore

Create a migration script (`migrate-data.js`):

```javascript
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateProducts() {
  const products = JSON.parse(readFileSync('./products.json', 'utf8'));
  
  for (const product of products) {
    const { _id, __v, ...productData } = product;
    
    await db.collection('products').add({
      ...productData,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(product.createdAt)),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date(product.updatedAt))
    });
  }
  
  console.log(`✅ Migrated ${products.length} products`);
}

async function migrateCategories() {
  const categories = JSON.parse(readFileSync('./categories.json', 'utf8'));
  
  for (const category of categories) {
    const { _id, __v, ...categoryData } = category;
    
    await db.collection('categories').add({
      ...categoryData,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(category.createdAt)),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date(category.updatedAt))
    });
  }
  
  console.log(`✅ Migrated ${categories.length} categories`);
}

async function migrate() {
  await migrateProducts();
  await migrateCategories();
  process.exit();
}

migrate();
```

Run migration:
```bash
node migrate-data.js
```

## Step 8: Build and Test Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Test the application:
   - Visit `http://localhost:5173`
   - Browse products (should work without auth)
   - Try to access admin panel at `http://localhost:5173/admin`
   - Login with your admin credentials
   - Test product CRUD operations
   - Test category CRUD operations
   - Test image uploads

## Step 9: Deploy to Firebase Hosting

1. Build production bundle:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   cd ..
   firebase deploy --only hosting
   ```

3. Your app will be available at:
   ```
   https://your-project-id.web.app
   https://your-project-id.firebaseapp.com
   ```

## Step 10: Configure Custom Domain (Optional)

1. In Firebase Console, go to **Hosting**
2. Click "Add custom domain"
3. Follow the instructions to verify domain ownership
4. Update DNS records as instructed
5. Wait for SSL certificate provisioning (can take 24-48 hours)

## Post-Migration Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore database created
- [ ] Firebase Storage enabled
- [ ] Security rules deployed
- [ ] Firestore indexes deployed
- [ ] First admin user created
- [ ] Existing data migrated (if applicable)
- [ ] Frontend environment variables configured
- [ ] Application tested locally
- [ ] Application deployed to Firebase Hosting
- [ ] Custom domain configured (if applicable)

## Testing Checklist

### Public Features
- [ ] Product listing loads correctly
- [ ] Product search works
- [ ] Product filtering works
- [ ] Product detail page works
- [ ] Category browsing works
- [ ] Cart functionality works (client-side)
- [ ] Wishlist functionality works

### Admin Features
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Product CRUD operations work
- [ ] Category CRUD operations work
- [ ] Image upload works
- [ ] Image cropping works
- [ ] Real-time updates work
- [ ] Analytics data displays

### Security
- [ ] Unauthenticated users cannot access admin panel
- [ ] Unauthenticated users cannot create/update/delete products
- [ ] Unauthenticated users cannot create/update/delete categories
- [ ] Unauthenticated users cannot upload images
- [ ] Public users can read products and categories

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Check Firestore security rules are deployed
- Verify user is authenticated
- Verify user exists in `admins` collection with correct role

### Error: "Firebase: Error (auth/network-request-failed)"
- Check internet connection
- Verify Firebase API key is correct
- Check if Firebase project is active

### Images not uploading
- Check Storage security rules are deployed
- Verify user is authenticated with admin/editor role
- Check image file size (max 10MB)
- Check browser console for detailed errors

### Real-time updates not working
- Verify Firestore listeners are properly set up
- Check browser console for connection errors
- Test with manual page refresh

## Cost Optimization Tips

1. **Enable Firestore indexes** for frequently queried fields
2. **Use pagination** to limit data fetched per request
3. **Optimize images** before uploading (already implemented)
4. **Use Firestore offline persistence** to reduce reads
5. **Monitor usage** in Firebase Console regularly
6. **Set up billing alerts** to avoid unexpected charges

## Maintenance

### Regular Tasks
- Monitor Firebase usage in Console
- Review audit logs regularly
- Update security rules as needed
- Backup Firestore data monthly
- Update Firebase SDK dependencies quarterly

### Backup Strategy
Use Firebase's built-in backup:
```bash
# Export Firestore data
gcloud firestore export gs://[BUCKET_NAME]

# Export Auth users (requires Admin SDK)
```

## Support & Resources

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Firebase Status: https://status.firebase.google.com/
- Stack Overflow: Tag `firebase` for questions

## Next Steps

After successful migration:
1. Remove backend server code (optional, keep as backup)
2. Cancel MongoDB hosting (if applicable)
3. Update DNS if using custom domain
4. Monitor application performance
5. Gather user feedback
6. Iterate and improve

---

**Congratulations! Your MERN application is now fully serverless with Firebase! 🎉**
