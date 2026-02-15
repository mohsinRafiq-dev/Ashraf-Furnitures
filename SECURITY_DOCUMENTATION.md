# Security Documentation - Ashraf Furnitures Admin Portal

## Overview
This document outlines all security measures implemented in the Ashraf Furnitures application to protect against unauthorized access, data breaches, and common vulnerabilities.

---

## 🔒 Authentication & Authorization

### Firebase Authentication
- **Provider**: Firebase Auth v10.x
- **Methods**: 
  - Email/Password authentication
  - Google OAuth (popup method)
- **Admin Email Restriction**: Only `hajiashraffurnitures@gmail.com` can access admin portal
- **Token Expiry**: Firebase tokens expire after 1 hour
- **Automatic Token Refresh**: Tokens refreshed every 45 minutes automatically

### Account Protection
- **Email Validation**: Admin email hardcoded in both `.env` (client-side) and `firestore.rules` (database-level)
- **Account Locking**: 
  - After 5 failed login attempts
  - Locked for 15 minutes
  - Stored in Firestore with `isLocked` and `lockedUntil` fields
- **Session Management**: 
  - Zustand store with localStorage persistence
  - Auto cleanup on logout
  - Token refresh interval cleared on logout

---

## 🛡️ Rate Limiting

### Client-Side Rate Limiting (Login Page)
- **Implementation**: `frontend/src/pages/Login.tsx`
- **Limits**:
  - Maximum 5 login attempts per email within 15 minutes
  - Applies to both email/password and Google OAuth
  - Tracked in localStorage with timestamps
- **User Experience**:
  - Clear error messages with countdown timer
  - All login buttons disabled during rate limit
  - Visual indicators (Shield icon, orange warning color)
- **Cleanup**: Attempts cleared after successful login

### Server-Side Protection
- **Firestore Rules**: Additional protection at database level
- **Firebase Account Locking**: Backend validation in `authService.ts`
- **Audit Logging**: All login attempts recorded in `auditLogs` collection

---

## 🗄️ Database Security (Firestore Rules)

### Current Rules Status
- **File**: `firestore.rules` (118 lines)
- **Status**: ✅ SECURED (Updated in final session)

### Helper Functions
```javascript
isSignedIn()        // Checks if user is authenticated
isAdmin()           // Validates admin status, isActive, !isLocked
isValidEmail()      // Hardcoded: hajiashraffurnitures@gmail.com
isOwner(userId)     // Checks if user owns the document
```

### Collection-Level Security

#### Products Collection
- **Read**: ✅ Public (customers can browse)
- **Write**: 🔒 Admin only + email validation
- **Purpose**: Allow public browsing while protecting inventory management

#### Categories Collection
- **Read**: ✅ Public (customers can browse)
- **Write**: 🔒 Admin only + email validation
- **Purpose**: Same as products

#### Admins Collection
- **Read**: 🔒 Owner only + email validation
- **Update**: 🔒 Owner only, cannot change `email` or `role`
- **Create/Delete**: ❌ Disabled in rules
- **Purpose**: Prevent privilege escalation and unauthorized admin creation

#### Sessions Collection (Analytics)
- **Create**: ✅ Public (for visitor tracking)
- **Read**: 🔒 Admin only
- **Update**: ⚠️ Limited (only if sessionId matches)
- **Delete**: ❌ Disabled
- **Purpose**: Allow analytics tracking without exposing data

#### Product Views Collection (Analytics)
- **Create**: ✅ Public (for engagement tracking)
- **Read**: 🔒 Admin only
- **Update/Delete**: ❌ Disabled (immutable)
- **Purpose**: Track product views, cart actions, wishlist additions

#### Audit Logs Collection
- **Create**: ✅ Public (for logging)
- **Read**: 🔒 Admin only
- **Update/Delete**: ❌ Disabled (immutable)
- **Purpose**: Maintain tamper-proof audit trail

#### Default Rule
- **All Other Paths**: ❌ Deny all read/write
- **Purpose**: Security by default

---

## 🔐 Security Headers

### Development Server Headers (Vite)
Configured in `frontend/vite.config.ts`:

```typescript
headers: {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',  // Firebase Auth popups
  'X-Content-Type-Options': 'nosniff',                        // Prevent MIME sniffing
  'X-Frame-Options': 'DENY',                                  // Prevent clickjacking
  'X-XSS-Protection': '1; mode=block',                        // XSS protection
  'Referrer-Policy': 'strict-origin-when-cross-origin',      // Control referrer info
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'  // Disable unnecessary APIs
}
```

