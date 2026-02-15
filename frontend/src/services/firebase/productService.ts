/**
 * Firebase Product Service
 * 
 * Handles all product-related Firestore operations.
 * Replaces the backend REST API with direct Firestore queries.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== Types ====================

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  name: string;
  values: string[];
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: ProductImage[];
  stock: number;
  sku: string;
  slug: string;
  featured: boolean;
  variants: ProductVariant[];
  specifications: ProductSpec[];
  rating: number;
  reviews: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'oldest' | 'popular' | 'featured';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ==================== Helper Functions ====================

/**
 * Generate URL-friendly slug from product name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Convert Firestore document to Product object
 */
const docToProduct = (docSnap: DocumentSnapshot): Product | null => {
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    description: data.description || '',
    price: data.price,
    category: data.category,
    images: data.images || [],
    stock: data.stock || 0,
    sku: data.sku,
    slug: data.slug,
    featured: data.featured || false,
    variants: data.variants || [],
    specifications: data.specifications || [],
    rating: data.rating || 0,
    reviews: data.reviews || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// ==================== CRUD Operations ====================

/**
 * Get all products with filters, sorting, and pagination
 */
export const getProducts = async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    featured,
    inStock,
    rating,
    sort = 'newest',
    page = 1,
    limit: pageSize = 12
  } = filters;

  const productsRef = collection(db, 'products');
  const queryConstraints: QueryConstraint[] = [];

  // Apply filters
  if (category) {
    queryConstraints.push(where('category', '==', category));
  }

  if (featured !== undefined) {
    queryConstraints.push(where('featured', '==', featured));
  }

  if (minPrice !== undefined) {
    queryConstraints.push(where('price', '>=', minPrice));
  }

  if (maxPrice !== undefined) {
    queryConstraints.push(where('price', '<=', maxPrice));
  }

  if (inStock) {
    queryConstraints.push(where('stock', '>', 0));
  }

  if (rating !== undefined) {
    queryConstraints.push(where('rating', '>=', rating));
  }

  // Apply sorting
  switch (sort) {
    case 'price-asc':
      queryConstraints.push(orderBy('price', 'asc'));
      break;
    case 'price-desc':
      queryConstraints.push(orderBy('price', 'desc'));
      break;
    case 'rating':
      queryConstraints.push(orderBy('rating', 'desc'));
      queryConstraints.push(orderBy('reviews', 'desc'));
      break;
    case 'oldest':
      queryConstraints.push(orderBy('createdAt', 'asc'));
      break;
    case 'popular':
      queryConstraints.push(orderBy('reviews', 'desc'));
      queryConstraints.push(orderBy('rating', 'desc'));
      break;
    case 'featured':
      queryConstraints.push(orderBy('featured', 'desc'));
      queryConstraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'newest':
    default:
      queryConstraints.push(orderBy('createdAt', 'desc'));
      break;
  }

  // Apply pagination
  queryConstraints.push(limit(pageSize));

  const q = query(productsRef, ...queryConstraints);
  const querySnapshot = await getDocs(q);

  let products = querySnapshot.docs
    .map(docToProduct)
    .filter((p): p is Product => p !== null);

  // Client-side search filtering (Firestore doesn't support full-text search natively)
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  // Client-side pagination after filtering
  const totalCount = products.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNextPage: endIndex < totalCount,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Get a single product by ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  const productDoc = doc(db, 'products', productId);
  const productSnap = await getDoc(productDoc);
  return docToProduct(productSnap);
};

/**
 * Get a single product by slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('slug', '==', slug.toLowerCase()), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  return docToProduct(querySnapshot.docs[0]);
};

/**
 * Create a new product
 */
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  // Generate slug if not provided
  const slug = productData.slug || generateSlug(productData.name);

  // Check for duplicate SKU
  const skuQuery = query(collection(db, 'products'), where('sku', '==', productData.sku), limit(1));
  const skuSnapshot = await getDocs(skuQuery);
  if (!skuSnapshot.empty) {
    throw new Error('SKU already exists');
  }

  // Check for duplicate slug
  const slugQuery = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
  const slugSnapshot = await getDocs(slugQuery);
  if (!slugSnapshot.empty) {
    throw new Error('Slug already exists');
  }

  const newProduct = {
    ...productData,
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'products'), newProduct);
  const productSnap = await getDoc(docRef);
  
  const product = docToProduct(productSnap);
  if (!product) throw new Error('Failed to create product');
  
  return product;
};

