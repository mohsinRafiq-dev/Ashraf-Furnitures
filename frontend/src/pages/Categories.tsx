import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getCategoriesChunk,
  getCachedFirstCategoriesChunk,
  refreshCategoryProductCounts,
} from "../services/firebase/categoryService";
import { OptimizedImage } from "../components/OptimizedImage";
import SEO from "../components/SEO";
import { Loader, Sparkles } from "lucide-react";

/**
 * Stable identity for a category row. The service returns Firestore's `id`;
 * `_id` is only kept as a fallback for older cached payloads. Falling through
 * to `name` is a last resort — names are not guaranteed unique.
 */
const categoryKey = (category: any): string =>
  category?.id || category?._id || category?.name;

/**
 * Chunked pagination can hand back a row we already hold (a stale cursor, or a
 * cache-primed list racing the first fetch). Appending blind renders the same
 * category twice, so reconcile on identity instead.
 */
const appendUnique = (prev: any[], incoming: any[]): any[] => {
  const seen = new Set(prev.map(categoryKey));
  return [...prev, ...incoming.filter((c) => !seen.has(categoryKey(c)))];
};

export default function Categories() {
  const navigate = useNavigate();

  // Compute device-aware page sizes once, before state init so we can use
  // them as the cache lookup key.
  const { INITIAL_LOAD, LOAD_MORE } = useMemo(() => {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      deviceMemory?: number;
    };

    const connectionType = nav.connection?.effectiveType || "4g";
    const deviceMemory = nav.deviceMemory || 4;
    const isMobile = window.innerWidth < 768;

    if (connectionType === "2g" || connectionType === "slow-2g" || deviceMemory <= 2) {
      return { INITIAL_LOAD: 4, LOAD_MORE: 4 };
    }

    if (connectionType === "3g" || isMobile) {
      return { INITIAL_LOAD: 6, LOAD_MORE: 6 };
    }

    return { INITIAL_LOAD: 8, LOAD_MORE: 8 };
  }, []);

  // Lazy-init from the persistent cache so the page paints instantly on
  // repeat visits. We still kick off a background fetch to refresh.
  const cachedFirst = useMemo(
    () => getCachedFirstCategoriesChunk(INITIAL_LOAD),
    [INITIAL_LOAD]
  );

  const [displayedCategories, setDisplayedCategories] = useState<any[]>(
    () => cachedFirst?.categories ?? []
  );
  const [loading, setLoading] = useState(!cachedFirst); // skip skeleton if cache hit
  const [loadingMore, setLoadingMore] = useState(false);
  const [prefetching, setPrefetching] = useState(false);
  const [hasMore, setHasMore] = useState(cachedFirst?.hasMore ?? true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [prefetchedCategories, setPrefetchedCategories] = useState<any[]>([]);
  const [prefetchedLastDoc, setPrefetchedLastDoc] = useState<any>(null);
  const [prefetchedHasMore, setPrefetchedHasMore] = useState(false);
  const [countsRepairAttempted, setCountsRepairAttempted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const prefetchNextCategories = useCallback(async (cursor: any, hasMoreFlag: boolean) => {
    if (!cursor || !hasMoreFlag || prefetching) return;

    try {
      setPrefetching(true);
      const response = await getCategoriesChunk(LOAD_MORE, cursor);
      setPrefetchedCategories(response.categories || []);
      setPrefetchedLastDoc(response.lastDoc);
      setPrefetchedHasMore(response.hasMore);
    } catch (error) {
      console.error("Error prefetching categories:", error);
      setPrefetchedCategories([]);
      setPrefetchedLastDoc(null);
      setPrefetchedHasMore(false);
    } finally {
      setPrefetching(false);
    }
  }, [prefetching, LOAD_MORE]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesChunk(INITIAL_LOAD, null);
      setDisplayedCategories(response.categories || []);
      setLastDoc(response.lastDoc);
      setHasMore(response.hasMore);

      // Self-heal stale productCount fields, but at most ONCE per browser
      // (was running on every page load and doing an N+1 query that took
      // multiple seconds — that's the main reason this page felt slow).
      const REPAIR_KEY = "af:categoriesCountRepaired";
      const alreadyRepaired =
        typeof sessionStorage !== "undefined" && sessionStorage.getItem(REPAIR_KEY) === "1";

      const allZero =
        (response.categories || []).length > 0 &&
        (response.categories || []).every((c: any) => (c.productCount || 0) === 0);

      if (allZero && !alreadyRepaired && !countsRepairAttempted) {
        setCountsRepairAttempted(true);
        try {
          sessionStorage.setItem(REPAIR_KEY, "1");
        } catch {
          /* private mode, ignore */
        }
        // Fire and forget — don't block the render path. The repaired counts
        // will show up on the next visit.
        refreshCategoryProductCounts()
          .then(() => getCategoriesChunk(INITIAL_LOAD, null))
          .then((repaired) => {
            setDisplayedCategories(repaired.categories || []);
            setLastDoc(repaired.lastDoc);
            setHasMore(repaired.hasMore);
          })
          .catch((err) => console.warn("Category count self-heal failed:", err));
      }

      if (response.lastDoc && response.hasMore) {
        prefetchNextCategories(response.lastDoc, response.hasMore);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setDisplayedCategories([]);
      setLastDoc(null);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreCategories = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      if (prefetchedCategories.length > 0) {
        setDisplayedCategories(prev => appendUnique(prev, prefetchedCategories));
        setLastDoc(prefetchedLastDoc);
        setHasMore(prefetchedHasMore);

        setPrefetchedCategories([]);
        setPrefetchedLastDoc(null);
        setPrefetchedHasMore(false);

        if (prefetchedLastDoc && prefetchedHasMore) {
          prefetchNextCategories(prefetchedLastDoc, prefetchedHasMore);
        }
      } else {
        const response = await getCategoriesChunk(LOAD_MORE, lastDoc);
        setDisplayedCategories(prev => appendUnique(prev, response.categories || []));
        setLastDoc(response.lastDoc);
        setHasMore(response.hasMore);

        if (response.lastDoc && response.hasMore) {
          prefetchNextCategories(response.lastDoc, response.hasMore);
        }
      }
    } catch (error) {
      console.error("Error loading more categories:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [
    loadingMore,
    hasMore,
    lastDoc,
    prefetchedCategories,
    prefetchedLastDoc,
    prefetchedHasMore,
    prefetchNextCategories,
  ]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadMoreCategories();
        }
      },
      { threshold: 0, rootMargin: "700px 0px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreCategories, loadingMore, hasMore]);

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1,
  //       delayChildren: 0.2,
  //     },
  //   },
  // };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Optimization */}
      <SEO
        title="Furniture Categories - Browse by Style & Room"
        description="Explore our furniture categories - Living Room, Bedroom, Dining, Office, Kitchen, and more. Find the perfect furniture organized by room and style for easy shopping."
        keywords={[
          'furniture categories',
          'living room furniture',
          'bedroom furniture',
          'dining furniture',
          'office furniture',
          'furniture by room',
          'furniture styles',
        ]}
      />

      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60"
      >
        {/* Static decorative backdrop — same look, no per-frame animation cost. */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <div className="absolute -top-56 -right-56 w-96 h-96 bg-gradient-to-b from-amber-300/40 via-amber-200/30 to-transparent rounded-full opacity-50 blur-3xl" />
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-transparent rounded-full opacity-45 blur-3xl" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(217,119,6,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,119,6,0.2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(217,119,6,0.15) 0%, transparent 50%)",
            }}
          />
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40" />
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with Premium Design */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12 lg:mb-16 text-center space-y-3 sm:space-y-4"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-full backdrop-blur-sm text-xs sm:text-sm"
            >
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" />
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
                Explore
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
            >
              All{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Categories
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto px-2 sm:px-0"
            >
              Discover our complete range of curated furniture collections
              tailored to transform every room in your home
            </motion.p>

            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              viewport={{ once: true }}
              className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full origin-left mx-auto mt-4"
            />
          </motion.div>
          {loading ? (
            // Skeleton grid — appears instantly, no animation delay
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-6 lg:px-8 w-full">
              {Array.from({ length: INITIAL_LOAD }).map((_, i) => (
                <div
                  key={i}
                  className="h-full bg-white rounded-3xl overflow-hidden shadow-md border border-amber-100/50 flex flex-col"
                >
                  <div className="w-full h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-amber-100/40 to-orange-100/40 animate-pulse" />
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-10 w-full bg-amber-50 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-6 lg:px-8 w-full">
                {displayedCategories.length > 0 ? (
                  displayedCategories.map((category) => {
                    const id = categoryKey(category);
                    const isHover = hoveredId === id;
                    return (
                    <div
                      key={id}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() =>
                        navigate(
                          `/products?category=${encodeURIComponent(category.name)}`
                        )
                      }
                      className="group h-full bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col border border-amber-100/50 hover:-translate-y-2"
                    >
                      {/* Image */}
                      <div className="relative w-full h-40 sm:h-48 lg:h-56 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                        {category.image ? (
                          <OptimizedImage
                            src={category.image}
                            alt={category.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              isHover ? "scale-110" : "scale-100"
                            }`}
                          />
                        ) : (
                          <div className="text-5xl sm:text-6xl">🛋️</div>
                        )}

                        {/* Hover overlay — single CSS transition, no framer-motion */}
                        {category.image && (
                          <div
                            className={`absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 ${
                              isHover ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                          >
                            <div className="text-center px-2">
                              <p className="text-white text-sm sm:text-lg font-bold">
                                Explore →
                              </p>
                              <p className="text-amber-300 text-xs sm:text-sm font-semibold mt-1">
                                Browse collection
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="px-3 sm:px-6 py-4 sm:py-5 flex-1 flex flex-col bg-white">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        <div className="inline-flex items-center gap-2 mt-auto w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-lg border border-amber-200/50 transition-all hover:shadow-md flex-wrap">
                          <span className="text-amber-600 font-bold text-sm sm:text-base tabular-nums">
                            {category.productCount || 0}
                          </span>
                          <span className="text-gray-700 text-xs sm:text-sm font-medium">
                            Products
                          </span>
                          <svg
                            className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600 ml-auto flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    );
                  })
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full"
                >
                  <div className="text-center py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-amber-50/50 rounded-2xl mx-2 sm:mx-0">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4"
                    >
                      📦
                    </motion.div>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-500 font-medium px-2 sm:px-0">
                      No categories available
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2 px-2 sm:px-0">
                      Check back soon for our amazing collection
                    </p>
                  </div>
                </motion.div>
              )}
              </div>
              
              {/* Infinite Scroll Loader */}
              {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8">
                  {(loadingMore || prefetching) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-amber-600"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader className="w-6 h-6" />
                      </motion.div>
                      <span className="text-sm font-medium">
                        {loadingMore ? "Loading more..." : "Preparing more..."}
                      </span>
                    </motion.div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      {displayedCategories.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-stone-50 py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Static decorative orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-200/40 to-orange-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-widest">
                  Explore More
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight"
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                Furniture
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 px-2 sm:px-0 max-w-2xl mx-auto font-medium"
            >
              Browse through our categories and discover pieces that match your
              style
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl overflow-hidden transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                <span className="relative flex items-center gap-2 justify-center">
                  <span>Start Shopping</span>
                  <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-6 sm:px-10 py-3 sm:py-4 border-2 border-amber-600 text-amber-600 font-bold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-amber-600/10 hover:scale-105 active:scale-95 transition-all"
              >
                Browse Products
              </button>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
