# Firebase Migration Plan - Furniture Mart

## Overview
Migration from MERN stack (MongoDB/Express/Node.js) to fully serverless Firebase architecture.

## Complete Feature Checklist

### ✅ Backend Features to Preserve
- [x] Product CRUD (all fields including variants, specs, images, SKU, slug)
- [x] Category CRUD (name, description, color, image, slug, productCount)
- [x] Admin authentication with role-based access
- [x] Account security (rate limiting, account locking)
- [x] Image uploads and optimization
- [x] Advanced product search & filtering
- [x] Analytics tracking (visitor sessions, product views)
- [x] Audit logging (login attempts, IP tracking)
- [x] Auto-generated slugs for products/categories
- [x] SKU uniqueness validation
- [x] Google OAuth for admin login

### ✅ Frontend Features to Preserve
- [x] Product listing with filters & pagination
- [x] Product detail view with image carousel
- [x] Category browsing
- [x] Admin panel (hidden, protected routes)
- [x] Product management UI (CRUD, image upload/crop)
- [x] Category management UI (CRUD, image upload/crop)
- [x] Cart management (client-side only)
- [x] Wishlist functionality
- [x] Search with debouncing
- [x] Analytics dashboard
- [x] Responsive design
- [x] Toast notifications
- [x] Loading states & error handling
- [x] WhatsApp ordering (checkout form)

## Firebase Architecture

### 1. Firestore Database Structure
```
/products/{productId}
  - name: string
  - description: string
  - price: number
  - category: string
  - images: array<{url, alt, isPrimary}>
  - stock: number
  - sku: string (unique)
  - slug: string (unique, indexed)
  - featured: boolean
  - variants: array<{name, values[]}>
  - specifications: array<{name, value}>
  - rating: number
  - reviews: number
  - createdAt: timestamp
  - updatedAt: timestamp

/categories/{categoryId}
  - name: string (unique)
  - description: string
  - color: string
  - image: string
  - slug: string (unique, indexed)
  - productCount: number
  - createdAt: timestamp
  - updatedAt: timestamp

/admins/{userId}
  - name: string
  - email: string (from Firebase Auth)
  - role: string (admin|editor|viewer)
  - isActive: boolean
  - lastLogin: timestamp
  - createdAt: timestamp
  - updatedAt: timestamp

/analytics/sessions/{sessionId}
  - ipAddress: string
  - userAgent: string
  - startTime: timestamp
  - endTime: timestamp
  - pageViews: number
  - referrer: string
  - deviceType: string
  - source: string

/analytics/productViews/{viewId}
  - productId: string
  - productName: string
  - sessionId: string
  - viewedAt: timestamp
  - timeSpent: number
  - action: string

/auditLogs/{logId}
  - action: string
  - email: string
  - ipAddress: string
  - userAgent: string
  - status: string
  - reason: string
  - timestamp: timestamp (TTL 90 days via Cloud Function)
```

### 2. Firebase Authentication
- **Email/Password** authentication for admins
- **Google OAuth** as alternative login method
- Custom claims for role-based access control
- Security rules enforce admin-only access to writes

### 3. Firebase Storage Structure
```
/products/{productId}/{imageId}.{ext}
/categories/{categoryId}/{imageId}.{ext}
```

### 4. Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin' &&
             get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isActive == true;
    }
    
    function isEditor() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role in ['admin', 'editor'] &&
             get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isActive == true;
    }
    
    // Products - Public read, Admin write
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isEditor();
    }
    
    // Categories - Public read, Admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isEditor();
    }
    
    // Admins - Only admins can read/write
    match /admins/{userId} {
      allow read: if isSignedIn() && request.auth.uid == userId;
      allow write: if isAdmin();
    }
    
    // Analytics - Authenticated read, public write for tracking
    match /analytics/{document=**} {
      allow read: if isSignedIn();
      allow write: if true; // Allow public tracking
    }
    
    // Audit Logs - Only admins can read
    match /auditLogs/{logId} {
      allow read: if isAdmin();
      allow write: if true; // System writes
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             firestore.get(/databases/(default)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isEditor() {
      return isSignedIn() && 
             firestore.get(/databases/(default)/documents/admins/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
    
    // Product images - Public read, Editor write
    match /products/{productId}/{imageId} {
      allow read: if true;
      allow write: if isEditor();
    }
    
    // Category images - Public read, Editor write
    match /categories/{categoryId}/{imageId} {
      allow read: if true;
      allow write: if isEditor();
    }
  }
}
```

### 5. Migration Steps

#### Phase 1: Firebase Setup
1. Create Firebase project
2. Install Firebase SDK in frontend
3. Configure Firebase (firebaseConfig.ts)
4. Setup environment variables

#### Phase 2: Authentication Migration
1. Enable Firebase Auth (Email/Password + Google)
2. Create admin management utilities
3. Migrate admin users to Firebase Auth + Firestore
4. Update login/logout logic
5. Implement custom claims for roles
6. Update protected routes

#### Phase 3: Database Migration
1. Create Firestore data models
2. Migrate products from MongoDB to Firestore
3. Migrate categories from MongoDB to Firestore
4. Migrate admin records
5. Setup Firestore indexes
6. Deploy security rules

#### Phase 4: Storage Migration
1. Enable Firebase Storage
2. Migrate existing images from Cloudinary
3. Update image upload logic
4. Implement image deletion cleanup
5. Deploy storage rules

#### Phase 5: Frontend Integration
1. Replace API client with Firebase SDK
2. Implement real-time listeners (onSnapshot)
3. Update product management UI
4. Update category management UI
5. Update admin dashboard
6. Update analytics tracking
7. Update audit logging

#### Phase 6: Deployment
1. Build optimized frontend
2. Configure Firebase Hosting
3. Deploy to Firebase Hosting
4. Setup custom domain (optional)
5. Test all features
6. Verify security rules

#### Phase 7: Testing & Validation
1. Test public product browsing
2. Test admin authentication
3. Test product CRUD operations
4. Test category CRUD operations
5. Test image uploads
6. Test search & filtering
7. Test real-time updates
8. Test WhatsApp ordering flow
9. Verify security rules
10. Performance testing

## Key Differences

### What Changes
- MongoDB → Firestore (NoSQL remains, but different syntax)
- Express REST API → Firebase SDK (direct client-server communication)
- JWT → Firebase Auth tokens
- Backend image upload → Client-side upload to Firebase Storage
- Server-side filtering/pagination → Client-side + Firestore queries
- Cloudinary → Firebase Storage (with optimization options)

### What Stays the Same
- React frontend structure
- UI/UX design
- Admin panel workflow
- Cart management (client-side)
- WhatsApp ordering flow
- All existing features and fields

## Cost Estimation (Firebase Free Tier)
- **Firestore:** 50K reads/day, 20K writes/day, 1GB storage
- **Auth:** Unlimited
- **Storage:** 5GB storage, 1GB/day downloads
- **Hosting:** 10GB/month, 360MB/day bandwidth

**Expected Usage (Small Business):**
- Products: ~200 documents
- Categories: ~20 documents
- Daily reads: ~2000 (well under limit)
- Daily writes: ~50 (well under limit)
- Images: ~500MB (well under limit)

✅ **Project should remain within free tier**

## Rollback Plan
- Keep MongoDB data backup
- Keep backend code in separate branch
- Document all changes
- Test thoroughly before removing old backend
