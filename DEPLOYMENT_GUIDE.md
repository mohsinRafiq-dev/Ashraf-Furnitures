# Deployment & Security Activation Guide

## 🚀 Quick Start - Security Deployment

Your application now has comprehensive security features implemented. Follow these steps to activate them in production.

---

## ⚠️ CRITICAL: Deploy Firestore Rules FIRST

### Step 1: Deploy Firestore Security Rules

The database is currently secured WITH NEW RULES but they need to be deployed to Firebase:

```bash
# Navigate to project root
cd "c:\Users\iamas\Desktop\Furniture Mart"

# Login to Firebase (if not already)
firebase login

# Deploy ONLY the Firestore rules
firebase deploy --only firestore:rules
```

**Expected Output:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
```

### Step 2: Verify Rules Deployment

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. You should see the new rules (verify lines contain `isAdmin()`, `isValidEmail()`)
5. Check the deployment timestamp is recent

---

## 👤 Ensure Admin User Exists

### Verify Admin Document

1. Go to Firebase Console → **Firestore Database**
2. Check if `/admins/{uid}` collection exists
3. Look for a document with your Firebase Auth UID

### Create Admin Document (if missing)

**Option 1: Via Firebase Console**

1. Go to Firestore Database
2. Create collection: `admins`
3. Add document with your Firebase Auth UID as document ID
4. Add these fields:

```javascript
{
  email: "hajiashraffurnitures@gmail.com",  // String
  name: "Admin User",                        // String
  role: "admin",                             // String
  isActive: true,                            // Boolean
  isLocked: false,                           // Boolean
  lockedUntil: null,                         // Null
  loginAttempts: 0,                          // Number
  lastLogin: null,                           // Timestamp (can be null initially)
  createdAt: <Click "Add server timestamp">, // Timestamp
  updatedAt: <Click "Add server timestamp">  // Timestamp
}
```

**Option 2: Via Code**

The backend has a seed script, but you'll need to run it:

```bash
cd backend
npm run seed:admin
```

---

## ✅ Test Security Features

### Test 1: Admin Login (Should Work)

1. Open http://localhost:3000/login (or your production URL)
2. Click "Sign in with Google"
3. Use `hajiashraffurnitures@gmail.com`
4. **Expected**: Successfully logs in → redirects to /admin/dashboard

### Test 2: Unauthorized Email (Should Fail)

1. Try logging in with a different email
2. **Expected**: "Unauthorized email address" error
3. **Result**: Access denied

### Test 3: Rate Limiting (Should Block)

1. Try logging in with wrong password 5 times
2. **Expected**: 
   - After 5th attempt: Orange warning with countdown
   - All login buttons disabled
   - "Login Temporarily Blocked" message
3. Wait for countdown to finish
4. **Result**: Can try again after 15 minutes

### Test 4: Public Access (Should Work)

1. Open site in incognito window (not logged in)
2. Browse products and categories
3. **Expected**: Can view all products
4. Try accessing /admin/dashboard
5. **Expected**: Redirected to /login

### Test 5: Token Refresh (Should Happen Automatically)

1. Log in to admin dashboard
2. Open browser console (F12)
3. Wait 45 minutes (or check back later)
4. **Expected**: See "[AuthStore] Token refreshed successfully" in console
5. Admin features continue to work without re-login

---

## 🔐 Security Features Active

After deployment, these features are **automatically active**:

### ✅ Authentication & Authorization
- Email restriction: Only `hajiashraffurnitures@gmail.com`
- Google OAuth with popup
- Account locking after 5 failed attempts (15min)
- Automatic token refresh every 45 minutes

### ✅ Rate Limiting
- Client-side: 5 attempts per 15 minutes
- Visual countdown timer
- Disabled buttons during lockout
- Auto-clears on successful login

### ✅ Database Security (Firestore Rules)
- Products/Categories: Public read, admin-only write
- Admins: Owner-only access, no privilege escalation
- Analytics: Public tracking, admin-only viewing
- Audit Logs: Immutable, admin-only reading
- Default deny all

### ✅ Audit Logging
- All login attempts logged
- Account lockouts recorded
- Immutable logs in Firestore
- Admin-only access to logs

### ✅ Security Headers
- XSS Protection
- Clickjacking Prevention (X-Frame-Options)
- MIME Sniffing Protection
- Strict Referrer Policy
- Permissions Policy (disabled camera/mic/location)

### ✅ Protected Routes
- Admin dashboard requires authentication
- Redirects to /login if not authenticated
- No direct URL access to admin pages

---

## 📊 Monitoring & Maintenance

### View Audit Logs

**Via Firebase Console:**
1. Go to Firestore Database
2. Open `auditLogs` collection
3. View all login attempts with timestamps

**Fields in Each Log:**
- `email`: Email attempted
- `action`: login_success, login_failed, account_locked, logout
- `timestamp`: When it happened
- `userId`: Firebase UID (if successful)
- `userAgent`: Browser info
- `metadata`: Additional details (attempt number, reason)

### Monitor Security

Check these regularly:
- Failed login attempts (should be minimal)
- Account lockout events (investigate patterns)
- Unusual access times or locations
- Successful logins from new devices

### View Analytics

Admin Dashboard → Analytics Tab:
- Product engagement (views, cart, wishlist)
- Session tracking
- Device types
- Traffic sources

---

## 🚨 Emergency Procedures

### If You Suspect Unauthorized Access:

1. **Immediate Actions**
   ```bash
   # Revoke all sessions via Firebase Console
   # Go to: Authentication → Sign-in method → Advanced → Revoke refresh tokens
   ```

2. **Lock Admin Account**
   - Go to Firestore → `/admins/{uid}`
   - Set `isLocked` to `true`
   - Set `lockedUntil` to future timestamp

3. **Review Logs**
   - Check `auditLogs` collection for suspicious activity
   - Look for failed attempts from unknown IPs
   - Check for unusual times or patterns

4. **Reset Security**
   ```bash
   # Change Firebase API keys
   # Update .env files
   # Redeploy application
   ```

### If Locked Out Accidentally:

1. Go to Firebase Console → Firestore
2. Open `/admins/your-uid`
3. Set `isLocked` to `false`
4. Set `lockedUntil` to `null`
5. Set `loginAttempts` to `0`
6. Try logging in again

---

## 📝 Configuration Files Reference

### Frontend Environment (.env)
```bash
# Location: frontend/.env

