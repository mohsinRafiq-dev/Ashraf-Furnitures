import { motion } from "framer-motion";
import {
  Search,
  Grid,
  List,
  Download,
  Plus,
  Filter,
  ArrowUpDown,
  Trash2,
  Package,
  Edit2,
  Star,
  ShoppingBag,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useAdmin } from "./AdminContext";

export default function ProductsTab() {
  const {
    loading,
    categories,
    filteredAndSortedProducts,
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
    handleSelectProduct,
    handleSelectAll,
    handleBulkDelete,
    exportToCSV,
    openAddProductModal,
    openEditProductModal,
    handleDeleteProduct,
  } = useAdmin();

  return (
    <motion.div
      key="products"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-4">
        {/* Search + Actions */}
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
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-gray-600 hover:text-amber-600"
                }`}
                title="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-gray-600 hover:text-amber-600"
                }`}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              type="button"
              onClick={openAddProductModal}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <Filter className="w-4 h-4 text-amber-600" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all text-sm font-medium text-gray-700 cursor-pointer shadow-sm hover:shadow-md"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <ArrowUpDown className="w-4 h-4 text-amber-600" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-") as [
                    typeof sortBy,
                    typeof sortOrder
                  ];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2.5 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all text-sm font-medium text-gray-700 cursor-pointer shadow-sm hover:shadow-md"
                aria-label="Sort products"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="stock-asc">Stock (Low-High)</option>
                <option value="stock-desc">Stock (High-Low)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {filteredAndSortedProducts.length} products
            </span>
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-600">
                  {selectedProducts.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all hover:scale-105 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

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
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100">
          <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            {searchQuery || filterCategory !== "all"
              ? "Try adjusting your filters or search query"
              : "Start by creating your first product"}
          </p>
          {!searchQuery && filterCategory === "all" && (
            <button
              type="button"
              onClick={openAddProductModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all relative"
            >
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id || "")}
                  onChange={() => product.id && handleSelectProduct(product.id)}
                  className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 bg-white shadow-md cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${product.name}`}
                />
              </div>

              <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden group">
                {product.images && product.images[0] ? (
                  <img
                    src={
                      typeof product.images[0] === "string"
                        ? product.images[0]
                        : product.images[0].url
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
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
                <h3 className="font-bold text-gray-900 truncate text-lg flex-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                {product.sku && (
                  <p className="text-xs text-gray-400 mb-3">SKU: {product.sku}</p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-amber-600">${product.price}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      (product.stock || 0) === 0
                        ? "bg-red-100 text-red-600"
                        : (product.stock || 0) < 10
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <ShoppingBag className="w-3 h-3" />
                    {product.stock || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditProductModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => product.id && handleDeleteProduct(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredAndSortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id || "")}
                  onChange={() => product.id && handleSelectProduct(product.id)}
                  className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer flex-shrink-0"
                  aria-label={`Select ${product.name}`}
                />

                <div className="relative w-full sm:w-24 lg:w-32 h-32 sm:h-24 lg:h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl overflow-hidden flex-shrink-0">
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

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          {product.name}
                        </h3>
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
                    <p className="text-2xl sm:text-3xl font-bold text-amber-600 flex-shrink-0">
                      ${product.price}
                    </p>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 ${
                        (product.stock || 0) === 0
                          ? "bg-red-100 text-red-600"
                          : (product.stock || 0) < 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                      Stock: {product.stock || 0}
                    </span>
                    {product.createdAt && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Added{" "}
                        {(product.createdAt instanceof Date
                          ? product.createdAt
                          : (product.createdAt as any).toDate()
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditProductModal(product)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => product.id && handleDeleteProduct(product.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
