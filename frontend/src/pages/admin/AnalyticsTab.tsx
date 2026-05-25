import { motion } from "framer-motion";
import {
  Gauge,
  RefreshCw,
  Package,
  FolderOpen,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Eye,
  ShoppingBag,
  Star,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { formatPrice } from "../../utils/formatPrice";

export default function AnalyticsTab() {
  const {
    products,
    categories,
    totalRevenue,
    lowStockProducts,
    outOfStockProducts,
    featuredProducts,
    topProducts,
    categoryStats,
    productAnalytics,
    webVitals,
    handleRefreshVitals,
    handleRefreshData,
  } = useAdmin();

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Analytics & Insights
        </h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleRefreshVitals}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            <Gauge className="w-4 h-4" />
            Refresh Vitals
          </button>
          <button
            type="button"
            onClick={handleRefreshData}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Core Web Vitals (Current Session)
            </h3>
            <p className="text-sm text-gray-500">
              Measured in your browser after page load
            </p>
          </div>
        </div>

        {webVitals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {webVitals.map((v) => (
              <div key={v.name} className="rounded-xl border p-4 bg-gray-50/80">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-800">{v.name}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      v.rating === "good"
                        ? "bg-green-100 text-green-700"
                        : v.rating === "needs-improvement"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.rating}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {v.name === "CLS" ? v.value.toFixed(3) : Math.round(v.value)}
                  <span className="text-sm text-gray-500 ml-1">
                    {v.name === "CLS" ? "" : "ms"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No session vitals yet. Visit Home, Categories, or Products and refresh this tab.
          </p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Products
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{products.length}</p>
          <p className="text-blue-100 text-sm">Total Products</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <FolderOpen className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Categories
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{categories.length}</p>
          <p className="text-purple-100 text-sm">Active Categories</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Value
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{formatPrice(totalRevenue)}</p>
          <p className="text-green-100 text-sm">Inventory Value</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Alert
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{lowStockProducts}</p>
          <p className="text-red-100 text-sm">Low Stock Items</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
                  <p className="font-bold text-amber-600">
                    ${((product.stock || 0) * product.price).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{product.stock} units</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-center text-gray-400 py-8">No product data available</p>
            )}
          </div>
        </div>

        {/* Category Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
                <div key={`${cat.name}-${index}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{cat.name}</span>
                    <div className="text-right">
                      <span className="font-bold text-purple-600">
                        ${cat.value.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({cat.count} items)
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% of total
                    </span>
                    <span className="text-xs text-gray-500">
                      Avg: ${cat.count > 0 ? (cat.value / cat.count).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              );
            })}
            {categoryStats.length === 0 && (
              <p className="text-center text-gray-400 py-8">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Product Engagement */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Product
                  </th>
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
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Total Actions
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {productAnalytics.slice(0, 10).map((item, index) => {
                  const engagementRate =
                    item.views > 0
                      ? (
                          ((item.addToCart + item.wishlist) / item.views) *
                          100
                        ).toFixed(1)
                      : "0.0";

                  return (
                    <tr
                      key={item.id}
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
                              style={{
                                width: `${Math.min(parseFloat(engagementRate), 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {engagementRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No engagement data yet</p>
            <p className="text-sm text-gray-400">
              Product views and actions will appear here
            </p>
          </div>
        )}
      </div>

      {/* Stock & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
            {products
              .filter((p) => (p.stock || 0) === 0)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900 truncate flex-1">
                    {product.name}
                  </span>
                  <span className="text-xs text-red-600 font-semibold">0 left</span>
                </div>
              ))}
            {outOfStockProducts === 0 && (
              <p className="text-center text-gray-400 py-4 text-sm">
                All products in stock!
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
            {products
              .filter((p) => (p.stock || 0) > 0 && (p.stock || 0) < 10)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900 truncate flex-1">
                    {product.name}
                  </span>
                  <span className="text-xs text-yellow-600 font-semibold">
                    {product.stock} left
                  </span>
                </div>
              ))}
            {lowStockProducts === 0 && (
              <p className="text-center text-gray-400 py-4 text-sm">
                No low stock alerts
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
            {products
              .filter((p) => p.featured)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-amber-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900 truncate flex-1">
                    {product.name}
                  </span>
                  <span className="text-xs text-amber-600 font-semibold">
                    ${product.price}
                  </span>
                </div>
              ))}
            {featuredProducts === 0 && (
              <p className="text-center text-gray-400 py-4 text-sm">
                No featured products
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <CheckCircle className="w-8 h-8" />
          Inventory Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-amber-100 text-sm mb-1">Average Product Price</p>
            <p className="text-3xl font-bold">
              $
              {products.length > 0
                ? (
                    products.reduce((sum, p) => sum + p.price, 0) / products.length
                  ).toFixed(2)
                : "0"}
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
              {products.length > 0
                ? Math.round(
                    ((products.length - lowStockProducts - outOfStockProducts) /
                      products.length) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-amber-100 text-sm mb-1">Products/Category</p>
            <p className="text-3xl font-bold">
              {categories.length > 0
                ? (products.length / categories.length).toFixed(1)
                : "0"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
