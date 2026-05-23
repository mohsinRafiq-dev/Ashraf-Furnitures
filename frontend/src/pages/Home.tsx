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

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Interior Designer",
    content:
      "The quality of furniture from Ashraf Furnitures is exceptional. Every piece I've purchased has been delivered on time and in perfect condition. Highly recommend!",
    rating: 5,
    image: avatar("SJ", "%23d97706"),
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Home Owner",
    content:
      "Amazing selection and great prices. The customer service team helped me find the perfect sofa for my living room. Will definitely shop here again!",
    rating: 5,
    image: avatar("MC", "%23ea580c"),
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Architect",
    content:
      "Best furniture store I've worked with. Their product range is diverse and the quality is consistently high. My clients love their purchases!",
    rating: 5,
    image: avatar("ED", "%23b45309"),
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Business Owner",
    content:
      "Furnishing our office was seamless. Fast delivery, excellent build quality, and their team was very professional. Great investment!",
    rating: 5,
    image: avatar("JW", "%23c2410c"),
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { splashComplete } = useSplash();
  const shouldReduceMotion = useReducedMotion();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { data: categoriesResponse, isLoading: loadingCategories } =
    useCategoriesQuery({ sort: "name-asc", limit: 50 });
  const { data: productsResponse, isLoading: loadingProducts } =
    useFeaturedProductsQuery(8);

  const categories = useMemo(() => {
    const list = categoriesResponse?.categories ?? [];
    return list.map((cat) => ({
      id: cat.id,
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
        id: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage?.url || "",
        rating: product.rating || 4.5,
        reviewCount: product.reviews || 0,
        inStock: product.stock > 0,
        images: primaryImage ? [primaryImage] : [],
      };
    });
  }, [productsResponse]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-hidden">
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
      <section className="relative py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { Icon: Award, title: "Handcrafted Quality", desc: "Built to last — premium craftsmanship" },
              { Icon: Wrench, title: "Made-to-Order", desc: "Custom sizes & finishes available" },
              { Icon: ShieldCheck, title: "Warranty & Support", desc: "Limited warranty & aftercare" },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4 p-4 sm:p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-200/30 hover:border-amber-400/50 hover:-translate-y-1 transition-all"
              >
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <motion.section
        variants={shouldReduceMotion ? staticVariants : containerVariants}
        initial="hidden"
        animate={splashComplete ? "visible" : "hidden"}
        className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
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
      <section className="relative py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
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
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their
              spaces with our furniture
            </p>
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
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {testimonials[currentTestimonial].name}
                  </p>
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
      <section className="relative py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
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
