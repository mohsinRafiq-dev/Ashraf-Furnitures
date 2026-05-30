/**
 * Testimonials Service
 *
 * Reads from the `testimonials` Firestore collection so the home-page
 * carousel reflects real customer quotes instead of the previous mocks.
 * Cached in localStorage for instant repeat-paint.
 */

import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { persistentCache, CacheTTL } from "../../utils/cache";

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: number; // 1-5
  /** Optional avatar URL; falls back to an inline SVG initial. */
  avatarUrl?: string;
  /** Lower numbers surface first; defaults to insertion order. */
  order?: number;
  createdAt?: Timestamp | Date;
}

const CACHE_KEY = "testimonials:all";

/**
 * Synchronous read from the persistent cache — use for instant paint on
 * the Home page; pair with a background refresh via getTestimonials().
 */
export const getCachedTestimonials = (): Testimonial[] | undefined => {
  return persistentCache.get<Testimonial[]>(CACHE_KEY);
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Testimonial, "id">),
    }));
    persistentCache.set(CACHE_KEY, list, CacheTTL.LONG);
    return list;
  } catch (err) {
    console.warn("Failed to fetch testimonials:", err);
    return [];
  }
};
