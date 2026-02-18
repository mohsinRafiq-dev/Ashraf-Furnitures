import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-blue-50/20" />

      {/* Animated geometric shapes */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-20 left-20 w-72 h-72 rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(31, 46, 97, 0.08) 0%, rgba(31, 46, 97, 0.04) 100%)",
          filter: "blur(70px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo with modern animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            duration: 0.8,
          }}
          className="relative mb-8"
        >
          {/* Glow effect behind logo */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo */}
          <motion.div
            className="relative"
            animate={{
              filter: [
                "drop-shadow(0 10px 30px rgba(251, 191, 36, 0.3))",
                "drop-shadow(0 15px 50px rgba(251, 191, 36, 0.5))",
                "drop-shadow(0 10px 30px rgba(251, 191, 36, 0.3))",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/Mini.png"
              alt="Ashraf Furnitures Logo"
              className="w-40 h-40 object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Brand name with staggered animation */}
        <motion.div
          className="text-center space-y-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* ASHRAF in amber */}
          <motion.h1
            className="text-5xl md:text-6xl font-black tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              ASHRAF
            </span>
          </motion.h1>

          {/* FURNITURES in blue */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-wide"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <span style={{ color: '#1f2e61' }}>
              FURNITURES
            </span>
          </motion.h2>

          {/* Elegant divider */}
          <motion.div
            className="flex items-center justify-center gap-3 pt-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, rgba(31, 46, 97, 0.6), transparent)' }}></div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-gray-600 text-sm md:text-base font-medium tracking-widest uppercase pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            Premium Quality Living
          </motion.p>
        </motion.div>

        {/* Modern progress bar */}
        <motion.div
          className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 192 }}
          transition={{ delay: 1.3, duration: 0.4 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(to right, #f59e0b, #f97316, #1f2e61)'
            }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      </div>

      {/* Minimal floating indicator */}
      <motion.div
        className="absolute bottom-12 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                i === 0
                  ? "linear-gradient(135deg, #f59e0b, #f97316)"
                  : i === 1
                  ? "linear-gradient(135deg, #f97316, #1f2e61)"
                  : "linear-gradient(135deg, #1f2e61, rgba(31, 46, 97, 0.7))",
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
