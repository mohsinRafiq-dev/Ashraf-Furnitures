import { useCallback } from "react";

/**
 * Lazy-loaded routes are downloaded only when navigated to. Calling these
 * helpers on hover/focus warms the cache so the destination chunk is ready
 * the moment the user clicks.
 *
 * The dynamic-import path must exactly match the one in App.tsx so the
 * bundler dedupes it into the same chunk.
 */

const prefetchers: Record<string, () => Promise<unknown>> = {
  products: () => import("../pages/Products"),
  categories: () => import("../pages/Categories"),
  productDetail: () => import("../pages/ProductDetail"),
  about: () => import("../pages/About"),
  search: () => import("../pages/Search"),
};

const triggered = new Set<string>();

const prefetchRoute = (key: keyof typeof prefetchers) => {
  if (triggered.has(key)) return;
  triggered.add(key);
  prefetchers[key]().catch(() => {
    // Allow retry if the prefetch failed (e.g. network blip).
    triggered.delete(key);
  });
};

/**
 * Returns hover/focus handlers that prefetch the JS chunk for a destination.
 * Pair with onMouseEnter / onFocus on links and cards.
 */
export const useRoutePrefetch = (key: keyof typeof prefetchers) => {
  const trigger = useCallback(() => prefetchRoute(key), [key]);
  return {
    onMouseEnter: trigger,
    onFocus: trigger,
    onTouchStart: trigger,
  };
};

export { prefetchRoute };
