import { motion } from "framer-motion";
import {
  Package,
  FolderOpen,
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShoppingBag,
  Plus,
  Eye,
  RefreshCw,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  Clock,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { formatPrice } from "../../utils/formatPrice";

export default function DashboardTab() {
  const {
    products,
    totalProducts,
    totalCategories,
    totalRevenue,
    lowStockProducts,
    outOfStockProducts,
    featuredProducts,
    topProducts,
    categoryStats,
    openAddProductModal,
    openAddCategoryModal,
    openEditProductModal,
    handleRefreshData,
    setActiveTab,
  } = useAdmin();

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      trend: "+12%",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: FolderOpen,
      color: "from-purple-500 to-purple-600",
      trend: "+5%",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      trend: "+23%",
    },
    {
      label: "Low Stock",
      value: lowStockProducts,
      icon: TrendingDown,
      color: "from-red-500 to-red-600",
      trend: "-8%",
    },
  ];

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
            <button
              type="button"
              onClick={openAddProductModal}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:translate-x-1 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Product</span>
            </button>
            <button
              type="button"
              onClick={openAddCategoryModal}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:translate-x-1 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Category</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:translate-x-1 transition-all"
            >
              <Eye className="w-5 h-5" />
              <span className="font-medium">View All Products</span>
            </button>
            <button
              type="button"
              onClick={handleRefreshData}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg hover:translate-x-1 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">Refresh Data</span>
            </button>
          </div>
        </motion.div>

        {/* Inventory Status */}
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
                {products.filter((p) => (p.stock || 0) > 10).length}
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

        {/* Top Categories */}
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
                      animate={{
                        width: `${(cat.value / (categoryStats[0]?.value || 1)) * 100}%`,
                      }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-600">
                  {formatPrice(cat.value)}
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
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                onClick={() => openEditProductModal(product)}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={
                        typeof product.images[0] === "string"
                          ? product.images[0]
                          : product.images[0].url
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
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
                  <p className="font-bold text-amber-600">
                    {formatPrice(product.price * (product.stock || 0))}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.stock} × {formatPrice(product.price)}
                  </p>
                </div>
              </div>
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
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                onClick={() => openEditProductModal(product)}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={
                        typeof product.images[0] === "string"
                          ? product.images[0]
                          : product.images[0].url
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
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
                  <p className="font-bold text-amber-600">{formatPrice(product.price)}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
