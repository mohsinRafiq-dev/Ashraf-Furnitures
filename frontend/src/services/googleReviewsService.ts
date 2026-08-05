/**
 * Google Reviews Service
 *
 * Fetches live reviews for the storefront's Google Business Profile through the
 * Places API (New), loaded on demand via the Maps JavaScript SDK.
 *
 * Two limits worth knowing before changing anything here:
 *
 * 1. Google returns at most 5 reviews per place and offers no pagination, so
 *    the carousel can never show more than 5 live quotes. `placeUrl` links out
 *    to the full list on Google.
 * 2. Every `fetchFields` call is billable (Place Details, Enterprise SKU), so
 *    results are cached in localStorage for a week. Google's terms permit
 *    caching Places content for up to 30 days, which this stays well inside.
 *
 * Attribution is not optional: Google requires the author's name, photo and a
 * link back to the review wherever review content is displayed. `GoogleReview`
 * carries all three; don't render the text without them.
 */

import { persistentCache } from "../utils/cache";

/* -------------------------------------------------------------------------- */
/* Minimal Maps JS typings                                                    */
/* -------------------------------------------------------------------------- */
/* Declared locally rather than pulling in @types/google.maps — this is the
   entire surface we touch. */

interface AuthorAttribution {
  displayName?: string | null;
  photoURI?: string | null;
  uri?: string | null;
}

interface PlaceReview {
  authorAttribution?: AuthorAttribution | null;
  publishTime?: Date | null;
  rating?: number | null;
  relativePublishTimeDescription?: string | null;
  text?: string | null;
}

interface PlaceInstance {
  reviews?: PlaceReview[] | null;
  rating?: number | null;
  userRatingCount?: number | null;
  googleMapsURI?: string | null;
  fetchFields: (options: { fields: string[] }) => Promise<unknown>;
}

interface PlaceConstructor {
  new (options: { id: string }): PlaceInstance;
}

interface PlacesLibrary {
  Place: PlaceConstructor;
}

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary?: (name: string) => Promise<unknown>;
      };
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Public types                                                               */
/* -------------------------------------------------------------------------- */

export interface GoogleReview {
  id: string;
  /** Review author's display name, as returned by Google. */
  name: string;
  content: string;
  rating: number;
  /** e.g. "2 months ago" — Google's own localised phrasing. */
  relativeTime: string;
  /** Author's Google profile photo. Required attribution when present. */
  avatarUrl?: string;
  /** Deep link to this review on Google. Required attribution when present. */
  reviewUrl?: string;
}

export interface GoogleReviewsResult {
  reviews: GoogleReview[];
  /** Aggregate star rating for the place. */
  rating?: number;
  /** Total review count — far larger than `reviews.length`, which caps at 5. */
  totalReviews?: number;
  /** Link to the place on Google, for a "read all reviews" affordance. */
  placeUrl?: string;
}

const CACHE_KEY = "google-reviews:place";
/** A week. Google permits up to 30 days; reviews change slowly and calls cost. */
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const EMPTY: GoogleReviewsResult = { reviews: [] };

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID as string | undefined;

/** True when both env vars are present, so callers can skip the section. */
export const isGoogleReviewsConfigured = (): boolean =>
  Boolean(API_KEY && PLACE_ID);

/* -------------------------------------------------------------------------- */
/* SDK loading                                                                */
/* -------------------------------------------------------------------------- */

const CALLBACK_NAME = "__afGoogleMapsReady";

let loaderPromise: Promise<void> | null = null;

/**
 * Injects the Maps JS bootstrap once and resolves when `importLibrary` is
 * available. Concurrent callers share the same promise; a failed load resets
 * it so a later attempt can retry.
 */
const loadMapsSdk = (apiKey: string): Promise<void> => {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve, reject) => {
    const globals = window as unknown as Record<string, unknown>;

    globals[CALLBACK_NAME] = () => {
      delete globals[CALLBACK_NAME];
      resolve();
    };

    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js" +
      `?key=${encodeURIComponent(apiKey)}` +
      "&libraries=places" +
      "&loading=async" +
      "&v=weekly" +
      `&callback=${CALLBACK_NAME}`;
    script.async = true;
    script.onerror = () => {
      delete globals[CALLBACK_NAME];
      loaderPromise = null;
      script.remove();
      reject(new Error("Failed to load the Google Maps JavaScript API"));
    };

    document.head.appendChild(script);
  });

  return loaderPromise;
};

/* -------------------------------------------------------------------------- */
/* Fetching                                                                   */
/* -------------------------------------------------------------------------- */

const toGoogleReview = (review: PlaceReview, idx: number): GoogleReview | null => {
  const content = review.text?.trim();
  if (!content) return null;

  const author = review.authorAttribution;
  return {
    id: `google-${idx}-${review.publishTime?.valueOf() ?? idx}`,
    name: author?.displayName?.trim() || "Google reviewer",
    content,
    rating: review.rating ?? 0,
    relativeTime: review.relativePublishTimeDescription ?? "",
    avatarUrl: author?.photoURI ?? undefined,
    reviewUrl: author?.uri ?? undefined,
  };
};

/**
 * Synchronous read from the persistent cache — use for instant paint, then
 * refresh in the background with `getGoogleReviews()`.
 */
export const getCachedGoogleReviews = (): GoogleReviewsResult | undefined =>
  persistentCache.get<GoogleReviewsResult>(CACHE_KEY);

/**
 * Loads reviews for the configured place. Resolves to an empty result rather
 * than throwing, so a missing key, blocked script or exhausted quota simply
 * lets the caller fall back instead of breaking the page.
 */
export const getGoogleReviews = async (): Promise<GoogleReviewsResult> => {
  if (!API_KEY || !PLACE_ID) {
    if (import.meta.env.DEV) {
      console.debug(
        "[googleReviews] VITE_GOOGLE_MAPS_API_KEY / VITE_GOOGLE_PLACE_ID not set — skipping fetch."
      );
    }
    return EMPTY;
  }

  try {
    await loadMapsSdk(API_KEY);

    const importLibrary = window.google?.maps?.importLibrary;
    if (!importLibrary) throw new Error("Maps SDK loaded without importLibrary");

    const { Place } = (await importLibrary("places")) as PlacesLibrary;
    const place = new Place({ id: PLACE_ID });

    await place.fetchFields({
      fields: ["reviews", "rating", "userRatingCount", "googleMapsURI"],
    });

    const reviews = (place.reviews ?? [])
      .map(toGoogleReview)
      .filter((r): r is GoogleReview => r !== null);

    const result: GoogleReviewsResult = {
      reviews,
      rating: place.rating ?? undefined,
      totalReviews: place.userRatingCount ?? undefined,
      placeUrl: place.googleMapsURI ?? undefined,
    };

    // Only overwrite a good cache entry with a non-empty result, so a transient
    // empty response doesn't blank out the section for a week.
    if (reviews.length > 0) {
      persistentCache.set(CACHE_KEY, result, CACHE_TTL);
    }

    return result;
  } catch (err) {
    console.warn("Failed to fetch Google reviews:", err);
    return getCachedGoogleReviews() ?? EMPTY;
  }
};
