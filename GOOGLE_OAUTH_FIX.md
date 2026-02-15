# 🔧 Fix Google Sign-In OAuth Error

## Error Message:
```
403 error
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

---

## ✅ Quick Fix (2 Steps)

### Step 1: Add Authorized Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** in left sidebar
4. Click **Settings** tab (top of page)
5. Scroll to **Authorized domains**
6. Click **Add domain**
7. Add: `localhost`
8. Click **Add**

### Step 2: Update Google Cloud Console OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the same project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (Web client)
5. Click the **Edit** icon (pencil)
6. Under **Authorized JavaScript origins**:
   - Click **+ ADD URI**
   - Add: `http://localhost:3001`
   - Add: `http://localhost:5173` (Vite default port)
7. Under **Authorized redirect URIs**:
   - Click **+ ADD URI**
   - Add: `http://localhost:3001/__/auth/handler`
   - Add: `http://localhost:5173/__/auth/handler`
8. Click **SAVE** at the bottom

---

## 🔒 Email Restriction Setup

To restrict login to **ONE specific email only**:

### Update your `.env` file:

```env
# Your existing Firebase config...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ...other variables...

# Add this line with YOUR email:
VITE_ADMIN_EMAIL=your-email@gmail.com
```

**Example:**
```env
VITE_ADMIN_EMAIL=mohsin@gmail.com
```

### Restart your dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

Now only `mohsin@gmail.com` (or whatever email you set) can login!

---

## 🧪 Test It

1. Make sure both Firebase and Google Cloud Console are updated
2. Restart your dev server
3. Visit: http://localhost:3001/login
4. Click **"Sign in with Google"**
5. ✅ Should redirect to Google and back successfully

---

## ⚠️ Common Issues

### Issue: Still getting 403 error
**Solution**: 
- Wait 5 minutes after saving changes (OAuth settings can take time to propagate)
- Clear browser cache and try again
- Make sure you added `http://` prefix to URIs

### Issue: "Access denied. Only [email] can login"
**Solution**: 
- This means email restriction is working!
- Make sure `VITE_ADMIN_EMAIL` in `.env` matches the Google account you're using
- Check for typos in the email address

### Issue: Changes not taking effect
**Solution**:
- Stop dev server (Ctrl+C)
- Run `npm run dev` again
- .env changes require server restart

---

## 📋 Final Checklist

- [ ] Added `localhost` to Firebase Authorized domains
- [ ] Added `http://localhost:3001` to Google Cloud OAuth origins
- [ ] Added `http://localhost:3001/__/auth/handler` to Google Cloud redirect URIs
- [ ] Set `VITE_ADMIN_EMAIL` in `.env` file
- [ ] Restarted dev server
- [ ] Tested Google Sign-In

---

## 🎯 What You've Set Up

### Security Features:
- ✅ Google OAuth properly configured
- ✅ Only authorized origins can use your OAuth client
- ✅ **Single email restriction** - Only ONE email can login
- ✅ All login attempts logged to Firestore audit logs
- ✅ Email/password login also restricted to same email

### Benefits:
- No one else can login to your admin panel
- Secure authentication via Google
- Audit trail of all login attempts
- Works on localhost and can be configured for production

---

## 🚀 Production Setup (When Ready)

When deploying to production (e.g., Vercel, Netlify):

1. **Firebase Console**:
   - Add your production domain to Authorized domains
   - Example: `yourstore.com`

2. **Google Cloud Console**:
   - Add your production URL to Authorized JavaScript origins
   - Example: `https://yourstore.com`
   - Add your production redirect URI
   - Example: `https://yourstore.com/__/auth/handler`

3. **Environment Variables**:
   - Set `VITE_ADMIN_EMAIL` in production environment
   - Keep it the same email for consistency

---

**Need help?** Check the console for error messages - they usually tell you exactly what's missing!
