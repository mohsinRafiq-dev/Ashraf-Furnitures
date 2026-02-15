# Add Sample Data to Firestore

Since the seed script requires admin authentication, please add sample data manually through Firebase Console:

## Step 1: Add Categories

Visit: https://console.firebase.google.com/project/furniture-mart-10426/firestore

**Click "Start collection" → Enter collection name: `categories`**

### Category 1:
- Document ID: (Auto-generate)
- Fields:
  ```
  name: "Living Room"
  slug: "living-room"
  description: "Comfortable and stylish living room furniture"
  color: "from-amber-500 to-orange-600"
  image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  productCount: 0
  createdAt: [timestamp] (click clock icon)
  updatedAt: [timestamp]
  ```

### Category 2:
- Click "Add document"
- Fields:
  ```
  name: "Bedroom"
  slug: "bedroom"
  description: "Rest and relaxation bedroom essentials"
  color: "from-blue-500 to-indigo-600"
  image: "https://images.unsplash.com/photo-1540932239986-30128078ceb?w=800"
  productCount: 0
  createdAt: [timestamp]
  updatedAt: [timestamp]
  ```

### Category 3:
```
name: "Dining"
slug: "dining"
description: "Elegant dining room furniture"
color: "from-green-500 to-teal-600"
image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800"
productCount: 0
createdAt: [timestamp]
updatedAt: [timestamp]
```

## Step 2: Add Products

**Click "Start collection" → Enter collection name: `products`**

### Product 1:
```
name: "Modern Sofa Set"
slug: "modern-sofa-set"
description: "3-seater comfortable modern sofa with premium fabric"
price: 899.99
category: "Living Room"
stock: 15
sku: "SOF-001"
featured: true
rating: 4.5
reviews: 24
images: [array]
  - [0]: {object}
    - url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
    - alt: "Modern Sofa"
    - isPrimary: true
variants: [] (empty array)
specifications: [array]
  - [0]: {object}
    - key: "Material"
    - value: "Premium Fabric"
  - [1]: {object}
    - key: "Dimensions"
    - value: "200cm x 90cm x 85cm"
createdAt: [timestamp]
updatedAt: [timestamp]
```

### Product 2:
```
name: "Queen Size Bed"
slug: "queen-size-bed"
description: "Elegant queen size bed with upholstered headboard"
price: 1299.99
category: "Bedroom"
stock: 8
sku: "BED-001"
featured: true
rating: 4.8
reviews: 36
images: [array]
  - [0]: {object}
    - url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
    - alt: "Queen Bed"
    - isPrimary: true
variants: []
specifications: [array]
  - [0]: {object}
    - key: "Size"
    - value: "Queen (60x80 inches)"
  - [1]: {object}
    - key: "Material"
    - value: "Wood & Fabric"
createdAt: [timestamp]
updatedAt: [timestamp]
```

## Quick Steps:
1. Go to Firebase Console → Firestore Database
2. Click "Start collection" → name it "categories"
3. Add 2-3 categories with the fields above
4. Click "Start collection" → name it "products"
5. Add 2-3 products with the fields above
6. Refresh your app at http://localhost:3000

**Or wait - I'll create an admin-authenticated version...**
