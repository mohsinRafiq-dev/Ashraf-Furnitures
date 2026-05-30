import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  BarChart3,
  X,
  Save,
  LogOut,
  User,
  Menu,
  Image as ImageIcon,
  ZoomOut,
  ZoomIn,
  Home,
} from 'lucide-react';
// react-easy-crop is only needed inside the image crop modal. Lazy-loading
// keeps it out of the initial admin bundle (~50 KB gz).
const Cropper = lazy(() => import('react-easy-crop'));

// Each tab is its own JS chunk — only the tab the admin opens gets downloaded.
const DashboardTab = lazy(() => import('./admin/DashboardTab'));
const ProductsTab = lazy(() => import('./admin/ProductsTab'));
const CategoriesTab = lazy(() => import('./admin/CategoriesTab'));
const AnalyticsTab = lazy(() => import('./admin/AnalyticsTab'));

import { AdminContext, type AdminContextValue } from './admin/AdminContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '../services/firebase/productService';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  refreshCategoryProductCounts,
  Category
} from '../services/firebase/categoryService';
import { getProductAnalytics } from '../services/firebase/analyticsService';
import {
  uploadImage,
  deleteImageByUrl,
} from '../services/firebase/storageService';
import { cache } from '../utils/cache';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

/**
 * Convert a `data:image/jpeg;base64,...` URL produced by the cropper into a
 * File that we can hand to Firebase Storage's uploadImage().
 */
const dataUrlToFile = async (
  dataUrl: string,
  filename = 'cropped.jpg'
): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
};

/** True when the form holds a freshly-cropped image that still needs upload. */
const isDataUrl = (s: string): boolean => !!s && s.startsWith('data:');

/** True when the form holds an already-uploaded image URL (Firebase Storage). */
const isHttpUrl = (s: string): boolean =>
  !!s && (s.startsWith('http://') || s.startsWith('https://'));

type TabType = 'dashboard' | 'products' | 'categories' | 'analytics';

type WebVitalName = 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

