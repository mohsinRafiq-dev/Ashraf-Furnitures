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
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
  serverTimestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { cache, CacheTTL, generateCacheKey } from '../../utils/cache';

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

export interface ProductsChunkResponse {
  products: Product[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

type ProductChunkFilters = Pick<ProductFilters, 'category' | 'featured' | 'sort'>;

const buildProductQueryConstraints = (
  filters: ProductChunkFilters,
  pageSize: number,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
): QueryConstraint[] => {
  const { category, featured, sort = 'newest' } = filters;
  const queryConstraints: QueryConstraint[] = [];

  if (category) {
    queryConstraints.push(where('category', '==', category));
  }

  if (featured !== undefined) {
    queryConstraints.push(where('featured', '==', featured));
  }

  switch (sort) {
    case 'price-asc':
      queryConstraints.push(orderBy('price', 'asc'));
      queryConstraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'price-desc':
      queryConstraints.push(orderBy('price', 'desc'));
      queryConstraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'oldest':
      queryConstraints.push(orderBy('createdAt', 'asc'));
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

  if (lastDoc) {
    queryConstraints.push(startAfter(lastDoc));
  }

  queryConstraints.push(limit(pageSize + 1));

  return queryConstraints;
};

const buildFallbackProductQueryConstraints = (
  filters: ProductChunkFilters
): QueryConstraint[] => {
  const { category, featured } = filters;
  const queryConstraints: QueryConstraint[] = [];

  if (category) {
    queryConstraints.push(where('category', '==', category));
  }

  if (featured !== undefined) {
    queryConstraints.push(where('featured', '==', featured));
  }

  return queryConstraints;
};

const getTimestampValue = (value: Timestamp | Date | undefined): number => {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof (value as Timestamp).toMillis === 'function') {
    return (value as Timestamp).toMillis();
  }

  return 0;
};

const compareProducts = (left: Product, right: Product, sort: ProductFilters['sort'] = 'newest') => {
  switch (sort) {
    case 'price-asc':
      return left.price - right.price || getTimestampValue(right.createdAt) - getTimestampValue(left.createdAt);
    case 'price-desc':
      return right.price - left.price || getTimestampValue(right.createdAt) - getTimestampValue(left.createdAt);
    case 'rating':
      return right.rating - left.rating || right.reviews - left.reviews || getTimestampValue(right.createdAt) - getTimestampValue(left.createdAt);
    case 'popular':
      return right.reviews - left.reviews || right.rating - left.rating || getTimestampValue(right.createdAt) - getTimestampValue(left.createdAt);
    case 'featured':
      return Number(right.featured) - Number(left.featured) || getTimestampValue(right.createdAt) - getTimestampValue(left.createdAt);
    case 'oldest':
      return getTimestampValue(left.createdAt) - getTimestampValue(right.createdAt);
    case 'newest':
    default:
      return getTimestampValue(right.createdAt) - getTimestampValue(left.createdAt);
  }
};

const isMissingIndexError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return 'code' in error && (error as { code?: string }).code === 'failed-precondition';
};

const getProductsChunkWithFallback = async (
  productsRef: ReturnType<typeof collection>,
  pageSize: number,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null,
  filters: ProductChunkFilters
): Promise<ProductsChunkResponse> => {
  const fallbackQuery = query(productsRef, ...buildFallbackProductQueryConstraints(filters));
  const fallbackSnapshot = await getDocs(fallbackQuery);
  const sortedProducts = fallbackSnapshot.docs
    .map((doc) => ({ snapshot: doc, product: docToProduct(doc) }))
    .filter(
      (entry): entry is { snapshot: QueryDocumentSnapshot<DocumentData>; product: Product } =>
        entry.product !== null
    )
    .sort((left, right) => compareProducts(left.product, right.product, filters.sort));

  const startIndex = lastDoc
    ? sortedProducts.findIndex(({ snapshot }) => snapshot.id === lastDoc.id) + 1
    : 0;
  const safeStartIndex = startIndex > 0 ? startIndex : 0;
  const pageEntries = sortedProducts.slice(safeStartIndex, safeStartIndex + pageSize);
  const newLastDoc = pageEntries.length > 0 ? pageEntries[pageEntries.length - 1].snapshot : lastDoc;

  return {
    products: pageEntries.map(({ product }) => product),
    lastDoc: newLastDoc,
    hasMore: safeStartIndex + pageSize < sortedProducts.length,
  };
};

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

/**
 * Adjust category product counter by category name.
 */
const adjustCategoryProductCount = async (categoryName: string | undefined, delta: number): Promise<void> => {
  if (!categoryName || !delta) return;

  const categoryQuery = query(
    collection(db, 'categories'),
    where('name', '==', categoryName),
    limit(1)
  );
  const categorySnapshot = await getDocs(categoryQuery);
  if (categorySnapshot.empty) return;

  await updateDoc(categorySnapshot.docs[0].ref, {
    productCount: increment(delta),
    updatedAt: serverTimestamp(),
  });
};

// ==================== CRUD Operations ====================

/**
 * Get all products with filters, sorting, and pagination
 * Uses caching to improve performance
 */
export const getProducts = async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
  // Generate cache key from filters
  const cacheKey = generateCacheKey('products', filters);
  
