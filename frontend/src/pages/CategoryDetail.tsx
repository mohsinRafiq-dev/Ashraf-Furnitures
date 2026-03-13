import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { getCategoryBySlug } from "../services/firebase/categoryService";

export default function CategoryDetail() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const redirectToProducts = async () => {
      try {
        if (!categorySlug) {
          navigate("/categories", { replace: true });
          return;
        }

        const selectedCategory = await getCategoryBySlug(categorySlug);

        if (cancelled) {
          return;
        }

        if (!selectedCategory) {
          navigate("/categories", { replace: true });
          return;
        }

        navigate(
          `/products?category=${encodeURIComponent(selectedCategory.name)}`,
          { replace: true }
        );
      } catch (error) {
        console.error("Error redirecting category route:", error);
        if (!cancelled) {
          navigate("/categories", { replace: true });
        }
      }
    };

    redirectToProducts();

    return () => {
      cancelled = true;
    };
  }, [categorySlug, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-12 h-12 text-amber-600" />
      </motion.div>
    </div>
  );
}
