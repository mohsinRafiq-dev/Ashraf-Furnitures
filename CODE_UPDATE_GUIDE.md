# Quick Code Update Reference

This guide shows exactly what to change in your React components to use Firebase.

## 1. Update Imports

### Before (Old API Client):
```typescript
import { apiClient } from "../services/api/client";
import { useProducts, useCategories } from "../services/api/hooks";
```

### After (Firebase Services):
```typescript
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  subscribeToProducts,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  subscribeToCategories,
  uploadImage,
  deleteImageByUrl
} from "../services/firebase";
```

## 2. Product Listing (Products.tsx, ProductGrid component)

### Before:
```typescript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/products', {
        params: { category, featured, page, limit }
      });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [category, featured, page]);
```

### After (with real-time updates):
```typescript
import { subscribeToProducts } from "../services/firebase";

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  
  // Subscribe to real-time updates
  const unsubscribe = subscribeToProducts(
    {
      category,
      featured,
      sort: 'newest',
      page,
      limit: 12
    },
    (response) => {
      setProducts(response.products);
      setLoading(false);
    },
    (error) => {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  );

  // Cleanup subscription on unmount
  return () => unsubscribe();
}, [category, featured, page]);
```

### Alternative (without real-time):
```typescript
import { getProducts } from "../services/firebase";

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        category,
        featured,
        sort: 'newest',
        page,
        limit: 12
      });
      setProducts(response.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [category, featured, page]);
```

## 3. Product Detail (ProductDetail.tsx)

### Before:
```typescript
const fetchProduct = async () => {
  try {
    setLoading(true);
    const res = await apiClient.get(`/products/${productId}`);
    setProduct(res.data.data.product || res.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### After:
```typescript
import { getProductById } from "../services/firebase";

const fetchProduct = async () => {
  try {
    setLoading(true);
    const product = await getProductById(productId!);
    setProduct(product);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

## 4. Admin Dashboard - Product CRUD

### Create Product:

#### Before:
```typescript
const handleCreateProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Product created successfully');
    fetchProducts(); // Refresh list
  } catch (error) {
    toast.error('Failed to create product');
  }
};
```

#### After:
```typescript
import { createProduct } from "../services/firebase";

const handleCreateProduct = async (productData) => {
  try {
    await createProduct(productData);
    toast.success('Product created successfully');
    // No need to refresh - real-time listener updates automatically
  } catch (error) {
    toast.error(error.message || 'Failed to create product');
  }
};
```

### Update Product:

#### Before:
```typescript
const handleUpdateProduct = async (productId, updates) => {
  try {
    await apiClient.put(`/products/${productId}`, updates, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Product updated');
  } catch (error) {
    toast.error('Failed to update product');
  }
};
```

#### After:
```typescript
import { updateProduct } from "../services/firebase";

const handleUpdateProduct = async (productId, updates) => {
  try {
    await updateProduct(productId, updates);
    toast.success('Product updated');
  } catch (error) {
    toast.error(error.message || 'Failed to update product');
  }
};
```

### Delete Product:

#### Before:
```typescript
const handleDeleteProduct = async (productId) => {
  try {
    await apiClient.delete(`/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Product deleted');
  } catch (error) {
    toast.error('Failed to delete product');
  }
};
```

#### After:
```typescript
import { deleteProduct } from "../services/firebase";

const handleDeleteProduct = async (productId) => {
  try {
    await deleteProduct(productId);
    toast.success('Product deleted');
  } catch (error) {
    toast.error(error.message || 'Failed to delete product');
  }
};
```

## 5. Image Upload

### Before (Cloudinary or backend upload):
```typescript
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.url;
  } catch (error) {
    throw new Error('Upload failed');
  }
};
```

### After (Firebase Storage):
```typescript
import { uploadImage } from "../services/firebase";

const handleImageUpload = async (file: File, productId: string) => {
  try {
    const result = await uploadImage({
      folder: 'products',
      itemId: productId,
      file
    });
    return result.url; // Use this URL in your product
  } catch (error: any) {
    throw new Error(error.message || 'Upload failed');
  }
};
```

### With Image Cropping:
```typescript
import { cropAndUploadImage } from "../services/firebase";