  // Try to get from cache first
  const cachedData = cache.get<ProductsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

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

  const response = {
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

  // Cache the response for 5 minutes
  cache.set(cacheKey, response, CacheTTL.MEDIUM);

  return response;
};

/**
 * Fetch products in chunks for fast progressive loading.
 * Uses Firestore cursor pagination to avoid loading too many products at once.
 */
export const getProductsChunk = async (
  pageSize = 12,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  filters: ProductChunkFilters = {}
): Promise<ProductsChunkResponse> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, ...buildProductQueryConstraints(filters, pageSize, lastDoc));

  try {
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const hasMore = docs.length > pageSize;
    const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;

    const products = pageDocs
      .map(docToProduct)
      .filter((p): p is Product => p !== null);

    const newLastDoc = pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : lastDoc;

    return {
      products,
      lastDoc: newLastDoc,
      hasMore,
    };
  } catch (error) {
    if (!isMissingIndexError(error)) {
      throw error;
    }

    console.warn('Falling back to client-side product sorting for filtered chunk query.', error);
    return getProductsChunkWithFallback(productsRef, pageSize, lastDoc, filters);
  }
};

/**
 * Get a single product by ID
 * Uses caching to improve performance
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  const cacheKey = `product:${productId}`;
  
  // Try cache first
  const cachedProduct = cache.get<Product | null>(cacheKey);
  if (cachedProduct !== undefined) {
    return cachedProduct;
  }

  const productDoc = doc(db, 'products', productId);
  const productSnap = await getDoc(productDoc);
  const product = docToProduct(productSnap);

  // Cache for 10 minutes
  cache.set(cacheKey, product, CacheTTL.LONG);

  return product;
};

/**
 * Get a single product by slug
 * Uses caching to improve performance
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const cacheKey = `product:slug:${slug}`;
  
  // Try cache first
  const cachedProduct = cache.get<Product | null>(cacheKey);
  if (cachedProduct !== undefined) {
    return cachedProduct;
  }

  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('slug', '==', slug.toLowerCase()), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    cache.set(cacheKey, null, CacheTTL.LONG);
    return null;
  }

  const product = docToProduct(querySnapshot.docs[0]);

  // Cache for 10 minutes
  cache.set(cacheKey, product, CacheTTL.LONG);

  return product;
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

  // Keep category counters in sync for listing pages.
  await adjustCategoryProductCount(product.category, 1);
  cache.invalidatePattern('products');
  cache.invalidatePattern('categories');
  
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

  const currentData = productSnap.data();
  const previousCategory = currentData.category as string | undefined;

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

  // If category changed, move one count from old to new category.
  const nextCategory = product.category;
  if (previousCategory && nextCategory && previousCategory !== nextCategory) {
    await Promise.all([
      adjustCategoryProductCount(previousCategory, -1),
      adjustCategoryProductCount(nextCategory, 1),
    ]);
  }

  cache.invalidatePattern('products');
  cache.invalidatePattern('categories');
  
  return product;
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);
  const productData = productSnap.exists() ? productSnap.data() : null;
  await deleteDoc(productRef);

  if (productData?.category) {
    await adjustCategoryProductCount(productData.category as string, -1);
  }

  cache.invalidatePattern('products');
  cache.invalidatePattern('categories');
};

/**
 * Bulk delete products
 */
export const bulkDeleteProducts = async (productIds: string[]): Promise<void> => {
  const productSnapshots = await Promise.all(
    productIds.map((id) => getDoc(doc(db, 'products', id)))
  );

  const batch = writeBatch(db);
  
  productIds.forEach(id => {
    const productRef = doc(db, 'products', id);
    batch.delete(productRef);
  });
  
  await batch.commit();

  // Aggregate category decrements to minimize writes.
  const categoryAdjustments: Record<string, number> = {};
  productSnapshots.forEach((snap) => {
    if (!snap.exists()) return;
    const categoryName = snap.data().category as string | undefined;
    if (!categoryName) return;
    categoryAdjustments[categoryName] = (categoryAdjustments[categoryName] || 0) - 1;
  });

  await Promise.all(
    Object.entries(categoryAdjustments).map(([name, delta]) =>
      adjustCategoryProductCount(name, delta)
    )
  );

  cache.invalidatePattern('products');
  cache.invalidatePattern('categories');
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