interface SessionWebVital {
  name: WebVitalName;
  value: number;
  rating: WebVitalRating;
  ts: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New features state
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryColor, setCategoryColor] = useState('#f59e0b');
  const [categoryImage, setCategoryImage] = useState('');

  // Product Modal
  // Numeric inputs are held as STRINGS so the user can fully clear them
  // (typing "12", backspace, backspace ⇒ "" instead of being stuck at "0").
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productCategory, setProductCategory] = useState('');
  const [productStock, setProductStock] = useState<string>('');
  const [productSku, setProductSku] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productFeatured, setProductFeatured] = useState(false);
  // When true, the storefront shows "Contact for Price" instead of an amount.
  const [productHidePrice, setProductHidePrice] = useState(true);

  // Cropper state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropTarget, setCropTarget] = useState<'product' | 'category' | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const cropContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [minZoom, setMinZoom] = useState(0.1);

  const onMediaLoaded = (mediaSize: { width: number; height: number }) => {
    // compute a zoom that fits the whole image inside the crop area so user sees image fully zoomed out
    const container = cropContainerRef.current;
    if (!container) return;
    const { width: cw, height: ch } = container.getBoundingClientRect();
    const fitZoom = Math.min(cw / mediaSize.width, ch / mediaSize.height);

    // use fitZoom when smaller than 1 so the full image is visible; otherwise keep 1
    const initialZoom = Math.min(1, fitZoom || 1);
    setZoom(initialZoom);

    // allow zooming out further than the initial fit; keep a reasonable lower bound
    setMinZoom(0.05);
  };
  
  // Analytics state
  const [productAnalytics, setProductAnalytics] = useState<Array<{
    id: string;
    name: string;
    views: number;
    addToCart: number;
    wishlist: number;
    totalActions: number;
  }>>([]);
  const [webVitals, setWebVitals] = useState<SessionWebVital[]>([]);

  const loadWebVitals = () => {
    try {
      const raw = sessionStorage.getItem('ashraf_web_vitals');
      const parsed = raw ? JSON.parse(raw) : [];
      const safe = Array.isArray(parsed) ? parsed : [];
      const ordered = safe.sort((a: SessionWebVital, b: SessionWebVital) => a.name.localeCompare(b.name));
      setWebVitals(ordered);
    } catch {
      setWebVitals([]);
    }
  };

  const handleRefreshVitals = async () => {
    try {
      toast.loading('Refreshing vitals...');
      const mod = await import('../utils/webVitals');
      mod.initWebVitals();

      // Give observers a brief moment to flush buffered values.
      await new Promise((resolve) => setTimeout(resolve, 250));
      loadWebVitals();
      toast.dismiss();
      toast.success('Vitals refreshed');
    } catch {
      toast.dismiss();
      toast.error('Failed to refresh vitals');
    }
  };

  useEffect(() => {
    loadData();
    loadWebVitals();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadWebVitals();
    }
  }, [activeTab]);

  // Handle window resize to ensure proper sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Close mobile menu when resizing to desktop
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async (showErrorToast = true): Promise<boolean> => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, analyticsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getProductAnalytics()
      ]);
      setProducts(productsRes.products);
      setCategories(categoriesRes.categories);
      setProductAnalytics(analyticsData);
      return true;
    } catch (error) {
      console.error('Error loading data:', error);
      if (showErrorToast) {
        toast.error('Failed to load data');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      toast.loading('Refreshing dashboard data...');
      cache.clear();
      const success = await loadData(false);
      toast.dismiss();
      if (success) {
        toast.success('Dashboard data refreshed');
      } else {
        toast.error('Failed to refresh dashboard data');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to refresh dashboard data');
    }
  };

  // Category functions
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setCategoryColor('#f59e0b');
    setCategoryImage('');
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setCategoryColor(category.color || '#f59e0b');
    setCategoryImage(category.image || '');
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setShowCategoryModal(false);
    const toastId = toast.loading(
      isDataUrl(categoryImage)
        ? 'Uploading image...'
        : editingCategory?.id
        ? 'Updating category...'
        : 'Creating category...'
    );

    try {
      const previousImageUrl = editingCategory?.image || '';

      let finalImageUrl = '';
      if (isDataUrl(categoryImage)) {
        const file = await dataUrlToFile(categoryImage, 'category.jpg');
        const itemId = editingCategory?.id || `new-${Date.now()}`;
        const uploaded = await uploadImage({ folder: 'categories', itemId, file });
        finalImageUrl = uploaded.url;
        toast.loading(
          editingCategory?.id ? 'Updating category...' : 'Creating category...',
          { id: toastId }
        );
      } else if (isHttpUrl(categoryImage)) {
        finalImageUrl = categoryImage;
      }

      const categoryData: Partial<Category> = {
        name: categoryName,
        description: categoryDescription,
        color: categoryColor,
        image: finalImageUrl,
      };

      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, categoryData);
        toast.success('Category updated!', { id: toastId });
      } else {
        await createCategory(categoryData as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Category created!', { id: toastId });
      }

      if (
        previousImageUrl &&
        previousImageUrl !== finalImageUrl &&
        isHttpUrl(previousImageUrl)
      ) {
        deleteImageByUrl(previousImageUrl).catch((err) =>
          console.warn('Old category image cleanup failed:', err)
        );
      }

      await loadData(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category', { id: toastId });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category?')) return;

    try {
      await deleteCategory(categoryId);
      toast.success('Category deleted');
      await loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const refreshCategoryCounts = async () => {
    try {
      toast.loading('Refreshing product counts...');
      await refreshCategoryProductCounts();
      await loadData();
      toast.dismiss();
      toast.success('Product counts refreshed!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to refresh counts');
    }
  };

  // Product functions
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductCategory('');
    setProductStock('');
    setProductSku('');
    setProductImage('');
    setProductFeatured(false);
    setProductHidePrice(true); // Default: price hidden until admin opts in
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price ? String(product.price) : '');
    setProductCategory(product.category);
    setProductStock(product.stock ? String(product.stock) : '');
    setProductSku(product.sku || '');
    setProductImage(
      product.images && product.images[0]
        ? typeof product.images[0] === 'string'
          ? product.images[0]
          : product.images[0].url
        : ''
    );
    setProductFeatured(product.featured || false);
    // Existing products without the flag default to "hidden" (the new default).
    setProductHidePrice(
      (product as Product & { hidePrice?: boolean }).hidePrice ?? true
    );
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    if (!productName.trim() || !productCategory) {
      toast.error('Name and category are required');
      return;
    }

    // Close modal immediately and roll the network calls into the background
    // so saving feels instant.
    setShowProductModal(false);
    const toastId = toast.loading(
      isDataUrl(productImage)
        ? 'Uploading image...'
        : editingProduct?.id
        ? 'Updating product...'
        : 'Creating product...'
    );

    try {
      // Image strategy
      // 1. data:image/jpeg;... → freshly cropped, upload to Firebase Storage,
      //    then store only the returned URL on the Firestore doc.
      // 2. https://… → unchanged, keep as-is.
      // 3. "" → no image, store an empty array.
      const previousImageUrl =
        editingProduct?.images?.[0] && typeof editingProduct.images[0] !== 'string'
          ? editingProduct.images[0].url
          : '';

      let finalImageUrl = '';
      if (isDataUrl(productImage)) {
        const file = await dataUrlToFile(productImage, 'product.jpg');
        const itemId = editingProduct?.id || `new-${Date.now()}`;
        const uploaded = await uploadImage({ folder: 'products', itemId, file });
        finalImageUrl = uploaded.url;
        toast.loading(
          editingProduct?.id ? 'Updating product...' : 'Creating product...',
          { id: toastId }
        );
      } else if (isHttpUrl(productImage)) {
        finalImageUrl = productImage;
      }

      const parsedPrice = productPrice.trim() === '' ? 0 : Number(productPrice);
      const parsedStock = productStock.trim() === '' ? 0 : Number(productStock);

      const productData: Partial<Product> & { hidePrice?: boolean } = {
        name: productName,
        description: productDescription,
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        category: productCategory,
        stock: Number.isFinite(parsedStock) ? parsedStock : 0,
        sku: productSku,
        images: finalImageUrl
          ? [{ url: finalImageUrl, alt: productName, isPrimary: true }]
          : [],
        featured: productFeatured,
        hidePrice: productHidePrice,
        rating: editingProduct?.rating || 0,
        reviews: editingProduct?.reviews || 0,
      };

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated!', { id: toastId });
      } else {
        await createProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Product created!', { id: toastId });
      }

      // Best-effort cleanup of the previous Storage image if we replaced it.
      if (
        previousImageUrl &&
        previousImageUrl !== finalImageUrl &&
        isHttpUrl(previousImageUrl)
      ) {
        deleteImageByUrl(previousImageUrl).catch((err) =>
          console.warn('Old product image cleanup failed:', err)
        );
      }

      await loadData(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product', { id: toastId });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      await deleteProduct(productId);
      toast.success('Product deleted');
      await loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isProduct: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // warn on very large images but allow them (we downscale output)
    if (file.size > 15 * 1024 * 1024) {
      toast('Large image detected — it will be resized after cropping to avoid memory issues');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Open crop modal and set target (will be cropped before saving)
      setCropImage(base64);
      setCropTarget(isProduct ? 'product' : 'category');
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Cropper helpers
  const onCropComplete = (_: any, croppedArea: any) => {
    setCroppedAreaPixels(croppedArea);
  };

  const createImage = (url: string, pixelCrop: any): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener('load', () => {
        // Aggressively downscale: storefront cards render at ~800px max.
        // 1000px gives a 2× retina buffer while keeping doc size small.
        const MAX_OUTPUT = 1000;
        const outW = pixelCrop.width;
        const outH = pixelCrop.height;
        const scale = Math.min(1, MAX_OUTPUT / Math.max(outW, outH));

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(outW * scale);
        canvas.height = Math.round(outH * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }
        resolve(canvas);
      });
      image.src = url;
    });
  };

  const getCroppedImage = async () => {
    if (!cropImage || !croppedAreaPixels || !cropTarget) return;
    try {
      const canvas = await createImage(cropImage, croppedAreaPixels);
      // 0.78 quality is visually indistinguishable from 0.95 for product photos
      // but ~3x smaller. Combined with the 1000px cap, a typical cropped image
      // drops from ~600 KB to ~60-120 KB — Firestore docs stay under 200 KB
      // and page loads are dramatically faster.
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.78);
      if (cropTarget === 'product') setProductImage(croppedBase64);
      else setCategoryImage(croppedBase64);

      // Reset crop state
      setShowCropModal(false);
      setCropImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropTarget(null);
      toast.success('Image cropped');
    } catch (err) {
      console.error('Crop error:', err);
      toast.error('Failed to crop image');
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        toast.success('Logged out successfully');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
      }
    }
  };

  // New helper functions
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Delete ${selectedProducts.length} selected products?`)) return;

    try {
      await Promise.all(selectedProducts.map(id => deleteProduct(id)));
      toast.success(`${selectedProducts.length} products deleted`);
      setSelectedProducts([]);
      await loadData();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredAndSortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredAndSortedProducts.map(p => p.id).filter(Boolean) as string[]);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Price', 'Stock', 'SKU', 'Featured'];
    const rows = filteredAndSortedProducts.map(p => [
      p.name,
      p.category,
      p.price,
      p.stock || 0,
      p.sku || '',
      p.featured ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Products exported to CSV');
  };

  // Stats calculations
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length;
  const featuredProducts = products.filter(p => p.featured).length;
  const outOfStockProducts = products.filter(p => (p.stock || 0) === 0).length;

  // Top selling products by stock value
  const topProducts = [...products]
    .sort((a, b) => (b.price * (b.stock || 0)) - (a.price * (a.stock || 0)))
    .slice(0, 5);

  // Category performance
  const categoryStats = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.category === cat.name).length,
    value: products
      .filter(p => p.category === cat.name)
      .reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
  })).sort((a, b) => b.value - a.value);

  // Filter and sort products
  let filteredAndSortedProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.sku?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  filteredAndSortedProducts = [...filteredAndSortedProducts].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'stock':
        comparison = (a.stock || 0) - (b.stock || 0);
        break;
      case 'date': {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.toDate().getTime();
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.toDate().getTime();
        comparison = bTime - aTime;
        break;
      }
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const navItems = [
    { id: 'dashboard' as TabType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products' as TabType, icon: Package, label: 'Products' },
    { id: 'categories' as TabType, icon: FolderOpen, label: 'Categories' },
    { id: 'analytics' as TabType, icon: BarChart3, label: 'Analytics' },
  ];

  // Single source of truth handed to lazy-loaded tabs.
  const contextValue: AdminContextValue = useMemo(
    () => ({
      products,
      categories,
      loading,
      totalProducts,
      totalCategories,
      totalRevenue,
      lowStockProducts,
      outOfStockProducts,
      featuredProducts,
      topProducts,
      categoryStats,
      filteredAndSortedProducts,
      productAnalytics,
      webVitals,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
      filterCategory,
      setFilterCategory,
      viewMode,
      setViewMode,
      selectedProducts,
      setActiveTab,
      openAddProductModal,
      openEditProductModal,
      handleDeleteProduct,
      handleSelectProduct,
      handleSelectAll,
      handleBulkDelete,
      exportToCSV,
      openAddCategoryModal,
      openEditCategoryModal,
      handleDeleteCategory,
      refreshCategoryCounts,
      handleRefreshData,
      handleRefreshVitals,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      products,
      categories,
      loading,
      filteredAndSortedProducts,
      productAnalytics,
      webVitals,
      searchQuery,
      sortBy,
      sortOrder,
      filterCategory,
      viewMode,
      selectedProducts,
    ]
  );

  return (
    <AdminContext.Provider value={contextValue}>
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (mobileMenuOpen ? 0 : '-100%') : 0,
          width: isMobile ? '16rem' : (sidebarCollapsed ? '5rem' : '16rem')
        }}
        transition={{
          x: { type: 'tween', duration: 0.3 },
          width: { type: 'tween', duration: 0.3 }
        }}
        className="fixed left-0 top-0 h-full bg-white shadow-2xl z-50 border-r border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 lg:p-6 flex items-center justify-between border-b border-gray-200">
            {(!sidebarCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="px-3 py-1.5 lg:px-4 lg:py-2">
                  <img 
                    src="/Asset 5.png" 
                    alt="Logo" 
                    className="h-8 lg:h-10 w-auto max-w-full object-contain"
                  />
                </div>
              </motion.div>
            )}
            <button
              onClick={() => {
                if (isMobile) {
                  setMobileMenuOpen(false);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Home Button */}
            <motion.button
              onClick={() => {
                navigate('/');
                // Close mobile menu when navigating home on mobile
                if (isMobile) {
                  setMobileMenuOpen(false);
                }
              }}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-700 hover:bg-amber-50 border border-gray-200 hover:border-amber-300"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {(!sidebarCollapsed || isMobile) && (
                <span className="font-medium">Go to Home</span>
              )}
            </motion.button>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  // Close mobile menu when switching tabs on mobile
                  if (isMobile) {
                    setMobileMenuOpen(false);
                  }
                }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!sidebarCollapsed || isMobile) && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 ${(sidebarCollapsed && !isMobile) ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {(!sidebarCollapsed || isMobile) && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} p-4 sm:p-6 lg:p-8`}>
        {/* Enhanced Mobile Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:hidden mb-6"
        >
          {/* Main Header Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500 rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            {/* Content */}
            <div className="relative p-4">
              {/* Top Row: Menu & Logo */}
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-gray-700 shadow-sm"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
                
                {/* Logo */}
                <div className="px-4 py-2">
                  <img 
                    src="/Asset 5.png" 
                    alt="Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </div>

                {/* Logout Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl transition-all text-red-600 shadow-sm"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Bottom Row: User Info & Active Tab */}
              <div className="flex items-center justify-between">
                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border-2 border-amber-200">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.name || 'Admin'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-amber-600" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-base">{user?.name || 'Admin'}</p>
                    <p className="text-gray-500 text-xs font-medium">Administrator</p>
                  </div>
                </div>

                {/* Active Tab Indicator */}
                <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                  <p className="text-amber-700 text-xs font-semibold uppercase tracking-wide">
                    {navItems.find(item => item.id === activeTab)?.label}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar (Optional) */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <motion.div 
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-xl p-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Products</p>
                  <p className="text-sm font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-xl p-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Categories</p>
                  <p className="text-sm font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-xl p-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-sm font-bold text-gray-900">{productAnalytics.reduce((sum, p) => sum + p.views, 0)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8 hidden lg:block"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {navItems.find(item => item.id === activeTab)?.label}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Welcome back, {user?.name || 'Admin'}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <Suspense
            key={activeTab}
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600" />
              </div>
            }
          >
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'categories' && <CategoriesTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto my-8"
            >
              <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 sm:p-6 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close modal"
                  title="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                    placeholder="e.g. Living Room"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                    rows={3}
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color Theme</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="w-16 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                      aria-label="Category color"
                      title="Choose category color"
                    />
                    <input
                      type="text"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                      placeholder="#f59e0b"
                      title="Color hex code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-500 transition-colors">
                    <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 text-center px-4">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="hidden"
                        aria-label="Category image"
                        title="Upload category image"
                      />
                    </label>
                  </div>
                  {categoryImage && (
                    <img src={categoryImage} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-xl" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="w-full sm:flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-base"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveCategory}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all text-base"
                  >
                    <Save className="w-5 h-5" />
                    Save Category
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowProductModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8"
            >
              <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 sm:p-6 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close modal"
                  title="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                    placeholder="e.g. Modern Sofa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                    rows={3}
                    placeholder="Product description..."
                  />
                </div>

                {/* Hide Price Toggle */}
                <div className="flex items-center justify-between gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Hide price on website</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Customers will see "Contact for Price" and a WhatsApp button instead of the amount.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProductHidePrice((v) => !v)}
                    role="switch"
                    aria-checked={productHidePrice ? 'true' : 'false'}
                    aria-label="Toggle hide price"
                    title={productHidePrice ? 'Price is hidden — click to show' : 'Price is shown — click to hide'}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 p-0.5 ${
                      productHidePrice ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform ${
                        productHidePrice ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price {productHidePrice ? '(optional — hidden)' : '*'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">Rs.</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={productHidePrice}
                        placeholder={productHidePrice ? 'Not shown to customers' : '0'}
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={productStock}
                      onChange={(e) => setProductStock(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all text-base font-medium text-gray-700 cursor-pointer shadow-sm hover:shadow-md"
                      aria-label="Product category"
                      title="Select product category"
                    >
                      <option value="" className="bg-white hover:bg-amber-50 py-2">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name} className="bg-white hover:bg-amber-50 py-2">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                    <input
                      type="text"
                      value={productSku}
                      onChange={(e) => setProductSku(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                      placeholder="SKU-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-500 transition-colors">
                    <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 text-center px-4">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                        aria-label="Product image"
                        title="Upload product image"
                      />
                    </label>
                  </div>
                  {productImage && (
                    <img src={productImage} alt="Preview" className="mt-3 w-full h-48 sm:h-64 object-cover rounded-xl" />
                  )}
                </div>

                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={productFeatured}
                    onChange={(e) => setProductFeatured(e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 flex-shrink-0"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Mark as Featured Product
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="w-full sm:flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-base"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProduct}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all text-base"
                  >
                    <Save className="w-5 h-5" />
                    Save Product
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Crop Modal */}
      <AnimatePresence>
        {showCropModal && cropImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowCropModal(false); setCropImage(null); setCropTarget(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700/50 rounded-xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Crop Image</h3>

              <div ref={cropContainerRef} className="relative w-full bg-gray-800 rounded-lg overflow-hidden mb-4" style={{ height: '400px' }}>
                {cropImage && (
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        Loading editor…
                      </div>
                    }
                  >
                    <Cropper
                      image={cropImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      restrictPosition={false}
                      onMediaLoaded={onMediaLoaded}
                    />
                  </Suspense>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Zoom</label>
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-4 h-4 text-gray-400" />
                    <input
                      type="range"
                      min={minZoom}
                      max={4}
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowCropModal(false); setCropImage(null); setCropTarget(null); }}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={getCroppedImage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Crop & Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </AdminContext.Provider>
  );
};

export default AdminDashboard;