VITE_ADMIN_EMAIL=hajiashraffurnitures@gmail.com

# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firestore Rules
```bash
# Location: firestore.rules
# Status: ✅ Ready for deployment
# Lines: 118

# Deploy with:
firebase deploy --only firestore:rules
```

### Security Headers
```bash
# Location: frontend/vite.config.ts
# Auto-applied in dev server
# For production, check hosting provider docs
```

---

## 🔄 Regular Security Tasks

### Weekly
- [ ] Review audit logs for failed attempts
- [ ] Check for locked accounts
- [ ] Monitor analytics for unusual patterns

### Monthly
- [ ] Review Firestore rules for any needed updates
- [ ] Check Firebase console for security recommendations
- [ ] Update dependencies (`npm audit`)
- [ ] Test all security features still working

### Quarterly
- [ ] Full security audit
- [ ] Review admin access logs
- [ ] Update security documentation
- [ ] Conduct security training

---

## 💡 Tips & Best Practices

### DO:
- ✅ Keep Firebase secrets in `.env` files (never commit)
- ✅ Use environment-specific configs for dev/staging/prod
- ✅ Regularly review audit logs
- ✅ Test security features after every deployment
- ✅ Keep dependencies updated
- ✅ Monitor Firebase usage and quotas

### DON'T:
- ❌ Share Firebase config publicly
- ❌ Disable security features for "convenience"
- ❌ Ignore failed login attempt patterns
- ❌ Allow multiple admin emails without proper vetting
- ❌ Deploy without testing first
- ❌ Forget to deploy Firestore rules after changes

---

## 🎯 Deployment Checklist

Before going live:

- [ ] Firestore rules deployed and tested
- [ ] Admin document exists in Firestore
- [ ] Admin can log in successfully
- [ ] Non-admin email gets rejected
- [ ] Rate limiting works (test 5 attempts)
- [ ] Public can view products without login
- [ ] Security headers visible in browser devtools
- [ ] Audit logs being created
- [ ] Token refresh happening automatically
- [ ] No console errors in production build
- [ ] Environment variables set correctly
- [ ] Firebase project properly configured
- [ ] Hosting configuration includes security headers
- [ ] SSL certificate active (HTTPS)
- [ ] All tests passing

---

## 📞 Support & Resources

### Documentation
- `SECURITY_DOCUMENTATION.md` - Complete security reference
- `firestore.rules` - Database security rules
- `frontend/src/store/authStore.ts` - Auth implementation
- `frontend/src/pages/Login.tsx` - Login with rate limiting

### Firebase Resources
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com)

### Testing Tools
- [Security Headers Test](https://securityheaders.com)
- [SSL Test](https://www.ssllabs.com/ssltest/)
- Firebase Rules Playground (in Firebase Console)

---

## ✨ What's Been Secured

### From Completely Vulnerable:
❌ **Before**: Database open to public (`allow read, write: if true`)
❌ **Before**: No rate limiting
❌ **Before**: No account locking
❌ **Before**: Tokens expired without refresh
❌ **Before**: No audit logging
❌ **Before**: Minimal security headers

### To Production-Ready Security:
✅ **After**: Comprehensive Firestore rules with authentication
✅ **After**: Client-side rate limiting (5 attempts/15min)
✅ **After**: Server-side account locking (15min after 5 attempts)
✅ **After**: Automatic token refresh every 45 minutes
✅ **After**: Complete audit trail (immutable logs)
✅ **After**: Full security headers (XSS, clickjacking, etc.)

---

## 🎉 You're Ready!

Your application is now secured with enterprise-level security features. Follow the deployment steps above to activate everything in production.

**Next Steps:**
1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Verify admin document exists
3. Test all security features
4. Monitor audit logs regularly

**Questions or Issues?**
- Check `SECURITY_DOCUMENTATION.md` for detailed information
- Review Firebase Console for any error messages
- Check browser console for helpful debug logs
- Test in development environment first

---

**Last Updated**: December 2024
**Status**: ✅ Ready for Production Deployment
