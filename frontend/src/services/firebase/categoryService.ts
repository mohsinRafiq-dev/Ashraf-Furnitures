/**
 * Firebase Category Service
 * 
 * Handles all category-related Firestore operations.
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
  onSnapshot,
  Unsubscribe,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateSlug } from './productService';
import { cache, CacheTTL, generateCacheKey } from '../../utils/cache';

// ==================== Types ====================

export interface Category {
  id?: string;
  name: string;
  description: string;
  color: string;
  image: string;
  slug: string;
  productCount: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface CategoryFilters {
  search?: string;
  sort?: 'name-asc' | 'name-desc' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface CategoriesResponse {
  categories: Category[];
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
 * Convert Firestore document to Category object
 */
const docToCategory = (docSnap: DocumentSnapshot): Category | null => {
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    description: data.description || '',
    color: data.color || 'from-gray-500 to-gray-600',
    image: data.image || '',
    slug: data.slug,
    productCount: data.productCount || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// ==================== CRUD Operations ====================

/**
 * Get all categories with filters and sorting
 * Uses caching to improve performance
 */
export const getCategories = async (filters: CategoryFilters = {}): Promise<CategoriesResponse> => {
  // Generate cache key
  const cacheKey = generateCacheKey('categories', filters);
  
  // Try cache first
  const cachedData = cache.get<CategoriesResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const {
    search,
    sort = 'newest',
    page = 1,
    limit: pageSize = 20
  } = filters;

  const categoriesRef = collection(db, 'categories');
  let q = query(categoriesRef);

  // Apply sorting
  switch (sort) {
    case 'name-asc':
      q = query(categoriesRef, orderBy('name', 'asc'));
      break;
    case 'name-desc':
      q = query(categoriesRef, orderBy('name', 'desc'));
      break;
    case 'oldest':
      q = query(categoriesRef, orderBy('createdAt', 'asc'));
      break;
    case 'newest':
    default:
      q = query(categoriesRef, orderBy('createdAt', 'desc'));
      break;
  }

  const querySnapshot = await getDocs(q);
  let categories = querySnapshot.docs
    .map(docToCategory)
    .filter((c): c is Category => c !== null);

  // Client-side search filtering
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    categories = categories.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      c.description.toLowerCase().includes(searchLower)
    );
  }

  // Update product counts for each category
  // This is done by counting products with matching category name
  const productsRef = collection(db, 'products');
  for (const category of categories) {
    const productQuery = query(productsRef, where('category', '==', category.name));
    const productSnapshot = await getDocs(productQuery);
    category.productCount = productSnapshot.size;
  }

  // Client-side pagination
  const totalCount = categories.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  const response = {
    categories: paginatedCategories,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNextPage: endIndex < totalCount,
      hasPrevPage: page > 1
    }
  };

  // Cache for 5 minutes
  cache.set(cacheKey, response, CacheTTL.MEDIUM);

  return response;
};

/**
 * Get a single category by ID
 * Uses caching to improve performance
 */
export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  const cacheKey = `category:${categoryId}`;
  
  // Try cache first
  const cachedCategory = cache.get<Category | null>(cacheKey);
  if (cachedCategory !== undefined) {
    return cachedCategory;
  }

  const categoryDoc = doc(db, 'categories', categoryId);
  const categorySnap = await getDoc(categoryDoc);
  const category = docToCategory(categorySnap);
  
  if (!category) {
    cache.set(cacheKey, null, CacheTTL.LONG);
    return null;
  }

  // Update product count
  const productsRef = collection(db, 'products');
  const productQuery = query(productsRef, where('category', '==', category.name));
  const productSnapshot = await getDocs(productQuery);
  category.productCount = productSnapshot.size;

  // Cache for 10 minutes
  cache.set(cacheKey, category, CacheTTL.LONG);

  return category;
};

/**
 * Get a single category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, where('slug', '==', slug.toLowerCase()), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const category = docToCategory(querySnapshot.docs[0]);
  if (!category) return null;

  // Update product count
  const productsRef = collection(db, 'products');
  const productQuery = query(productsRef, where('category', '==', category.name));
  const productSnapshot = await getDocs(productQuery);
  category.productCount = productSnapshot.size;

  return category;
};

/**
 * Create a new category
 */
export const createCategory = async (
  categoryData: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>
): Promise<Category> => {
  // Generate slug if not provided
  const slug = categoryData.slug || generateSlug(categoryData.name);

  // Check for duplicate name
  const nameQuery = query(collection(db, 'categories'), where('name', '==', categoryData.name), limit(1));
  const nameSnapshot = await getDocs(nameQuery);
  if (!nameSnapshot.empty) {
    throw new Error('Category name already exists');
  }

  // Check for duplicate slug
  const slugQuery = query(collection(db, 'categories'), where('slug', '==', slug), limit(1));
  const slugSnapshot = await getDocs(slugQuery);
  if (!slugSnapshot.empty) {
    throw new Error('Category slug already exists');
  }

  const newCategory = {
    ...categoryData,
    slug,
    productCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'categories'), newCategory);
  const categorySnap = await getDoc(docRef);
  
  const category = docToCategory(categorySnap);
  if (!category) throw new Error('Failed to create category');
  
  return category;
};

