# Cloudinary Setup Instructions

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Free Cloudinary Account

1. Go to: https://cloudinary.com/users/register_free
2. Sign up (it's free - 25GB storage, 25GB bandwidth/month)
3. Verify your email

### Step 2: Get Your Credentials

1. After login, you'll see your **Dashboard**
2. Copy these 3 values:
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuv-12345`)

### Step 3: Add to Backend Environment

1. Open: `backend/.env`
2. Add these lines (replace with YOUR values):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**

```env
CLOUDINARY_CLOUD_NAME=dxy1234ab
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefgHIJKLMNop-12345
```

### Step 4: Upload Your Product Images to Cloudinary

**Option A: Manual Upload (Quick Test)**

1. Go to Cloudinary Dashboard → Media Library
2. Click "Upload"
3. Upload your product images
4. Copy the image URLs
5. Update your products in MongoDB with Cloudinary URLs

**Option B: Migrate Existing Images (Automated)**
Create a migration script:

```typescript
// backend/scripts/migrate-to-cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import Product from "../src/models/Product";
import { connectDatabase } from "../src/config/database";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImages() {
  await connectDatabase();

  const products = await Product.find();

  for (const product of products) {
    for (let i = 0; i < product.images.length; i++) {
      const imageUrl = product.images[i].url;

      // Skip if already on Cloudinary
      if (imageUrl.includes("cloudinary")) continue;

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(imageUrl, {
          folder: "furniture-mart/products",
          public_id: `${product.slug}-${i}`,
        });

        // Update product with new URL
        product.images[i].url = result.secure_url;
        console.log(`✅ Migrated: ${product.name} - Image ${i + 1}`);
      } catch (error) {
        console.error(`❌ Failed: ${product.name} - Image ${i + 1}`, error);
      }
    }

    await product.save();
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrateImages();
```

Run it:

```bash
cd backend
npx tsx scripts/migrate-to-cloudinary.ts
```

### Step 5: Restart Backend

```bash
cd backend
npm run dev
```

You should see: `✅ Cloudinary configured for image optimization`

---

## ✅ Verification

### 1. Check Backend Logs

When backend starts, you should see:

```
✅ Cloudinary configured for image optimization
```

### 2. Test Products API

```bash
curl http://localhost:5000/api/products?limit=1
```

Check if image URLs contain Cloudinary transformations like:

```
/upload/w_400,h_400,c_fill,f_auto,q_auto:good/
```

### 3. Check Network Tab

- Open your website
- Open DevTools → Network → Filter "Img"
- Reload products page
- Images should be:
  - Coming from `res.cloudinary.com`
  - **< 100KB each** (was 2-5MB!)
  - Loading much faster

---

## 🎯 Expected Results

### Before Cloudinary:

- ❌ 10 seconds to load products
- ❌ 2-5MB per image
- ❌ 24-60MB total for 12 products
- ❌ Slow on mobile networks

### After Cloudinary:

- ✅ 2-3 seconds to load products (70% faster!)
- ✅ 50-150KB per image (95% smaller!)
- ✅ 1-2MB total for 12 products
- ✅ Fast on mobile networks
- ✅ Automatic WebP format
- ✅ Global CDN delivery

---

## 📊 Optimization Details

**Product List Images:**

- Size: 400x400px
- Quality: auto:good
- Format: auto (WebP for modern browsers)
- Savings: ~70%

**Product Detail Images:**

- Size: 800x800px
- Quality: auto:best
- Format: auto (WebP for modern browsers)
- Savings: ~60%

**Category Thumbnails:**

- Size: 150x150px
- Quality: auto:eco
- Format: auto (WebP for modern browsers)
- Savings: ~80%

---

## 🔧 Troubleshooting

### "Cloudinary credentials not found" warning

- Check `.env` file has correct values
- Make sure no extra spaces around `=`
- Restart backend after adding credentials

### Images not optimizing

- Verify image URLs contain `cloudinary.com`
- Non-Cloudinary URLs won't be optimized (fallback gracefully)
- Upload images to Cloudinary first

### Upload limit exceeded

- Free tier: 25GB storage, 25GB bandwidth/month
- Check usage: Dashboard → Usage
- Upgrade plan if needed (or optimize image quality)

---

## 🎉 Done!

Your website should now load products in **2-3 seconds** instead of 10 seconds!

Next steps:

1. Test on mobile network (Chrome DevTools → "Slow 3G")
2. Monitor Cloudinary usage dashboard
3. Deploy to production with environment variables