const handleCropAndUpload = async (
  imageSrc: string,
  croppedArea: { x: number; y: number; width: number; height: number },
  productId: string
) => {
  try {
    const result = await cropAndUploadImage(imageSrc, croppedArea, {
      folder: 'products',
      itemId: productId
    });
    return result.url;
  } catch (error: any) {
    throw new Error(error.message || 'Upload failed');
  }
};
```

## 6. Category Management

### Get Categories:

#### Before:
```typescript
const fetchCategories = async () => {
  const response = await apiClient.get('/categories');
  setCategories(response.data.data.categories);
};
```

#### After:
```typescript
import { getCategories } from "../services/firebase";

const fetchCategories = async () => {
  const response = await getCategories({ sort: 'name-asc' });
  setCategories(response.categories);
};
```

### With Real-time Updates:
```typescript
import { subscribeToCategories } from "../services/firebase";

useEffect(() => {
  const unsubscribe = subscribeToCategories(
    { sort: 'name-asc' },
    (response) => {
      setCategories(response.categories);
    },
    (error) => {
      console.error(error);
    }
  );

  return () => unsubscribe();
}, []);
```

## 7. Authentication (Login Page)

### Before:
```typescript
import { useAuthStore } from "../store/authStore";

const handleLogin = async (email, password) => {
  try {
    await login(email, password); // Uses old JWT API
    navigate('/admin');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

### After (already updated in authStore):
```typescript
import { useAuthStore } from "../store/authStore";

const { login, loginWithGoogle } = useAuthStore();

const handleEmailLogin = async (email, password) => {
  try {
    await login(email, password); // Now uses Firebase
    navigate('/admin');
  } catch (error: any) {
    setError(error.message || 'Invalid credentials');
  }
};

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle(); // Google OAuth
    navigate('/admin');
  } catch (error: any) {
    setError(error.message || 'Login failed');
  }
};
```

## 8. App Initialization (App.tsx)

Add Firebase initialization:

```typescript
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { initializeAnalytics } from './services/firebase';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase authentication listener
    initializeAuth();
    
    // Initialize analytics tracking
    initializeAnalytics();
  }, []);

  return (
    // ... rest of your app
  );
}

export default App;
```

## 9. Analytics Tracking

### Before:
```typescript
// Backend API call
await apiClient.post('/analytics/track', {
  event: 'product_view',
  productId
});
```

### After:
```typescript
import { trackProductView, trackAddToCart } from "../services/firebase";

// Track product view
await trackProductView(productId, productName, 'view');

// Track add to cart
await trackAddToCart(productId, productName);
```

## 10. Search Functionality

### Before:
```typescript
const searchProducts = async (query) => {
  const response = await apiClient.get('/products/search/advanced', {
    params: { search: query, sort: 'relevance' }
  });
  return response.data.data.products;
};
```

### After:
```typescript
import { getProducts } from "../services/firebase";

const searchProducts = async (query: string) => {
  const response = await getProducts({
    search: query,
    sort: 'newest'
  });
  return response.products;
};
```

## Common Patterns

### 1. Error Handling
```typescript
try {
  await someFirebaseOperation();
} catch (error: any) {
  // Firebase errors have descriptive messages
  console.error(error.message);
  toast.error(error.message || 'Operation failed');
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleOperation = async () => {
  setLoading(true);
  try {
    await firebaseOperation();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Real-time Subscriptions
```typescript
useEffect(() => {
  const unsubscribe = subscribeToSomething(
    filters,
    (data) => setData(data),
    (error) => console.error(error)
  );

  // Always cleanup on unmount
  return () => unsubscribe();
}, [dependencies]);
```

## Key Differences to Remember

1. **No Authorization Headers** - Firebase handles auth automatically
2. **Real-time by Default** - Use `subscribe` functions for live updates
3. **Client-side Validation** - Firebase validates based on security rules
4. **Direct Errors** - Firebase errors are more descriptive
5. **No Response Wrapping** - Functions return data directly

## Testing Your Updates

After updating a component:

1. **Test without auth** - Verify public users can still browse
2. **Test with auth** - Verify admins can perform CRUD operations
3. **Test real-time** - Open two browser windows and verify changes sync
4. **Test errors** - Try invalid operations and check error messages
5. **Check console** - Verify no Firebase errors or warnings

---

**Need help? Check `FIREBASE_SETUP_GUIDE.md` for detailed instructions!**
