/**
 * Firebase Services Index
 * 
 * Central export point for all Firebase services.
 */

// Firebase configuration
export { auth, db, storage, analytics } from '../../config/firebase';

// Product service
export {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  subscribeToProducts,
  getProductStats,
  generateSlug
} from './productService';

export type {
  Product,
  ProductImage,
  ProductVariant,
  ProductSpec,
  ProductFilters,
  ProductsResponse
} from './productService';

// Category service
export {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  subscribeToCategories
} from './categoryService';

export type {
  Category,
  CategoryFilters,
  CategoriesResponse
} from './categoryService';

// Auth service
export {
  loginWithEmail,
  loginWithGoogle,
  checkGoogleRedirectResult,
  logout,
  getCurrentUser,
  onAuthChange,
  sendPasswordReset,
  changePassword,
  getIdToken,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from './authService';

export type {
  AdminUser,
  AdminRole,
  LoginCredentials,
  LoginResponse
} from './authService';

// Storage service
export {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteAllItemImages,
  deleteImageByUrl,
  replaceImage,
  cropAndUploadImage,
  getItemImages,
  getPathFromUrl,
  validateImageDimensions
} from './storageService';

export type {
  UploadOptions,
  UploadResult
} from './storageService';

// Analytics service
export {
  generateSessionId,
  detectDeviceType,
  detectTrafficSource,
  getOrCreateSession,
  endSession,
  trackProductView,
  trackAddToCart,
  trackAddToWishlist,
  getTotalVisitors,
  getVisitorsByPeriod,
  getTopProducts,
  getTrafficSources,
  getDeviceTypes,
  getAnalyticsSummary,
  getProductAnalytics,
  getProductAnalyticsById,
  initializeAnalytics
} from './analyticsService';

export type {
  VisitorSession,
  ProductView,
  DeviceType,
  TrafficSource,
  ProductAction
} from './analyticsService';
