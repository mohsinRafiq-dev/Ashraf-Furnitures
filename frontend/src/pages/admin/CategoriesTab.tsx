import { motion } from "framer-motion";
import {
  RefreshCw,
  Plus,
  FolderOpen,
  Package,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAdmin } from "./AdminContext";

export default function CategoriesTab() {
  const {
    loading,
    products,
    categories,
    openAddCategoryModal,
    openEditCategoryModal,
    handleDeleteCategory,
    refreshCategoryCounts,
  } = useAdmin();

  return (
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
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={refreshCategoryCounts}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Counts
            </button>
            <button
              type="button"
              onClick={openAddCategoryModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>
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
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100">
          <FolderOpen className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No categories yet
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Create your first category to organize products
          </p>
          <button
            type="button"
            onClick={openAddCategoryModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 hover:shadow-2xl hover:-translate-y-2 transition-all"
              style={{ borderLeftColor: category.color || "#f59e0b" }}
            >
              {category.image && (
                <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <div
                    className="w-8 h-8 rounded-full shadow-inner"
                    style={{ backgroundColor: category.color || "#f59e0b" }}
                  />
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description || "No description"}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {products.filter((p) => p.category === category.name).length} products
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditCategoryModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => category.id && handleDeleteCategory(category.id)}
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
      )}
    </motion.div>
  );
}