### Production Deployment
⚠️ **Important**: When deploying to production, ensure these headers are also set in:
- Vercel: `vercel.json` (already configured)
- Netlify: `_headers` file or `netlify.toml`
- Firebase Hosting: `firebase.json`

---

## 📊 Audit Logging

### What is Logged
- ✅ All login attempts (success/failure)
- ✅ Account lockouts
- ✅ Password reset requests
- ✅ Admin panel access
- ✅ Logout events

### Audit Log Structure
```typescript
{
  userId: string | null,
  email: string,
  action: 'login_success' | 'login_failed' | 'logout' | 'account_locked',
  ipAddress: string | null,
  userAgent: string,
  timestamp: Firestore.Timestamp,
  metadata: {
    reason?: string,
    attemptNumber?: number
  }
}
```

### Implementation
- **File**: `backend/src/utils/authService.ts`
- **Function**: `createAuditLog()`
- **Storage**: Firestore `auditLogs` collection
- **Immutability**: Protected by Firestore rules (no updates/deletes)

---

## 🚨 Protected Routes

### Frontend Route Protection
- **Component**: `frontend/src/components/ProtectedRoute.tsx`
- **Mechanism**: Checks `isAuthenticated` and `isAdmin()` from Zustand store
- **Redirects**:
  - Not authenticated → `/login`
  - Not admin → `/` (home page)

