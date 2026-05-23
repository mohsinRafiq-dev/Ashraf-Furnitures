/**
 * React Query hooks for Firestore data.
 *
 * Centralizes caching, deduplication and stale-time across the app so that
 * Home, Categories, Products, ProductDetail, etc. share one cache and don't
 * each refetch identical Firestore reads on every route change.
 */

import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryBySlug,
  type Category,
  type CategoryFilters,
} from "./categoryService";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  type Product,
  type ProductFilters,
} from "./productService";

// 5 min stale + 10 min gc keeps Firestore reads low without serving very old
// data to repeat visitors.
const DEFAULT_STALE_MS = 5 * 60 * 1000;
const DEFAULT_GC_MS = 10 * 60 * 1000;

// ============ Categories ============

export const useCategoriesQuery = (filters: CategoryFilters = {}) =>
  useQuery({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
    staleTime: DEFAULT_STALE_MS,
    gcTime: DEFAULT_GC_MS,
  });

export const useCategoryBySlugQuery = (slug: string | undefined) =>
  useQuery<Category | null>({
    queryKey: ["category", "slug", slug],
    queryFn: () => (slug ? getCategoryBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug,
    staleTime: DEFAULT_STALE_MS,
    gcTime: DEFAULT_GC_MS,
  });

// ============ Products ============

export const useProductsQuery = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: DEFAULT_STALE_MS,
    gcTime: DEFAULT_GC_MS,
  });

export const useFeaturedProductsQuery = (limit = 8) =>
  useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => getProducts({ limit }),
    staleTime: DEFAULT_STALE_MS,
    gcTime: DEFAULT_GC_MS,
  });

export const useProductByIdQuery = (id: string | undefined) =>
  useQuery<Product | null>({
    queryKey: ["product", "id", id],
    queryFn: () => (id ? getProductById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: DEFAULT_STALE_MS,
    gcTime: DEFAULT_GC_MS,
  });

export const useProductBySlugQuery = (slug: string | undefined) =>
  useQuery<Product | null>({
    queryKey: ["product", "slug", slug],
    queryFn: () => (slug ? getProductBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug,
    staleTime: DEFAULT_STALE_MS,
    gcTime: DEFAULT_GC_MS,
  });
