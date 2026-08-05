import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getProductsChunk,
  getCachedFirstProductsChunk,
  Product as FirebaseProduct,
  ProductFilters,
} from "../services/firebase/productService";
import { getCategories, Category } from "../services/firebase/categoryService";
import { SkeletonGrid } from "../components/ProductSkeleton";
import { WishlistButton } from "../components/WishlistButton";
import { OptimizedImage } from "../components/OptimizedImage";
import { sendProductInquiry } from "../utils/whatsapp";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { PriceOrInquiry } from "../components/PriceOrInquiry";
import SEO from "../components/SEO";
import { StructuredData, generateItemListSchema } from "../utils/structuredData";
import {
  Star,
  X,
  ZoomIn,
  ZoomOut,
  Eye,
  ShoppingCart,
  Sparkles,
  Loader,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

type ProductSort = NonNullable<ProductFilters["sort"]>;

const PRODUCT_SORT_OPTIONS: ProductSort[] = [
  "newest",
  "oldest",
  "price-asc",
  "price-desc",
  "rating",
  "popular",
  "featured",
];

const getCategoryFilterFromSearch = (searchParams: URLSearchParams) => {
  const category = searchParams.get("category")?.trim();
  return category ? category : "all";
};

const getSortFilterFromSearch = (
  searchParams: URLSearchParams
): ProductSort => {
  const sort = searchParams.get("sort");
  return PRODUCT_SORT_OPTIONS.includes(sort as ProductSort)
    ? (sort as ProductSort)
    : "newest";
};

/**
 * Chunked pagination can hand back a product we already hold — a re-fired
 * observer, a stale cursor, or a cache-primed list racing the first fetch.
 * Appending blind renders the same card twice and trips React's key warning,
 * so reconcile on document id instead.
 */
const appendUniqueProducts = <T extends { id?: string }>(
  prev: T[],
  incoming: T[]
): T[] => {
  const seen = new Set(prev.map((p) => p.id));
  return [...prev, ...incoming.filter((p) => !seen.has(p.id))];
};

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from the URL on first render so we can hit the persistent
  // cache with the right key before any state is set.
  const initialFiltersKey = useMemo(() => {
    const category = getCategoryFilterFromSearch(searchParams);
    const sort = getSortFilterFromSearch(searchParams);
    const featured = searchParams.get("featured") === "true";
    return {
      category: category === "all" ? undefined : category,
      sort,
      featured: featured ? true : undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pick a page size early too (mirrors the useMemo below) so the cache key
  // matches what the chunk service writes.
  const initialPageSize = useMemo(() => {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      deviceMemory?: number;
    };
    const connectionType = nav.connection?.effectiveType || "4g";
    const deviceMemory = nav.deviceMemory || 4;
    const isSmallScreen = window.innerWidth < 768;
    if (connectionType === "2g" || connectionType === "slow-2g" || deviceMemory <= 2) return 6;
    if (connectionType === "3g" || isSmallScreen) return 9;
    return 12;
  }, []);

  const cachedFirst = useMemo(
    () => getCachedFirstProductsChunk(initialPageSize, initialFiltersKey),
    [initialPageSize, initialFiltersKey]
  );

  const [products, setProducts] = useState<FirebaseProduct[]>(
    () => cachedFirst?.products ?? []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!cachedFirst); // skip skeleton on cache hit
  const [loadingMore, setLoadingMore] = useState(false);
  const [prefetching, setPrefetching] = useState(false);
  // Same reasoning as prefetchingRef below: `loadingMore` is read inside
  // loadMoreProducts' closure, so two invocations fired before React commits
  // the state both pass the guard and append the same chunk twice.
  const loadingMoreRef = useRef(false);
  // Re-entrancy guard for prefetching. Deliberately a ref, not the state
  // above: `prefetchNextProducts` feeds `fetchInitialProducts`, which feeds the
  // effect that calls it. Putting the guard in the dep array makes every
  // prefetch churn those identities and refire the effect — an endless
  // fetch loop that only shows up once there are enough products for
  // `hasMore` to be true. The state is kept purely to drive the spinner.
  const prefetchingRef = useRef(false);
  const [hasMore, setHasMore] = useState(cachedFirst?.hasMore ?? true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [prefetchedProducts, setPrefetchedProducts] = useState<FirebaseProduct[]>([]);
  const [prefetchedLastDoc, setPrefetchedLastDoc] = useState<any>(null);
  const [prefetchedHasMore, setPrefetchedHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<FirebaseProduct | null>(
    null
  );
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [quickViewZoom, setQuickViewZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState(() =>
    getCategoryFilterFromSearch(searchParams)
  );
  const [selectedSort, setSelectedSort] = useState<ProductSort>(() =>
    getSortFilterFromSearch(searchParams)
  );
  const [featuredOnly, setFeaturedOnly] = useState(
    () => searchParams.get("featured") === "true"
  );

  const { INITIAL_LOAD, LOAD_MORE } = useMemo(() => {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      deviceMemory?: number;
    };

    const connectionType = nav.connection?.effectiveType || "4g";
    const deviceMemory = nav.deviceMemory || 4;
    const isSmallScreen = window.innerWidth < 768;

    if (connectionType === "2g" || connectionType === "slow-2g" || deviceMemory <= 2) {
      return { INITIAL_LOAD: 6, LOAD_MORE: 6 };
    }

    if (connectionType === "3g" || isSmallScreen) {
      return { INITIAL_LOAD: 9, LOAD_MORE: 9 };
    }

    return { INITIAL_LOAD: 12, LOAD_MORE: 12 };
  }, []);

  // Detect mobile on mount and resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const nextCategory = getCategoryFilterFromSearch(searchParams);
    const nextSort = getSortFilterFromSearch(searchParams);
    const nextFeaturedOnly = searchParams.get("featured") === "true";

    setSelectedCategory((current) =>
      current === nextCategory ? current : nextCategory
    );
    setSelectedSort((current) => (current === nextSort ? current : nextSort));
    setFeaturedOnly((current) =>
      current === nextFeaturedOnly ? current : nextFeaturedOnly
    );
  }, [searchParams]);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams();

    if (selectedCategory !== "all") {
      nextSearchParams.set("category", selectedCategory);
    }

    if (selectedSort !== "newest") {
      nextSearchParams.set("sort", selectedSort);
    }

    if (featuredOnly) {
      nextSearchParams.set("featured", "true");
    }

    if (searchParams.toString() !== nextSearchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [featuredOnly, searchParams, selectedCategory, selectedSort, setSearchParams]);

  // Animation variants for product cards - optimized for performance
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const activeFilters = useMemo<Pick<ProductFilters, "category" | "featured" | "sort">>(
    () => ({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      featured: featuredOnly ? true : undefined,
      sort: selectedSort,
    }),
    [selectedCategory, featuredOnly, selectedSort]
  );

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSort("newest");
    setFeaturedOnly(false);
  };

  const prefetchNextProducts = useCallback(async (cursor: any, hasMoreFlag: boolean) => {
    if (!cursor || !hasMoreFlag || prefetchingRef.current) return;

    try {
      prefetchingRef.current = true;
      setPrefetching(true);
      const response = await getProductsChunk(LOAD_MORE, cursor, activeFilters);
      setPrefetchedProducts(response.products || []);
      setPrefetchedLastDoc(response.lastDoc);
      setPrefetchedHasMore(response.hasMore);
    } catch (error) {
      console.error("Failed to prefetch products:", error);
      setPrefetchedProducts([]);
      setPrefetchedLastDoc(null);
      setPrefetchedHasMore(false);
    } finally {
      prefetchingRef.current = false;
      setPrefetching(false);
    }
  }, [LOAD_MORE, activeFilters]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories({ sort: "name-asc", limit: 50 });
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Failed to load filter categories:", error);
      }
    };

    loadCategories();
  }, []);

  const fetchInitialProducts = useCallback(async () => {
    try {
      setLoading(true);
      setPrefetchedProducts([]);
      setPrefetchedLastDoc(null);
      setPrefetchedHasMore(false);
      const response = await getProductsChunk(INITIAL_LOAD, null, activeFilters);
      setProducts(response.products || []);
      setLastDoc(response.lastDoc);
      setHasMore(response.hasMore);
      setError(null);

      if (response.lastDoc && response.hasMore) {
        prefetchNextProducts(response.lastDoc, response.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
      setLastDoc(null);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [prefetchNextProducts, INITIAL_LOAD, activeFilters]);

  const loadMoreProducts = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore) return;

    try {
      loadingMoreRef.current = true;
      setLoadingMore(true);

      if (prefetchedProducts.length > 0) {
        setProducts((prev) => appendUniqueProducts(prev, prefetchedProducts));
        setLastDoc(prefetchedLastDoc);
        setHasMore(prefetchedHasMore);

        setPrefetchedProducts([]);
        setPrefetchedLastDoc(null);
        setPrefetchedHasMore(false);

        if (prefetchedLastDoc && prefetchedHasMore) {
          prefetchNextProducts(prefetchedLastDoc, prefetchedHasMore);
        }
      } else {
        const response = await getProductsChunk(LOAD_MORE, lastDoc, activeFilters);
        setProducts((prev) => appendUniqueProducts(prev, response.products || []));
        setLastDoc(response.lastDoc);
        setHasMore(response.hasMore);

        if (response.lastDoc && response.hasMore) {
          prefetchNextProducts(response.lastDoc, response.hasMore);
        }
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
      setHasMore(false);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [
    loadingMore,
    hasMore,
    lastDoc,
    prefetchedProducts,
    prefetchedLastDoc,
    prefetchedHasMore,
    prefetchNextProducts,
    activeFilters,
    LOAD_MORE,
  ]);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0, rootMargin: "900px 0px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreProducts, loadingMore, hasMore, loading]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100/60 via-white to-orange-100/60 overflow-hidden">
      {/* SEO Optimization */}
      <SEO
        title="All Products - Browse Our Furniture Collection"
        description="Browse our complete collection of premium furniture. Find the perfect pieces for your home or office - sofas, tables, chairs, bedroom sets, and more. Quality craftsmanship at competitive prices."
        keywords={[
          'furniture collection',
          'all products',
          'buy furniture online',
          'furniture catalog',
          'home furniture',
          'office furniture',
        ]}
      />
      
      {/* Structured Data for Product Listing */}
      {products.length > 0 && (
        <StructuredData
          data={generateItemListSchema(
            products.slice(0, 20).map(p => ({
              id: p.id || '',
              name: p.name,
              description: p.description,
              image: p.images?.[0]?.url || '',
              price: p.price,
              currency: 'PKR',
              availability: p.stock > 0 ? 'InStock' : 'OutOfStock',
              brand: 'Ashraf Furnitures',
              category: p.category,
              rating: p.rating,
              reviewCount: p.reviews,
              sku: p.sku,
            })),
            'All Furniture Products'
          )}
        />
      )}

      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8"
      >
        {/* Static decorative backdrop */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden
        >
          {!isMobile && (
            <>
              <div className="absolute -top-56 -right-56 w-96 h-96 bg-gradient-to-b from-amber-300/40 via-amber-200/30 to-transparent rounded-full opacity-50 blur-3xl" />
              <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-transparent rounded-full opacity-45 blur-3xl" />
            </>
          )}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-200/30 via-orange-100/20 to-transparent rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with Premium Design */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-2 sm:mb-3 lg:mb-4 text-center space-y-1 sm:space-y-2"
          >
            {/* Premium Badge with Spinning Icon */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-full backdrop-blur-sm text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
                Explore
              </span>
            </motion.div>

            {/* Main Heading with Gradient Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
            >
              All{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Products
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto px-2 sm:px-0"
            >
              Discover our complete collection of premium furniture pieces
            </motion.p>

            {/* Products Count */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm lg:text-base text-amber-600 font-semibold"
            >
              {products.length} {products.length === 1 ? "Product" : "Products"}{" "}
              Available
            </motion.p>

            {/* Accent Line Animation */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              viewport={{ once: true }}
              className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full origin-left mx-auto mt-4"
            />

            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 sm:mt-8 relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-white via-amber-50/80 to-orange-50/70 shadow-xl p-4 sm:p-6"
              >
                <div className="absolute inset-0 pointer-events-none opacity-60">
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/10 blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-gradient-to-tr from-orange-300/20 to-amber-200/10 blur-2xl" />
                </div>

                <div className="relative flex items-center justify-between gap-3 mb-5 flex-col sm:flex-row">
                  <div className="flex items-center gap-3 text-gray-900 justify-center sm:justify-start">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg">
                      <SlidersHorizontal className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filter Products</h2>
                      <p className="text-xs sm:text-sm text-gray-600">Refine the collection by category and sort order</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-amber-200/70 text-xs sm:text-sm font-semibold text-amber-700 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    {products.length} visible
                  </div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 text-left">
                    <span className="uppercase tracking-wide text-[11px] text-amber-700">Category</span>
                    <div className="relative group">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none px-4 pr-12 py-3.5 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/70 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all group-hover:border-amber-300"
                      >
                        <option value="all">All categories</option>
                        {categories.map((category) => (
                          <option key={category.id || category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 shadow-sm">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 text-left">
                    <span className="uppercase tracking-wide text-[11px] text-amber-700">Sort by</span>
                    <div className="relative group">
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value as ProductSort)}
                        className="w-full appearance-none px-4 pr-12 py-3.5 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/70 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all group-hover:border-amber-300"
                      >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="price-asc">Price: Low to high</option>
                        <option value="price-desc">Price: High to low</option>
                        <option value="featured">Featured first</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 shadow-sm">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-amber-200/80 bg-white/90 text-sm font-semibold text-gray-700 shadow-sm md:mt-[1.65rem] cursor-pointer hover:border-amber-300 transition-colors">
                    <span className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${featuredOnly ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gray-300"}`}>
                      <span className={`absolute h-5 w-5 rounded-full bg-white shadow-md transition-transform ${featuredOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                    </span>
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="sr-only"
                    />
                    <span>Featured only</span>
                  </label>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all md:mt-[1.65rem]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}

            {/* Loading State - Show Skeleton Grid */}
            {loading && <SkeletonGrid count={12} />}
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="w-full pb-12 sm:pb-16 lg:pb-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="text-center py-12 sm:py-16 lg:py-24">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                ⚠️
              </div>
              <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mb-2 px-2 sm:px-0">
                {error}
              </h3>
              <button
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Display all loaded products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.1,
                      margin: "0px 0px -50px 0px",
                    }}
                    onMouseEnter={() => product.id && setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    onClick={() => product.id && navigate(`/product/${product.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col group hover:-translate-y-1">
                      {/* Image Container — square aspect, contain so the whole product is visible */}
                      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-50/60 to-orange-50/40">
                        {/* Wishlist Button */}
                        {product.id && (
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-40 pointer-events-auto">
                            <WishlistButton
                              id={product.id}
                              name={product.name}
                              price={product.price}
                              image={product.images?.[0]?.url || ""}
                            />
                          </div>
                        )}

                        {product.images && product.images.length > 0 ? (
                          <OptimizedImage
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className={`w-full h-full object-contain p-4 transition-transform duration-500 ${
                              hoveredProductId === product.id
                                ? "scale-105"
                                : "scale-100"
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🛋️
                          </div>
                        )}

                        {/* Discount Badge - Currently not in Firebase schema */}
                        {/* 
                        {product.discount && (
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                            <div className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                              -{product.discount}%
                            </div>
                          </div>
                        )}
                        */}

                        {/* Stock Status Badge */}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay — single Quick View action */}
                        {hoveredProductId === product.id &&
                          product.images &&
                          product.images.length > 0 &&
                          product.stock > 0 && (
                            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 z-30 pointer-events-none">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickViewProduct(product);
                                  setQuickViewImageIndex(0);
                                  setQuickViewZoom(1);
                                  setShowQuickView(true);
                                  document.body.style.overflow = "hidden";
                                }}
                                className="pointer-events-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur text-gray-900 font-semibold text-sm rounded-xl hover:bg-white transition-all shadow-lg"
                              >
                                <Eye className="w-4 h-4" />
                                Quick View
                              </button>
                            </div>
                          )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>

                        {/* Price + tiny rating row */}
                        <div className="flex items-center justify-between gap-3">
                          <PriceOrInquiry
                            productName={product.name}
                            price={product.price}
                            hidePrice={product.hidePrice}
                            variant="card"
                          />
                          {product.rating > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-semibold">{product.rating.toFixed(1)}</span>
                            </span>
                          )}
                        </div>

                        {/* Stock pill */}
                        <span
                          className={`inline-flex w-fit items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            product.stock > 0
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.stock > 0 ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>

                        {/* Single action */}
                        <div className="mt-auto pt-1">
                          {product.hidePrice ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                sendProductInquiry(product.name, product.price, { showPrice: false });
                              }}
                              disabled={product.stock === 0}
                              className="w-full py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                              title="Ask price on WhatsApp"
                            >
                              <WhatsAppIcon className="w-5 h-5" />
                              Contact for Price
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={product.stock === 0}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all"
                              >
                                <ShoppingCart className="w-4 h-4 inline mr-1.5" />
                                Add to Cart
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendProductInquiry(product.name, product.price);
                                }}
                                className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                                title="Order via WhatsApp"
                              >
                                <WhatsAppIcon className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8 sm:py-10">
                  {(loadingMore || prefetching) && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-semibold">
                        {loadingMore ? "Loading more products..." : "Preparing more products..."}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Load More Button - Currently loading all products */}
              {/* 
              {hasMoreProducts && (
                <div className="flex justify-center mt-12 sm:mt-16 lg:mt-20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `Load More Products (${products.length}/${totalProducts})`
                    )}
                  </motion.button>
                </div>
              )}
              */}
            </>
          ) : !loading && products.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <p className="text-base sm:text-lg lg:text-2xl text-gray-500 mb-4 px-2 sm:px-0">
                No products match the selected filters
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-orange-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {/* Quick View Modal - Image Gallery Only */}
      {showQuickView && quickViewProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto pt-20"
          onClick={() => {
            setShowQuickView(false);
            document.body.style.overflow = "unset";
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xl w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                {quickViewProduct.name}
              </h2>
              <button
                onClick={() => {
                  setShowQuickView(false);
                  document.body.style.overflow = "unset";
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2 hover:rotate-90"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {quickViewProduct.images && quickViewProduct.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image with Zoom Controls */}
                  <div className="space-y-3">
                    <div className="w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
                      <img
                        key={quickViewImageIndex}
                        src={quickViewProduct.images[quickViewImageIndex].url}
                        alt={quickViewProduct.name}
                        className="w-full h-full object-cover"
                        style={{ transform: `scale(${quickViewZoom})` }}
                      />
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          setQuickViewZoom(Math.max(1, quickViewZoom - 0.2))
                        }
                        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors hover:scale-110 active:scale-95"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-semibold text-gray-700 w-16 text-center">
                        {Math.round(quickViewZoom * 100)}%
                      </span>
                      <button
                        onClick={() =>
                          setQuickViewZoom(Math.min(3, quickViewZoom + 0.2))
                        }
                        className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors hover:scale-110 active:scale-95"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setQuickViewZoom(1)}
                        className="ml-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors hover:scale-105 active:scale-95"
                        title="Reset Zoom"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {quickViewProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {quickViewProduct.images.map(
                        (img: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => {
                              setQuickViewImageIndex(index);
                              setQuickViewZoom(1);
                            }}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                              quickViewImageIndex === index
                                ? "border-amber-600 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`${quickViewProduct.name} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-6xl">
                  🛋️
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
