import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  LogOut,
  User,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Menu,
  Image as ImageIcon,
  ArrowUpDown,
  Filter,
  Download,
  Grid,
  List,
  AlertTriangle,
  Star,
  ShoppingBag,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Home
} from 'lucide-react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  Product 
} from '../services/firebase/productService';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category
} from '../services/firebase/categoryService';
import { getProductAnalytics } from '../services/firebase/analyticsService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

type TabType = 'dashboard' | 'products' | 'categories' | 'analytics';

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
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productCategory, setProductCategory] = useState('');
  const [productStock, setProductStock] = useState(0);
  const [productSku, setProductSku] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productFeatured, setProductFeatured] = useState(false);
  
  // Analytics state
  const [productAnalytics, setProductAnalytics] = useState<Array<{
    id: string;
    name: string;
    views: number;
    addToCart: number;
    wishlist: number;
    totalActions: number;
  }>>([]);

  useEffect(() => {
    loadData();
  }, []);

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

  const loadData = async () => {
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
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
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

    try {
      const categoryData: Partial<Category> = {
        name: categoryName,
        description: categoryDescription,
        color: categoryColor,
        image: categoryImage,
      };

      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, categoryData);
        toast.success('Category updated!');
      } else {
        await createCategory(categoryData as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Category created!');
      }

      setShowCategoryModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
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

  // Product functions
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductName('');
    setProductDescription('');
    setProductPrice(0);
    setProductCategory('');
    setProductStock(0);
    setProductSku('');
    setProductImage('');
    setProductFeatured(false);
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductCategory(product.category);
    setProductStock(product.stock || 0);
    setProductSku(product.sku || '');
    setProductImage(
      product.images && product.images[0]
        ? typeof product.images[0] === 'string'
          ? product.images[0]
          : product.images[0].url
        : ''
    );
    setProductFeatured(product.featured || false);
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    if (!productName.trim() || !productCategory) {
      toast.error('Name and category are required');
      return;
    }

    try {
      const productData: Partial<Product> = {
        name: productName,
        description: productDescription,
        price: productPrice,
        category: productCategory,
        stock: productStock,
        sku: productSku,
        images: productImage ? [{ url: productImage, alt: productName, isPrimary: true }] : [],
        featured: productFeatured,
        rating: editingProduct?.rating || 0,
        reviews: editingProduct?.reviews || 0
      };

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated!');
      } else {
        await createProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Product created!');
      }

      setShowProductModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
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

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isProduct) {
        setProductImage(base64);
      } else {
        setCategoryImage(base64);
      }
    };
    reader.readAsDataURL(file);
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

  return (
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
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    label: 'Total Products', 
                    value: totalProducts, 
                    icon: Package, 
                    color: 'from-blue-500 to-blue-600',
                    trend: '+12%'
                  },
                  { 
                    label: 'Categories', 
                    value: totalCategories, 
                    icon: FolderOpen, 
                    color: 'from-purple-500 to-purple-600',
                    trend: '+5%'
                  },
                  { 
                    label: 'Total Revenue', 
                    value: `$${totalRevenue.toLocaleString()}`, 
                    icon: DollarSign, 
                    color: 'from-green-500 to-green-600',
                    trend: '+23%'
                  },
                  { 
                    label: 'Low Stock', 
                    value: lowStockProducts, 
                    icon: TrendingDown, 
                    color: 'from-red-500 to-red-600',
                    trend: '-8%'
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {stat.trend}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions & Stats Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openAddProductModal}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add New Product</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openAddCategoryModal}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add New Category</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('products')}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">View All Products</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={loadData}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span className="font-medium">Refresh Data</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Additional Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                    Inventory Status
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">In Stock</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {products.filter(p => (p.stock || 0) > 10).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700">Low Stock</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">{lowStockProducts}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">Out of Stock</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">{outOfStockProducts}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">Featured</span>
                      </div>
                      <span className="text-lg font-bold text-amber-600">{featuredProducts}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Category Performance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-amber-600" />
                    Top Categories
                  </h2>
                  <div className="space-y-3">
                    {categoryStats.slice(0, 5).map((cat, index) => (
                      <div key={cat.name} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                            <span className="text-xs text-gray-500">{cat.count} items</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(cat.value / (categoryStats[0]?.value || 1)) * 100}%` }}
                              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-amber-600">
                          ${cat.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Top Products & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products by Value */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber-600" />
                    Top Products by Value
                  </h2>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                        onClick={() => openEditProductModal(product)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img
                              src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">${(product.price * (product.stock || 0)).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{product.stock} × ${product.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-amber-600" />
                    Recent Products
                  </h2>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                        onClick={() => openEditProductModal(product)}
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img
                              src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">${product.price}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-4">
                {/* Search and Actions Row */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 w-full lg:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, category, or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'grid'
                            ? 'bg-white text-amber-600 shadow-sm'
                            : 'text-gray-600 hover:text-amber-600'
                        }`}
                        title="Grid view"
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'list'
                            ? 'bg-white text-amber-600 shadow-sm'
                            : 'text-gray-600 hover:text-amber-600'
                        }`}
                        title="List view"
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Export Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportToCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                      title="Export to CSV"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Export</span>
                    </motion.button>

                    {/* Add Product Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openAddProductModal}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                    >
                      <Plus className="w-5 h-5" />
                      Add Product
                    </motion.button>
                  </div>
                </div>

                {/* Filters and Sort Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                      <Filter className="w-4 h-4 text-amber-600" />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2.5 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all text-sm font-medium text-gray-700 cursor-pointer shadow-sm hover:shadow-md"
                        aria-label="Filter by category"
                      >
                        <option value="all" className="bg-white hover:bg-amber-50 py-2">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name} className="bg-white hover:bg-amber-50 py-2">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                      <ArrowUpDown className="w-4 h-4 text-amber-600" />
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                          setSortBy(field);
                          setSortOrder(order);
                        }}
                        className="px-4 py-2.5 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all text-sm font-medium text-gray-700 cursor-pointer shadow-sm hover:shadow-md"
                        aria-label="Sort products"
                      >
                        <option value="date-desc" className="bg-white hover:bg-amber-50 py-2">Newest First</option>
                        <option value="date-asc" className="bg-white hover:bg-amber-50 py-2">Oldest First</option>
                        <option value="name-asc" className="bg-white hover:bg-amber-50 py-2">Name (A-Z)</option>
                        <option value="name-desc" className="bg-white hover:bg-amber-50 py-2">Name (Z-A)</option>
                        <option value="price-asc" className="bg-white hover:bg-amber-50 py-2">Price (Low-High)</option>
                        <option value="price-desc" className="bg-white hover:bg-amber-50 py-2">Price (High-Low)</option>
                        <option value="stock-asc" className="bg-white hover:bg-amber-50 py-2">Stock (Low-High)</option>
                        <option value="stock-desc" className="bg-white hover:bg-amber-50 py-2">Stock (High-Low)</option>
                      </select>
                    </div>
                  </div>

                  {/* Results Count & Bulk Actions */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {filteredAndSortedProducts.length} products
                    </span>
                    {selectedProducts.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-amber-600">
                          {selectedProducts.length} selected
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleBulkDelete}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </motion.button>
                        <button
                          onClick={() => setSelectedProducts([])}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bulk Select Checkbox */}
                {filteredAndSortedProducts.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredAndSortedProducts.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      id="select-all"
                    />
                    <label htmlFor="select-all" className="text-sm text-gray-600 cursor-pointer">
                      Select all products
                    </label>
                  </div>
                )}
              </div>

              {/* Products Grid/List */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100"
                >
                  <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6">
                    {searchQuery || filterCategory !== 'all' 
                      ? 'Try adjusting your filters or search query' 
                      : 'Start by creating your first product'}
                  </p>
                  {!searchQuery && filterCategory === 'all' && (
                    <button
                      onClick={openAddProductModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Add Product
                    </button>
                  )}
                </motion.div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all relative"
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id || '')}
                          onChange={() => product.id && handleSelectProduct(product.id)}
                          className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 bg-white shadow-md cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${product.name}`}
                        />
                      </div>

                      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden group">
                        {product.images && product.images[0] ? (
                          <img
                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-16 h-16 text-amber-300" />
                          </div>
                        )}
                        {product.featured && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </div>
                        )}
                        {(product.stock || 0) === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 truncate text-lg flex-1">{product.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                        {product.sku && (
                          <p className="text-xs text-gray-400 mb-3">SKU: {product.sku}</p>
                        )}
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-2xl font-bold text-amber-600">${product.price}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            (product.stock || 0) === 0 
                              ? 'bg-red-100 text-red-600'
                              : (product.stock || 0) < 10 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            <ShoppingBag className="w-3 h-3" />
                            {product.stock || 0}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditProductModal(product)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => product.id && handleDeleteProduct(product.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredAndSortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6">
                        {/* Selection Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id || '')}
                          onChange={() => product.id && handleSelectProduct(product.id)}
                          className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer flex-shrink-0"
                          aria-label={`Select ${product.name}`}
                        />

                        {/* Product Image */}
                        <div className="relative w-full sm:w-24 lg:w-32 h-32 sm:h-24 lg:h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl overflow-hidden flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img
                              src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="w-12 h-12 text-amber-300" />
                            </div>
                          )}
                          {(product.stock || 0) === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 text-base sm:text-lg">{product.name}</h3>
                                {product.featured && (
                                  <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{product.category}</p>
                              {product.sku && (
                                <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
                              )}
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold text-amber-600 flex-shrink-0">${product.price}</p>
                          </div>
                          
                          {product.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-0">
                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 ${
                              (product.stock || 0) === 0 
                                ? 'bg-red-100 text-red-600'
                                : (product.stock || 0) < 10 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                              Stock: {product.stock || 0}
                            </span>
                            {product.createdAt && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Added {(product.createdAt instanceof Date ? product.createdAt : product.createdAt.toDate()).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditProductModal(product)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all whitespace-nowrap"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => product.id && handleDeleteProduct(product.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all whitespace-nowrap"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">All Categories</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openAddCategoryModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Category
                  </motion.button>
                </div>
              </div>

              {/* Categories Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100"
                >
                  <FolderOpen className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6">Create your first category to organize products</p>
                  <button
                    onClick={openAddCategoryModal}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Category
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 hover:shadow-2xl transition-all"
                      style={{ borderLeftColor: category.color || '#f59e0b' }}
                    >
                      {category.image && (
                        <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                          <div 
                            className="w-8 h-8 rounded-full shadow-inner"
                            style={{ backgroundColor: category.color || '#f59e0b' }}
                          />
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description || 'No description'}</p>
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {products.filter(p => p.category === category.name).length} products
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditCategoryModal(category)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => category.id && handleDeleteCategory(category.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Analytics Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics & Insights</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadData}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </motion.button>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 opacity-80" />
                    <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">Products</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{products.length}</p>
                  <p className="text-blue-100 text-sm">Total Products</p>
                </motion.div>

                {/* Total Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FolderOpen className="w-8 h-8 opacity-80" />
                    <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">Categories</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{categories.length}</p>
                  <p className="text-purple-100 text-sm">Active Categories</p>
                </motion.div>

                {/* Total Inventory Value */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 opacity-80" />
                    <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">Value</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-green-100 text-sm">Inventory Value</p>
                </motion.div>

                {/* Low Stock Alert */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 opacity-80" />
                    <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">Alert</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{lowStockProducts}</p>
                  <p className="text-red-100 text-sm">Low Stock Items</p>
                </motion.div>
              </div>

              {/* Performance Metrics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Products */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Top Performers</h3>
                      <p className="text-sm text-gray-500">Highest value products</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {topProducts.slice(0, 5).map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">${((product.stock || 0) * product.price).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{product.stock} units</p>
                        </div>
                      </div>
                    ))}
                    {topProducts.length === 0 && (
                      <p className="text-center text-gray-400 py-8">No product data available</p>
                    )}
                  </div>
                </motion.div>

                {/* Category Performance */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Category Insights</h3>
                      <p className="text-sm text-gray-500">Performance by category</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {categoryStats.map((cat, index) => {
                      const percentage = totalRevenue > 0 ? (cat.value / totalRevenue) * 100 : 0;
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{cat.name}</span>
                            <div className="text-right">
                              <span className="font-bold text-purple-600">${cat.value.toLocaleString()}</span>
                              <span className="text-xs text-gray-500 ml-2">({cat.count} items)</span>
                            </div>
                          </div>
                          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</span>
                            <span className="text-xs text-gray-500">Avg: ${cat.count > 0 ? (cat.value / cat.count).toFixed(2) : '0.00'}</span>
                          </div>
                        </div>
                      );
                    })}
                    {categoryStats.length === 0 && (
                      <p className="text-center text-gray-400 py-8">No category data available</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Product Engagement & Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Product Engagement</h3>
                    <p className="text-sm text-gray-500">Views, clicks, and customer actions</p>
                  </div>
                </div>

                {productAnalytics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            <div className="flex items-center justify-center gap-1">
                              <Eye className="w-4 h-4" />
                              Views
                            </div>
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            <div className="flex items-center justify-center gap-1">
                              <ShoppingBag className="w-4 h-4" />
                              Add to Cart
                            </div>
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4" />
                              Wishlist
                            </div>
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Actions</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productAnalytics.slice(0, 10).map((item, index) => {
                          const engagementRate = item.views > 0 
                            ? ((item.addToCart + item.wishlist) / item.views * 100).toFixed(1)
                            : '0.0';
                          
                          return (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold text-xs">
                                    {index + 1}
                                  </span>
                                  <span className="font-medium text-gray-900">{item.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                                  {item.views}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                                  {item.addToCart}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold text-sm">
                                  {item.wishlist}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="font-bold text-gray-900">{item.totalActions}</span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                      style={{ width: `${Math.min(parseFloat(engagementRate), 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700">{engagementRate}%</span>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No engagement data yet</p>
                    <p className="text-sm text-gray-400">Product views and actions will appear here</p>
                  </div>
                )}
              </motion.div>

              {/* Stock & Alerts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Out of Stock */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Out of Stock</h3>
                      <p className="text-sm text-gray-500">{outOfStockProducts} products</p>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {products.filter(p => (p.stock || 0) === 0).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 truncate flex-1">{product.name}</span>
                        <span className="text-xs text-red-600 font-semibold">0 left</span>
                      </div>
                    ))}
                    {outOfStockProducts === 0 && (
                      <p className="text-center text-gray-400 py-4 text-sm">All products in stock!</p>
                    )}
                  </div>
                </motion.div>

                {/* Low Stock */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Low Stock</h3>
                      <p className="text-sm text-gray-500">{lowStockProducts} products</p>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 truncate flex-1">{product.name}</span>
                        <span className="text-xs text-yellow-600 font-semibold">{product.stock} left</span>
                      </div>
                    ))}
                    {lowStockProducts === 0 && (
                      <p className="text-center text-gray-400 py-4 text-sm">No low stock alerts</p>
                    )}
                  </div>
                </motion.div>

                {/* Featured Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Star className="w-6 h-6 text-amber-600 fill-current" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Featured</h3>
                      <p className="text-sm text-gray-500">{featuredProducts} products</p>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {products.filter(p => p.featured).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 truncate flex-1">{product.name}</span>
                        <span className="text-xs text-amber-600 font-semibold">${product.price}</span>
                      </div>
                    ))}
                    {featuredProducts === 0 && (
                      <p className="text-center text-gray-400 py-4 text-sm">No featured products</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  Inventory Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-amber-100 text-sm mb-1">Average Product Price</p>
                    <p className="text-3xl font-bold">
                      ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-100 text-sm mb-1">Total Stock Units</p>
                    <p className="text-3xl font-bold">
                      {products.reduce((sum, p) => sum + (p.stock || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-100 text-sm mb-1">Stock Health</p>
                    <p className="text-3xl font-bold">
                      {products.length > 0 ? Math.round(((products.length - lowStockProducts - outOfStockProducts) / products.length) * 100) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-100 text-sm mb-1">Products/Category</p>
                    <p className="text-3xl font-bold">
                      {categories.length > 0 ? (products.length / categories.length).toFixed(1) : '0'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                      <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                    <input
                      type="number"
                      value={productStock}
                      onChange={(e) => setProductStock(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
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
    </div>
  );
};

export default AdminDashboard;
