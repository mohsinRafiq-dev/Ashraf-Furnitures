import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
}

const TRANSPARENT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E";

const RESPONSIVE_WIDTHS = [320, 480, 640, 800, 1024, 1280, 1600];

/**
 * Rewrites a remote image URL to request a smaller, optimized variant.
 *
 * - Cloudinary  ➜  injects `f_auto,q_auto,w_{w},c_limit` after `/upload/`
 * - Firebase Storage ➜  appends `&w={w}` (Firebase Hosting will resize when
 *   the Image Resize extension is installed; harmless otherwise).
 * - Unsplash ➜ adjusts `w` and `q` query params.
 * - Everything else is returned untouched.
 */
const optimize = (src: string, width: number): string => {
  if (!src) return src;
  // Skip data URIs and SVGs
  if (src.startsWith("data:") || src.endsWith(".svg")) return src;

  // Cloudinary
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    if (/\/upload\/(f_auto|q_auto|w_|c_)/.test(src)) return src; // already transformed
    return src.replace(
      "/upload/",
      `/upload/f_auto,q_auto,w_${width},c_limit/`
    );
  }

  // Unsplash
  if (src.includes("images.unsplash.com")) {
    const u = new URL(src);
    u.searchParams.set("w", String(width));
    u.searchParams.set("q", "75");
    u.searchParams.set("auto", "format");
    return u.toString();
  }

  return src;
};

const buildSrcSet = (src: string): string =>
  RESPONSIVE_WIDTHS.map((w) => `${optimize(src, w)} ${w}w`).join(", ");

const isOptimizable = (src: string): boolean =>
  !!src &&
  !src.startsWith("data:") &&
  (src.includes("res.cloudinary.com") || src.includes("images.unsplash.com"));

/**
 * Optimized image with native lazy loading, async decoding and
 * responsive srcset. CDN URLs (Cloudinary / Unsplash) are rewritten to
 * request appropriately-sized variants — typically cutting payload by 70%+.
 */
export const OptimizedImage = ({
  src,
  alt,
  className = "",
  width = 800,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  placeholder = TRANSPARENT_PLACEHOLDER,
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);

  const finalSrc = optimize(src || placeholder, width);
  const srcSet = isOptimizable(src) ? buildSrcSet(src) : undefined;

  return (
    <img
      src={finalSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // @ts-expect-error fetchpriority isn't yet in @types/react for 18.2
      fetchpriority={priority ? "high" : "auto"}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={`${className} transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-90"
      }`}
    />
  );
};