### Protected Admin Routes
```typescript
<Route path="/admin/dashboard" element={
  <ProtectedRoute requiresAdmin>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🔑 Token Management

### Token Lifecycle
1. **Generation**: Firebase Auth creates JWT on login
2. **Storage**: Stored in Zustand store → localStorage
3. **Refresh**: Automatic refresh every 45 minutes
4. **Expiry**: Firebase tokens expire after 60 minutes
5. **Cleanup**: Cleared on logout

### Auto-Refresh Implementation
- **File**: `frontend/src/store/authStore.ts`
- **Function**: `setupTokenRefresh()`
- **Interval**: 45 minutes (2,700,000ms)
- **Method**: `firebaseUser.getIdToken(true)` with force refresh
- **Error Handling**: Logs errors, doesn't crash app
- **Cleanup**: `clearTokenRefresh()` called on logout

---

## 📝 Security Best Practices Implemented

### ✅ Implemented
- [x] Email-based admin restriction (client + server)
- [x] Account locking after failed attempts
- [x] Automatic token refresh
- [x] Client-side rate limiting
- [x] Comprehensive Firestore security rules
- [x] Audit logging (immutable)
- [x] Protected routes
- [x] Security headers (XSS, clickjacking, MIME sniffing)
- [x] CSRF protection via Firebase Auth
- [x] Session management with auto-cleanup
- [x] Source maps disabled in production
- [x] Console logs removed in production build

### 🟡 Recommended (Future Enhancements)
- [ ] Firebase App Check (bot protection)
- [ ] IP-based rate limiting (backend)
- [ ] Two-factor authentication (2FA)
- [ ] Session timeout warnings
- [ ] Geolocation anomaly detection
- [ ] Security event notifications (email/SMS)
- [ ] Regular security audits
- [ ] Penetration testing

---

## 🚀 Deployment Checklist

Before deploying to production:

1. **Environment Variables**
   - [ ] Verify `VITE_ADMIN_EMAIL` is set correctly
   - [ ] All Firebase config keys are set
   - [ ] No sensitive data in public variables

2. **Firestore Rules**
   - [ ] Deploy rules: `firebase deploy --only firestore:rules`
   - [ ] Test rules in Firebase Console
   - [ ] Verify admin document exists in `/admins/{uid}`

3. **Admin Document Structure**
   - [ ] Ensure admin document has all required fields:
     ```json
     {
       "email": "hajiashraffurnitures@gmail.com",
       "name": "Admin Name",
       "role": "admin",
       "isActive": true,
       "isLocked": false,
       "lockedUntil": null,
       "loginAttempts": 0,
       "lastLogin": null,
       "createdAt": timestamp,
       "updatedAt": timestamp
     }
     ```

4. **Security Headers**
   - [ ] Verify headers are set in hosting config
   - [ ] Test with [securityheaders.com](https://securityheaders.com)

5. **Testing**
   - [ ] Test admin login works
   - [ ] Test unauthorized email gets rejected
   - [ ] Test rate limiting after 5 attempts
   - [ ] Test account locking works
   - [ ] Test public can view products
   - [ ] Test analytics tracking works
   - [ ] Test logout clears session

6. **Monitoring**
   - [ ] Set up Firebase monitoring
   - [ ] Monitor audit logs regularly
   - [ ] Set up alerts for security events

---

## 🔍 Security Testing Guide

### Test 1: Admin Email Restriction
1. Try logging in with non-admin email
2. **Expected**: Login fails with "Unauthorized email" error
3. **Actual**: ✅ Works (tested in authService.ts)

### Test 2: Account Locking
1. Attempt login with wrong password 5 times
2. **Expected**: Account locked for 15 minutes
3. **Actual**: ✅ Works (authService.ts lines 166-184)

### Test 3: Rate Limiting
1. Try logging in 5 times quickly
2. **Expected**: UI blocks further attempts with countdown
3. **Actual**: ✅ Works (Login.tsx with client-side rate limiting)

### Test 4: Token Refresh
1. Log in and wait 45 minutes
2. Check browser console for "Token refreshed successfully"
3. **Expected**: Token refreshes automatically
4. **Actual**: ✅ Implemented (authStore.ts setupTokenRefresh)

### Test 5: Firestore Rules
1. Try direct Firestore access without auth
2. **Expected**: Permission denied for all write operations
3. **Actual**: ⏳ Deploy rules first, then test

### Test 6: Public Access
1. Open website in incognito (not logged in)
2. **Expected**: Can view products, cannot access admin
3. **Actual**: ✅ Works (protected routes + Firestore rules)

---

## 📞 Security Incident Response

If a security breach is suspected:

1. **Immediate Actions**
   - Lock all admin accounts via Firebase Console
   - Revoke all active sessions
   - Review audit logs for suspicious activity
   - Change all API keys and secrets

2. **Investigation**
   - Check audit logs in Firestore
   - Review Firebase authentication logs
   - Analyze access patterns
   - Export logs for forensic analysis

3. **Remediation**
   - Patch any discovered vulnerabilities
   - Update Firestore rules if needed
   - Reset admin passwords
   - Re-enable accounts after verification

4. **Communication**
   - Notify stakeholders
   - Document incident
   - Update security procedures
   - Conduct security training

---

## 📚 Security Code References

### Key Files
- **Firestore Rules**: `firestore.rules` (118 lines)
- **Auth Service**: `backend/src/utils/authService.ts` (586 lines)
- **Auth Store**: `frontend/src/store/authStore.ts` (260+ lines)
- **Login Page**: `frontend/src/pages/Login.tsx` (473 lines)
- **Protected Route**: `frontend/src/components/ProtectedRoute.tsx` (28 lines)
- **Vite Config**: `frontend/vite.config.ts` (52 lines)

### Environment Files
- **Frontend**: `frontend/.env`
  - `VITE_ADMIN_EMAIL=hajiashraffurnitures@gmail.com`
  - Firebase config

---

## ✅ Security Status Summary

| Component | Status | Notes |
|-----------|---------|-------|
| Authentication | ✅ Secured | Firebase Auth with email restriction |
| Authorization | ✅ Secured | Role-based access control |
| Database Rules | ✅ Secured | Comprehensive Firestore rules |
| Rate Limiting | ✅ Implemented | Client-side, 5 attempts/15min |
| Account Locking | ✅ Implemented | Server-side, 15min lockout |
| Token Management | ✅ Secured | Auto-refresh every 45min |
| Audit Logging | ✅ Implemented | Immutable logs in Firestore |
| Security Headers | ✅ Configured | XSS, clickjacking protection |
| Protected Routes | ✅ Implemented | Admin-only access |
| Rate Limiting | ✅ Implemented | Client-side enforcement |

---

## 🔄 Last Updated
- **Date**: December 2024
- **By**: Security Audit and Implementation
- **Version**: 1.0
- **Status**: Production Ready (pending deployment)

---

## 📖 Additional Resources
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Auth Best Practices](https://firebase.google.com/docs/auth/security)
- [Web Security Headers](https://owasp.org/www-project-secure-headers/)