/**
 * Update an existing product
 */
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product> => {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error('Product not found');
  }

  // If name is being updated, regenerate slug
  let updatedData = { ...updates };
  if (updates.name) {
    updatedData.slug = generateSlug(updates.name);
    
    // Check for duplicate slug
    const slugQuery = query(
      collection(db, 'products'),
      where('slug', '==', updatedData.slug),
      limit(1)
    );
    const slugSnapshot = await getDocs(slugQuery);
    if (!slugSnapshot.empty && slugSnapshot.docs[0].id !== productId) {
      throw new Error('Slug already exists');
    }
  }

  // If SKU is being updated, check for duplicates
  if (updates.sku && updates.sku !== productSnap.data().sku) {
    const skuQuery = query(
      collection(db, 'products'),
      where('sku', '==', updates.sku),
      limit(1)
    );
    const skuSnapshot = await getDocs(skuQuery);
    if (!skuSnapshot.empty) {
      throw new Error('SKU already exists');
    }
  }

  updatedData.updatedAt = serverTimestamp() as any;

  await updateDoc(productRef, updatedData);
  
  const updatedSnap = await getDoc(productRef);
  const product = docToProduct(updatedSnap);
  if (!product) throw new Error('Failed to update product');
  
  return product;
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
};

/**
 * Bulk delete products
 */
export const bulkDeleteProducts = async (productIds: string[]): Promise<void> => {
  const batch = writeBatch(db);
  
  productIds.forEach(id => {
    const productRef = doc(db, 'products', id);
    batch.delete(productRef);
  });
  
  await batch.commit();
};

/**
 * Subscribe to real-time product updates
 */
export const subscribeToProducts = (
  filters: ProductFilters,
  onUpdate: (response: ProductsResponse) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const {
    category,
    featured,
    minPrice,
    maxPrice,
    inStock,
    rating,
    sort = 'newest',
    limit: pageSize = 12
  } = filters;

  const productsRef = collection(db, 'products');
  const queryConstraints: QueryConstraint[] = [];

  if (category) queryConstraints.push(where('category', '==', category));
  if (featured !== undefined) queryConstraints.push(where('featured', '==', featured));
  if (minPrice !== undefined) queryConstraints.push(where('price', '>=', minPrice));
  if (maxPrice !== undefined) queryConstraints.push(where('price', '<=', maxPrice));
  if (inStock) queryConstraints.push(where('stock', '>', 0));
  if (rating !== undefined) queryConstraints.push(where('rating', '>=', rating));

  // Apply sorting
  switch (sort) {
    case 'price-asc': queryConstraints.push(orderBy('price', 'asc')); break;
    case 'price-desc': queryConstraints.push(orderBy('price', 'desc')); break;
    case 'rating':
      queryConstraints.push(orderBy('rating', 'desc'));
      queryConstraints.push(orderBy('reviews', 'desc'));
      break;
    case 'oldest': queryConstraints.push(orderBy('createdAt', 'asc')); break;
    case 'popular':
      queryConstraints.push(orderBy('reviews', 'desc'));
      queryConstraints.push(orderBy('rating', 'desc'));
      break;
    case 'featured':
      queryConstraints.push(orderBy('featured', 'desc'));
      queryConstraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'newest':
    default:
      queryConstraints.push(orderBy('createdAt', 'desc'));
      break;
  }

  queryConstraints.push(limit(pageSize));

  const q = query(productsRef, ...queryConstraints);

  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs
        .map(docToProduct)
        .filter((p): p is Product => p !== null);

      onUpdate({
        products,
        pagination: {
          currentPage: 1,
          pageSize,
          totalCount: products.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    },
    onError
  );
};

/**
 * Get product statistics
 */
export const getProductStats = async () => {
  const productsRef = collection(db, 'products');
  const allProductsSnap = await getDocs(productsRef);
  
  const products = allProductsSnap.docs.map(docToProduct).filter((p): p is Product => p !== null);
  
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / (totalProducts || 1);

  return {
    totalProducts,
    featuredProducts,
    averagePrice
  };
};