/**
 * Update an existing category
 */
export const updateCategory = async (categoryId: string, updates: Partial<Category>): Promise<Category> => {
  const categoryRef = doc(db, 'categories', categoryId);
  const categorySnap = await getDoc(categoryRef);

  if (!categorySnap.exists()) {
    throw new Error('Category not found');
  }

  const currentData = categorySnap.data();

  // If name is being updated, regenerate slug and check for duplicates
  let updatedData = { ...updates };
  if (updates.name && updates.name !== currentData.name) {
    updatedData.slug = generateSlug(updates.name);
    
    // Check for duplicate name
    const nameQuery = query(
      collection(db, 'categories'),
      where('name', '==', updates.name),
      limit(1)
    );
    const nameSnapshot = await getDocs(nameQuery);
    if (!nameSnapshot.empty && nameSnapshot.docs[0].id !== categoryId) {
      throw new Error('Category name already exists');
    }

    // Check for duplicate slug
    const slugQuery = query(
      collection(db, 'categories'),
      where('slug', '==', updatedData.slug),
      limit(1)
    );
    const slugSnapshot = await getDocs(slugQuery);
    if (!slugSnapshot.empty && slugSnapshot.docs[0].id !== categoryId) {
      throw new Error('Category slug already exists');
    }

    // If category name changed, update all products with this category
    const productsRef = collection(db, 'products');
    const productsQuery = query(productsRef, where('category', '==', currentData.name));
    const productsSnapshot = await getDocs(productsQuery);
    
    const updatePromises = productsSnapshot.docs.map(productDoc => {
      const productRef = doc(db, 'products', productDoc.id);
      return updateDoc(productRef, { category: updates.name });
    });
    
    await Promise.all(updatePromises);
  }

  updatedData.updatedAt = serverTimestamp() as any;

  await updateDoc(categoryRef, updatedData);
  
  const updatedSnap = await getDoc(categoryRef);
  const category = docToCategory(updatedSnap);
  if (!category) throw new Error('Failed to update category');
  
  return category;
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  const categoryRef = doc(db, 'categories', categoryId);
  const categorySnap = await getDoc(categoryRef);

  if (!categorySnap.exists()) {
    throw new Error('Category not found');
  }

  const categoryData = categorySnap.data();

  // Check if category has products
  const productsRef = collection(db, 'products');
  const productsQuery = query(productsRef, where('category', '==', categoryData.name), limit(1));
  const productsSnapshot = await getDocs(productsQuery);

  if (!productsSnapshot.empty) {
    throw new Error('Cannot delete category with existing products. Please remove or reassign products first.');
  }

  await deleteDoc(categoryRef);
};

/**
 * Subscribe to real-time category updates
 */
export const subscribeToCategories = (
  filters: CategoryFilters,
  onUpdate: (response: CategoriesResponse) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const { sort = 'newest', limit: pageSize = 20 } = filters;

  const categoriesRef = collection(db, 'categories');
  let q = query(categoriesRef);

  // Apply sorting
  switch (sort) {
    case 'name-asc': q = query(categoriesRef, orderBy('name', 'asc')); break;
    case 'name-desc': q = query(categoriesRef, orderBy('name', 'desc')); break;
    case 'oldest': q = query(categoriesRef, orderBy('createdAt', 'asc')); break;
    case 'newest':
    default: q = query(categoriesRef, orderBy('createdAt', 'desc')); break;
  }

  return onSnapshot(
    q,
    async (snapshot) => {
      const categories = snapshot.docs
        .map(docToCategory)
        .filter((c): c is Category => c !== null);

      // Update product counts (this is async but we'll do it in background)
      const productsRef = collection(db, 'products');
      for (const category of categories) {
        const productQuery = query(productsRef, where('category', '==', category.name));
        const productSnapshot = await getDocs(productQuery);
        category.productCount = productSnapshot.size;
      }

      onUpdate({
        categories,
        pagination: {
          currentPage: 1,
          pageSize,
          totalCount: categories.length,
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
 * Refresh product counts for all categories
 * This is a utility function for admin use to sync category counts with actual products
 */
export const refreshCategoryProductCounts = async (): Promise<void> => {
  try {
    // Get all categories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

    // Get all products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map(doc => doc.data());

    // Count products per category
    const categoryProductCounts: Record<string, number> = {};
    products.forEach((product: any) => {
      const categoryName = product.category;
      if (categoryName) {
        categoryProductCounts[categoryName] = (categoryProductCounts[categoryName] || 0) + 1;
      }
    });

    // Update each category with correct count
    const updatePromises = categories.map(category => {
      const count = categoryProductCounts[category.name] || 0;
      return updateDoc(doc(db, 'categories', category.id!), {
        productCount: count,
        updatedAt: serverTimestamp()
      });
    });

    await Promise.all(updatePromises);
    
    // Clear category cache to force refresh
    cache.clear();
    
    console.log('✅ Category product counts refreshed successfully');
  } catch (error) {
    console.error('Error refreshing category product counts:', error);
    throw error;
  }
};
