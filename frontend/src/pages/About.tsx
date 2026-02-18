import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Award,
  Users,
  Sparkles,
  TrendingUp,
  Calendar,
  Star,
  Building2,
  Handshake,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  Navigation,
} from "lucide-react";

const About: React.FC = () => {
  const stats = [
    { label: "Years of Excellence", value: "42+", icon: Calendar },
    { label: "Happy Customers", value: "50,000+", icon: Heart },
    { label: "Premium Products", value: "800+", icon: Award },
    { label: "Expert Craftsmen", value: "25+", icon: Users },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Trust & Quality",
      description:
        "Four decades of unwavering commitment to craftsmanship excellence.",
    },
    {
      icon: Heart,
      title: "Family Values",
      description:
        "Treating every customer as family, just as we've done since 1982.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description:
        "Blending traditional craftsmanship with modern design sensibilities.",
    },
    {
      icon: Handshake,
      title: "Customer First",
      description:
        "Your satisfaction is our legacy, spanning two generations of service.",
    },
  ];

  const milestones = [
    {
      year: "1982",
      title: "The Beginning",
      description: "Haji Muhammad Ashraf laid the foundation with a vision of quality craftsmanship",
    },
    {
      year: "1995",
      title: "Expansion Era",
      description: "Growing our reach and establishing lasting customer relationships",
    },
    {
      year: "2005",
      title: "Next Generation",
      description: "Muhammad Rafiq took the reins, bringing fresh innovation to our heritage",
    },
    {
      year: "2024",
      title: "Digital Transformation",
      description: "Embracing e-commerce while maintaining our personal touch",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-20 sm:py-28 lg:py-32 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-orange-400 to-amber-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6"
            >
              <Star className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-gray-800">
                Since 1982 - Four Decades of Excellence
              </span>
              <Star className="w-5 h-5 text-amber-600" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              A Legacy of
              <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Craftsmanship & Trust
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
              For over <strong>42 years</strong>, Ashraf Furnitures has been the cornerstone of quality home furnishings.
              From a humble beginning by our founder to becoming a household name,
              our journey is built on trust, dedication, and the love of thousands of satisfied families.
            </p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 hover:border-amber-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 mx-auto mb-3 relative z-10" />
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 relative z-10">
                      {stat.value}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 font-medium relative z-10">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Journey Through Time
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
              From a single workshop to a celebrated furniture destination
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-400" />

            <div className="space-y-12 lg:space-y-16">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`flex flex-col lg:flex-row items-center gap-6 ${
                    idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-200 hover:border-amber-400 transition-all"
                    >
                      <div className="inline-block px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-sm font-bold mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Abu's Section - The Founder */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 lg:py-24 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative">
                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-2xl opacity-30"
                />
                
                <div className="relative bg-white rounded-3xl p-4 shadow-2xl border-4 border-amber-200">
                  <img
                    src="/Abu.png"
                    alt="Haji Muhammad Ashraf - Our Founder"
                    className="w-full h-[400px] sm:h-[500px] object-contain rounded-2xl"
                  />
                  
                  {/* Decorative Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 rounded-full shadow-xl"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">1982</div>
                      <div className="text-xs">Founded</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
                <Building2 className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-semibold text-amber-900">
                  THE FOUNDER
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Haji Muhammad Ashraf
                <span className="block text-amber-600">The Visionary Who Started It All</span>
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                <p>
                  In <strong>1982</strong>, with nothing but a dream and unwavering determination, our beloved grandfather{" "}
                  <strong>Haji Muhammad Ashraf</strong> established Ashraf Furnitures in a modest workshop. Armed with traditional craftsmanship
                  skills passed down through generations, he began creating furniture pieces that would soon become
                  cherished possessions in countless homes.
                </p>

                <p>
                  Haji Sahib's philosophy was simple yet profound: <em>"Every piece of furniture should tell a story and last a lifetime."</em>{" "}
                  He personally oversaw every creation, ensuring that quality was never compromised. His attention to detail
                  and commitment to customer satisfaction quickly earned him a reputation that spread far and wide.
                </p>

                <p>
                  Through decades of dedication, Haji Muhammad Ashraf transformed a small local business into a trusted name. He didn't just
                  sell furniture; he built lasting relationships with families, understanding their needs, and crafting pieces
                  that became part of their life stories. His legacy of excellence, integrity, and genuine care for customers
                  laid the foundation for everything we stand for today.
                </p>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-600 p-6 rounded-r-xl mt-8">
                  <p className="text-gray-800 italic text-lg font-medium">
                    "Haji Muhammad Ashraf didn't just build furniture; he built dreams, one family at a time. His legacy lives on in
                    every piece we create and every smile we bring to our customers."
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border-2 border-amber-200">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-gray-800">Master Craftsman</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border-2 border-amber-200">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-gray-800">Customer First</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border-2 border-amber-200">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-800">Quality Pioneer</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Papa's Section - The Innovator */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Side */}
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
                <TrendingUp className="w-5 h-5 text-orange-700" />
                <span className="text-sm font-semibold text-orange-900">
                  THE INNOVATOR
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Muhammad Rafiq
                <span className="block text-orange-600">Carrying Forward The Legacy of Excellence</span>
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                <p>
                  Following in his father's footsteps with immense pride and responsibility, <strong>Muhammad Rafiq</strong> took
                  the reins of Ashraf Furnitures and elevated it to unprecedented heights. While deeply honoring Haji Muhammad Ashraf's
                  principles of quality and trust, he brought fresh innovation and modern business practices to the family legacy.
                </p>

                <p>
                  Muhammad Rafiq recognized the changing times and customer preferences. He expanded our product range, introduced
                  contemporary designs alongside traditional craftsmanship, and embraced technology to reach more families.
                  Under his leadership, we opened multiple showrooms, trained dozens of skilled craftsmen, and built
                  partnerships with premium suppliers across the region.
                </p>

                <p>
                  What sets Muhammad Rafiq apart is his unique ability to blend tradition with innovation. He implemented modern
                  quality control systems while maintaining the personal touch that his father established. Every customer still
                  receives the same warmth and attention, whether they walk into our showroom or order online. His vision
                  transformed us from a local workshop into a regional furniture destination while keeping our family values intact.
                </p>

                <p>
                  Today, Muhammad Rafiq continues to lead with the same passion and dedication, ensuring that every piece of furniture
                  that leaves our facility carries the Ashraf signature of excellence. He has successfully passed down not
                  just a business, but a tradition of trust that spans over four decades and <strong>50,000+ happy families</strong>.
                </p>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-600 p-6 rounded-r-xl mt-8">
                  <p className="text-gray-800 italic text-lg font-medium">
                    "Our success isn't measured in sales, but in the smiles of families who trust us to furnish their homes
                    and create memories. This is my father's legacy, and I'm honored to carry it forward."
                  </p>
                  <p className="text-gray-600 mt-2 font-semibold">- Muhammad Rafiq</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border-2 border-orange-200">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-800">Business Growth</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border-2 border-orange-200">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-gray-800">Modern Innovation</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border-2 border-orange-200">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-gray-800">Family Values</span>
                </div>
              </div>
            </motion.div>

            {/* Image Side */}
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="relative">
                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, -5, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl blur-2xl opacity-30"
                />
                
                <div className="relative bg-white rounded-3xl p-4 shadow-2xl border-4 border-orange-200">
                  <img
                    src="/Papa.JPG"
                    alt="Muhammad Rafiq - Continuing the Legacy"
                    className="w-full h-[400px] sm:h-[500px] object-contain rounded-2xl"
                  />
                  
                  {/* Decorative Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: 45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute -top-4 -left-4 bg-gradient-to-br from-orange-500 to-amber-600 text-white p-4 rounded-full shadow-xl"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">2005</div>
                      <div className="text-xs">Leadership</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 sm:py-20 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
              The principles that have guided us for over four decades
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 hover:border-amber-300 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Customer Love Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border-4 border-amber-200"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-6"
              >
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 fill-red-500" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                The Heart of Our Success:
                <span className="block text-amber-600">Our Beloved Customers</span>
              </h2>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
                Over <strong>50,000 families</strong> have trusted us to furnish their homes and create spaces filled with
                warmth, comfort, and memories. From young couples furnishing their first home to grandparents passing down
                our furniture to the next generation, we've been honored to be part of countless life stories.
              </p>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
                Every positive review, every smile, every family that returns to us after years – these are the true
                measures of our success. Haji Muhammad Ashraf's dream was to build trust that lasts generations, and today, we're proud
                to serve the children and grandchildren of our earliest customers.
              </p>

              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-lg font-bold shadow-lg">
                <Star className="w-6 h-6 fill-white" />
                <span>Thank You for 42 Years of Trust</span>
                <Star className="w-6 h-6 fill-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Visit Our Showroom Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-white" />
        <div className="absolute inset-0 bg-grid-amber-100/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full mb-6 shadow-lg"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wide">
                VISIT US TODAY
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Find Us in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Gojra</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience 42 years of furniture craftsmanship. Visit our showroom and let our experts guide you.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Map - Takes 2 columns on large screens */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 relative group"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[600px] border border-amber-200/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.0234!2d72.6843131!3d31.1578298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392301ef4c5e4363:0x1e03b4a6a09684b8!2sHaji%20Ashraf's%20Furniture%20Mart!5e0!3m2!1sen!2s!4v1708272000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Haji Ashraf's Furniture Mart - Gojra"
                  className="border-0 brightness-95 group-hover:brightness-100 transition-all duration-500"
                />
                
                {/* Floating Location Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                  className="absolute top-6 left-6 bg-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">We're Open</p>
                      <p className="text-sm font-bold text-gray-900">Haji Ashraf's Furniture Mart</p>
                    </div>
                  </div>
                </motion.div>

                {/* Get Directions Floating Button */}
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.google.com/maps/place/Haji+Ashraf's+Furniture+Mart/@31.1578298,72.6843131,17z/data=!3m1!4b1!4m6!3m5!1s0x392301ef4c5e4363:0x1e03b4a6a09684b8!8m2!3d31.1578298!4d72.686888!16s%2Fg%2F11v9vr_r60"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-amber-500/50 transition-all"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Get Directions</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Contact Info Cards - 1 column */}
            <div className="space-y-6">
              {/* Location Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-amber-100 hover:shadow-2xl hover:border-amber-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-6 transition-transform">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Our Location</h3>
                    <p className="text-lg font-bold text-gray-900 mb-1">Ashraf Furnitures</p>
                    <p className="text-gray-700 leading-relaxed">
                      Painsra Road, Near Shell Petrol Pump<br />
                      <span className="font-semibold text-amber-600">Gojra, Pakistan</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg -rotate-3 hover:-rotate-6 transition-transform">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-100 uppercase tracking-wider mb-2">Contact Us</h3>
                    <a
                      href="tel:+923006554776"
                      className="text-2xl font-bold text-white hover:text-green-100 transition block mb-2"
                    >
                      +92 300 6554776
                    </a>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://wa.me/923457571471"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all text-sm shadow-lg"
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp Us
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-amber-100 hover:shadow-2xl hover:border-amber-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-6 transition-transform">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Opening Hours</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Mon - Thu</span>
                        <span className="text-gray-900 font-bold">8:00 AM - 9:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg border border-red-200">
                        <span className="text-red-700 font-medium">Friday</span>
                        <span className="text-red-600 font-bold">Closed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Sat - Sun</span>
                        <span className="text-gray-900 font-bold">8:00 AM - 9:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white relative overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:50px_50px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Become Part of Our Story?
            </h2>
            <p className="text-xl sm:text-2xl mb-10 text-amber-50">
              Experience the quality and service that has defined us for over four decades.
              Let us help you create a home you'll love for years to come.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/categories"
                className="inline-block px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:shadow-2xl transition-all text-lg"
              >
                Explore Our Collection
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/923457571471"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all text-lg"
              >
                Contact Us on WhatsApp
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
