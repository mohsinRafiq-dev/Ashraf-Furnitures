# 🔴 FIX: Error 400: origin_mismatch

## The Problem:
Your Google OAuth client doesn't recognize `localhost` as an authorized origin.

---

## ✅ Solution (5 Minutes)

### Step 1: Open Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Make sure you're on the **furniture-mart-10426** project
3. Click the menu (☰) → **APIs & Services** → **Credentials**

### Step 2: Find Your OAuth Client

Look for **OAuth 2.0 Client IDs** section

You should see something like:
- **Web client (Auto-created by Google Service)**
- Or **Web client** or similar name

Click the **pencil icon (✏️)** next to it to edit

### Step 3: Add Authorized JavaScript Origins

In the edit screen:

**Authorized JavaScript origins** section:
- Click **+ ADD URI**
- Add **EXACTLY**: `http://localhost:5173`
- Click **+ ADD URI** again
- Add **EXACTLY**: `http://localhost:3001`

### Step 4: Add Redirect URIs

**Authorized redirect URIs** section:
- Click **+ ADD URI**
- Add **EXACTLY**: `http://localhost:5173/__/auth/handler`
- Click **+ ADD URI** again
- Add **EXACTLY**: `http://localhost:3001/__/auth/handler`

### Step 5: Save

- Scroll to bottom
- Click **SAVE** button
- ⚠️ **WAIT 5-10 MINUTES** - Changes take time to propagate!

---

## 📋 Quick Checklist

Make sure you added ALL of these:

**Authorized JavaScript origins:**
- [ ] `http://localhost:5173`
- [ ] `http://localhost:3001`

**Authorized redirect URIs:**
- [ ] `http://localhost:5173/__/auth/handler`
- [ ] `http://localhost:3001/__/auth/handler`

---

## 🧪 Test After 5 Minutes

1. **Wait at least 5 minutes** after saving
2. Close your browser completely
3. Open fresh browser window
4. Go to: http://localhost:5173/login (or :3001)
5. Click "Sign in with Google"
6. ✅ Should work now!

---

## ⚠️ Important Notes

### Use EXACT URLs:
- ✅ `http://localhost:5173` 
- ❌ `http://localhost:5173/` (no trailing slash)
- ❌ `localhost:5173` (must have http://)
- ❌ `https://localhost:5173` (must be http, not https)

### If Still Not Working:
1. Double-check spelling (copy-paste from above)
2. Make sure you saved (scroll down and click SAVE)
3. Wait 10 minutes (seriously, Google is slow to update)
4. Clear browser cache
5. Try incognito/private window

---

## 🎯 Your Current Setup

Your admin email is: **hajiashraffurnitures@gmail.com**

Only this email will be allowed to login once OAuth is working!

---

## 🚨 Common Mistakes

### Mistake 1: Wrong Project
- Make sure you're editing **furniture-mart-10426** project
- Check the project name in the top bar

### Mistake 2: Wrong Client
- Edit the **Web client** OAuth, not Android or iOS

### Mistake 3: Not Waiting
- Google OAuth changes can take 5-10 minutes to activate
- Don't keep testing immediately - go get coffee ☕

---

## 📸 What It Should Look Like

In Google Cloud Console, after adding:

```
Authorized JavaScript origins:
  http://localhost:5173
  http://localhost:3001

Authorized redirect URIs:
  http://localhost:5173/__/auth/handler
  http://localhost:3001/__/auth/handler
```

---

## 🔗 Quick Link

Direct link to credentials page:
https://console.cloud.google.com/apis/credentials?project=furniture-mart-10426

---

**Remember**: After you SAVE in Google Cloud Console, you MUST wait 5-10 minutes before testing!
