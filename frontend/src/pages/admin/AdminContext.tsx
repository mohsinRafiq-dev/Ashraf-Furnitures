/**
 * Shared state + handlers for AdminDashboard tabs.
 *
 * Tabs are lazy-loaded (one JS chunk per tab) and pull everything they need
 * from this context, so the orchestrator (AdminDashboard.tsx) stays the
 * single source of truth for products/categories/loading/modal state.
 */

import { createContext, useContext } from "react";
import type { Product } from "../../services/firebase/productService";
import type { Category } from "../../services/firebase/categoryService";

export type TabType =
  | "dashboard"
  | "products"
  | "categories"
  | "analytics"
  | "inquiries";

export type ProductSortField = "name" | "price" | "stock" | "date";
export type ProductSortOrder = "asc" | "desc";
export type ViewMode = "grid" | "list";

export type WebVitalName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB";
export type WebVitalRating = "good" | "needs-improvement" | "poor";

export interface SessionWebVital {
  name: WebVitalName;
  value: number;
  rating: WebVitalRating;
  ts: number;
}

export interface ProductAnalyticsRow {
  id: string;
  name: string;
  views: number;
  addToCart: number;
  wishlist: number;
  totalActions: number;
}

export interface CategoryStat {
  name: string;
  count: number;
  value: number;
}

export interface AdminContextValue {
  // Raw data
  products: Product[];
  categories: Category[];
  loading: boolean;

  // Derived counters
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  topProducts: Product[];
  categoryStats: CategoryStat[];
  filteredAndSortedProducts: Product[];
  productAnalytics: ProductAnalyticsRow[];
  webVitals: SessionWebVital[];

  // Product list controls
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortBy: ProductSortField;
  setSortBy: (v: ProductSortField) => void;
  sortOrder: ProductSortOrder;
  setSortOrder: (v: ProductSortOrder) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  selectedProducts: string[];

  // Navigation
  setActiveTab: (tab: TabType) => void;

  // Handlers
  openAddProductModal: () => void;
  openEditProductModal: (p: Product) => void;
  handleDeleteProduct: (id: string) => void | Promise<void>;
  handleSelectProduct: (id: string) => void;
  handleSelectAll: () => void;
  handleBulkDelete: () => void | Promise<void>;
  exportToCSV: () => void;

  openAddCategoryModal: () => void;
  openEditCategoryModal: (c: Category) => void;
  handleDeleteCategory: (id: string) => void | Promise<void>;
  refreshCategoryCounts: () => Promise<void>;

  handleRefreshData: () => Promise<void>;
  handleRefreshVitals: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = (): AdminContextValue => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used inside <AdminContext.Provider>");
  }
  return ctx;
};
