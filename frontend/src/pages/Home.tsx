import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CategoryList from "../components/CategoryList";
import ProductGrid from "../components/ProductGrid";
import SEO from "../components/SEO";
import { StructuredData, generateOrganizationSchema, generateWebsiteSchema } from "../utils/structuredData";
import {
  ArrowRight,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { useCategoriesQuery, useFeaturedProductsQuery } from "../services/firebase/queries";
import {
  getTestimonials,
  getCachedTestimonials,
  type Testimonial,
} from "../services/firebase/testimonialService";
import {
  getGoogleReviews,
  getCachedGoogleReviews,
  type GoogleReview,
  type GoogleReviewsResult,
} from "../services/googleReviewsService";
import { useSplash } from "../context/SplashContext";
import { useReducedMotion } from "../hooks/useReducedMotion";

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staticVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Inline SVG avatars — no external image fetches, no CLS, no Unsplash cost.
const avatar = (initials: string, bg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='32' fill='${bg}'/><text x='50%' y='54%' font-family='system-ui,sans-serif' font-size='24' font-weight='700' fill='white' text-anchor='middle' dominant-baseline='middle'>${initials}</text></svg>`
  )}`;

// Used only when the testimonials Firestore collection is empty (e.g. fresh
// install). Once the admin adds real customer quotes, they take over.
const FALLBACK_TESTIMONIALS: Array<Testimonial & { image: string }> = [
  {
    id: "fallback-1",
    name: "Verified Customer",
    role: "Karachi",
    content:
      "Beautiful craftsmanship — the finish and build quality exceeded my expectations.",
    rating: 5,
    image: avatar("AF", "%23d97706"),
  },
  {
    id: "fallback-2",
    name: "Verified Customer",
    role: "Lahore",
    content:
      "Custom dining set delivered exactly to my measurements. Highly recommend.",
    rating: 5,
    image: avatar("AF", "%23ea580c"),
  },
  {
    id: "fallback-3",
    name: "Verified Customer",
    role: "Islamabad",
    content:
      "Friendly team on WhatsApp and the sofa arrived ahead of schedule.",
    rating: 5,
    image: avatar("AF", "%23b45309"),
  },
];

const initialsFor = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AF";

const PALETTE = ["%23d97706", "%23ea580c", "%23b45309", "%23c2410c"];

interface DisplayTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  /** Set for Google reviews only — links the author back to their review. */
  reviewUrl?: string;
}

const toDisplayTestimonial = (t: Testimonial, idx: number): DisplayTestimonial => ({
  id: t.id ?? `t-${idx}`,
  name: t.name,
  role: t.role,
  content: t.content,
  rating: Math.max(1, Math.min(5, Math.round(t.rating ?? 5))),
  image: t.avatarUrl || avatar(initialsFor(t.name), PALETTE[idx % PALETTE.length]),
});

/** Google reviews carry their own avatar and a required link back to Google. */
const fromGoogleReview = (r: GoogleReview, idx: number): DisplayTestimonial => ({
  id: r.id,
  name: r.name,
  role: r.relativeTime,
  content: r.content,
  rating: Math.max(1, Math.min(5, Math.round(r.rating || 5))),
  image: r.avatarUrl || avatar(initialsFor(r.name), PALETTE[idx % PALETTE.length]),
  reviewUrl: r.reviewUrl,
});

export default function Home() {
  const navigate = useNavigate();
  const { splashComplete } = useSplash();
  const shouldReduceMotion = useReducedMotion();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonials: hydrate from cache for instant paint, refresh from Firestore
  // in the background. Falls back to FALLBACK_TESTIMONIALS when the
  // collection is empty.
  const [remoteTestimonials, setRemoteTestimonials] = useState<Testimonial[]>(
    () => getCachedTestimonials() ?? []
  );

  // Live Google reviews are the preferred source; hydrate from cache first so a
  // repeat visit paints real quotes without waiting on the SDK.
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewsResult>(
    () => getCachedGoogleReviews() ?? { reviews: [] }
  );

  useEffect(() => {
    let cancelled = false;
    getTestimonials().then((list) => {
      if (!cancelled) setRemoteTestimonials(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Deferred until the splash clears so loading the Maps SDK never competes
  // with the initial paint.
  useEffect(() => {
    if (!splashComplete) return;
    let cancelled = false;
    getGoogleReviews().then((result) => {
      if (!cancelled && result.reviews.length > 0) setGoogleReviews(result);
    });
    return () => {
      cancelled = true;
    };
  }, [splashComplete]);

  // Priority: live Google reviews > curated Firestore quotes > placeholders.
  const testimonials = useMemo<DisplayTestimonial[]>(() => {
    if (googleReviews.reviews.length > 0) {
      return googleReviews.reviews.map(fromGoogleReview);
    }
    const source =
      remoteTestimonials.length > 0 ? remoteTestimonials : FALLBACK_TESTIMONIALS;
    return source.map((t, i) => toDisplayTestimonial(t as Testimonial, i));
  }, [googleReviews, remoteTestimonials]);

  const { data: categoriesResponse, isLoading: loadingCategories } =
    useCategoriesQuery({ sort: "name-asc", limit: 50 });
  const { data: productsResponse, isLoading: loadingProducts } =
    useFeaturedProductsQuery(8);

  const categories = useMemo(() => {
    const list = categoriesResponse?.categories ?? [];
    return list.map((cat) => ({
      id: cat.id ?? cat.slug,
      name: cat.name,
      icon: "🛋️",
      thumbnail: cat.image,
      slug: cat.slug,
    }));
  }, [categoriesResponse]);

  const products = useMemo(() => {
    const list = productsResponse?.products ?? [];
    return list.map((product) => {
      const primaryImage =
        product.images?.find((img) => img.isPrimary) || product.images?.[0];
      return {
        id: product.id ?? product.slug,
        name: product.name,
        price: product.price,
        hidePrice: product.hidePrice,
        image: primaryImage?.url || "",
        rating: product.rating || 4.5,
        reviewCount: product.reviews || 0,
        inStock: product.stock > 0,
        images: primaryImage ? [primaryImage] : [],
      };
    });
  }, [productsResponse]);

  // Auto-rotate testimonials. Dependency on length so the timer adapts when
  // the Firestore fetch swaps the source array in.
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Guard against `currentTestimonial` pointing past the end when the source
  // array shrinks (fallback → real, real with fewer entries, etc.).
  useEffect(() => {
    if (currentTestimonial >= testimonials.length) {
      setCurrentTestimonial(0);
    }
  }, [currentTestimonial, testimonials.length]);

  return (
    <div className="min-h-screen bg-stone-50 overflow-hidden">
      <SEO
        title="Premium Furniture Collection"
        description="Explore our curated furniture selection for quality and style. Transform your space with premium sofas, dining tables, bedroom sets, office furniture, and more from Ashraf Furnitures."
        keywords={[
          "premium furniture",
          "home furniture",
          "modern furniture",
          "office furniture",
          "bedroom furniture",
          "living room furniture",
          "dining furniture",
          "quality craftsmanship",
        ]}
        type="website"
      />
      <StructuredData data={[generateOrganizationSchema(), generateWebsiteSchema()]} />

      <HeroSection animationsReady={splashComplete} />

      <CategoryList
        categories={categories}
        isLoading={loadingCategories}
        animationsReady={splashComplete}
      />

      {/* Trust Section */}
      <section className="relative py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                Icon: Award,
                title: "Handcrafted Quality",
                desc: "Built to last — premium craftsmanship",
                href: "/about",
              },
              {
                Icon: Wrench,
                title: "Made-to-Order",
                desc: "Custom sizes & finishes — get a quote",
                href: "/custom-order",
                accent: true,
              },
              {
                Icon: ShieldCheck,
                title: "Warranty & Support",
                desc: "Limited warranty & aftercare",
                href: "/about",
              },
            ].map(({ Icon, title, desc, href, accent }) => (
              <a
                key={title}
                href={href}
                className={`flex items-center gap-4 p-4 sm:p-6 rounded-xl backdrop-blur-sm border transition-all hover:-translate-y-1 ${
                  accent
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-lg hover:shadow-xl"
                    : "bg-white/60 border-amber-200/30 hover:border-amber-400/50"
                }`}
              >
                <div
                  className={`flex-shrink-0 p-3 rounded-lg ${
                    accent
                      ? "bg-white/20"
                      : "bg-gradient-to-br from-amber-100 to-orange-100"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${accent ? "text-white" : "text-amber-600"}`} />
                </div>
                <div>
                  <h3
                    className={`font-semibold text-sm sm:text-base ${
                      accent ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${
                      accent ? "text-amber-50" : "text-gray-600"
                    }`}
                  >
                    {desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <motion.section
        variants={shouldReduceMotion ? staticVariants : containerVariants}
        initial="hidden"
        animate={splashComplete ? "visible" : "hidden"}
        className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-stone-50"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={shouldReduceMotion ? staticVariants : sectionHeaderVariants}
            className="mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500" />
              <span className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-widest">
                Curated Selection
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Featured Collection
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl">
                Discover handpicked furniture and decor pieces selected by our
                design experts to elevate your living space.
              </p>
            </div>

            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mt-4 sm:mt-6" />
          </motion.div>

          <div>
            {loadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500 text-sm sm:text-base">Loading products...</div>
              </div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} columns={4} gap="lg" />
            ) : (
              <div className="text-center text-gray-500 py-12 text-sm sm:text-base">
                No products available
              </div>
            )}
          </div>

          <div className="mt-8 sm:mt-12 lg:mt-16 flex items-center justify-center">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="group relative px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:shadow-2xl transition-all"
            >
              <span className="relative flex items-center gap-2">
                <span>View All Products</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            variants={shouldReduceMotion ? staticVariants : sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <Star className="w-5 sm:w-6 h-5 sm:h-6 text-amber-500" />
              <span className="text-xs sm:text-sm font-semibold text-amber-600 uppercase tracking-widest">
                Customer Love
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              What Our Customers Say
            </h2>
            {googleReviews.reviews.length > 0 ? (
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                {googleReviews.rating != null && (
                  <>
                    Rated{" "}
                    <span className="font-semibold text-gray-900">
                      {googleReviews.rating.toFixed(1)}
                    </span>{" "}
                    out of 5
                    {googleReviews.totalReviews != null &&
                      ` from ${googleReviews.totalReviews.toLocaleString()} reviews`}{" "}
                  </>
                )}
                on Google
                {googleReviews.placeUrl && (
                  <>
                    {" — "}
                    <a
                      href={googleReviews.placeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-700 hover:underline"
                    >
                      read them all
                    </a>
                  </>
                )}
              </p>
            ) : (
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have transformed their
                spaces with our furniture
              </p>
            )}
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
              className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-amber-200/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-gray-800 font-medium mb-6 sm:mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  width={64}
                  height={64}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-300"
                  loading="lazy"
                  decoding="async"
                  // Google profile photos 403 when a Referer is sent, and the
                  // browser then blocks the non-image response via ORB.
                  referrerPolicy="no-referrer"
                />
                <div>
                  {testimonials[currentTestimonial].reviewUrl ? (
                    <a
                      href={testimonials[currentTestimonial].reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-900 text-sm sm:text-base hover:text-amber-700 hover:underline"
                    >
                      {testimonials[currentTestimonial].name}
                    </a>
                  ) : (
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {testimonials[currentTestimonial].name}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-between mt-6 sm:mt-8">
              <button
                type="button"
                onClick={() =>
                  setCurrentTestimonial(
                    currentTestimonial === 0
                      ? testimonials.length - 1
                      : currentTestimonial - 1
                  )
                }
                aria-label="Previous testimonial"
                className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 hover:shadow-lg hover:scale-110 transition-all"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                      currentTestimonial === index
                        ? "bg-amber-600 scale-125"
                        : "bg-amber-300 hover:bg-amber-400"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentTestimonial(
                    currentTestimonial === testimonials.length - 1
                      ? 0
                      : currentTestimonial + 1
                  )
                }
                aria-label="Next testimonial"
                className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 hover:shadow-lg hover:scale-110 transition-all"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 overflow-hidden bg-stone-50">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              Stay Updated with New Arrivals
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
              Subscribe to our newsletter and get exclusive offers, design tips,
              and early access to new collections.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 sm:gap-3 max-w-2xl mx-auto mt-8 sm:mt-10"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-lg"
              />
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white rounded-lg whitespace-nowrap shadow-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
