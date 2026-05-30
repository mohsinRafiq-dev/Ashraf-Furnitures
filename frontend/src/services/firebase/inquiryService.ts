/**
 * Inquiry Service
 *
 * Logs every "Contact for Price" / WhatsApp click to Firestore so the seller
 * has a queryable record of which products customers are asking about.
 *
 * Writes are fire-and-forget: a failure must never block the user from
 * actually opening WhatsApp. We also dedupe within a 5-minute window to
 * avoid logging double-clicks as two leads.
 */

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export type InquirySource = "card" | "detail" | "search" | "custom-order";

export interface Inquiry {
  id?: string;
  productId?: string | null;
  productName: string;
  source: InquirySource;
  /** path + query string the user clicked from */
  referrer: string;
  /** Optional structured payload for custom-order / detail-page inquiries */
  details?: Record<string, string | number | null>;
  /** Admin notes / lead status. Starts as "new". */
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: Timestamp | Date;
}

const DEDUPE_WINDOW_MS = 5 * 60 * 1000;
const dedupeKey = (productName: string, source: InquirySource) =>
  `af:inquiryLogged:${source}:${productName.toLowerCase().trim()}`;

const wasRecentlyLogged = (productName: string, source: InquirySource): boolean => {
  try {
    const raw = sessionStorage.getItem(dedupeKey(productName, source));
    if (!raw) return false;
    return Date.now() - Number(raw) < DEDUPE_WINDOW_MS;
  } catch {
    return false;
  }
};

const markLogged = (productName: string, source: InquirySource) => {
  try {
    sessionStorage.setItem(dedupeKey(productName, source), String(Date.now()));
  } catch {
    /* private mode */
  }
};

/**
 * Log an inquiry. Returns the document ID on success, undefined otherwise.
 * Never throws — failure is silent so it can never block a WhatsApp open.
 */
export const logInquiry = async (params: {
  productId?: string | null;
  productName: string;
  source: InquirySource;
  details?: Record<string, string | number | null>;
}): Promise<string | undefined> => {
  const { productId, productName, source, details } = params;

  if (!productName || wasRecentlyLogged(productName, source)) {
    return undefined;
  }
  markLogged(productName, source);

  try {
    const payload = {
      productId: productId ?? null,
      productName,
      source,
      referrer:
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "",
      details: details ?? null,
      status: "new" as const,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "inquiries"), payload);
    return docRef.id;
  } catch (err) {
    console.warn("Inquiry log failed (non-blocking):", err);
    return undefined;
  }
};

/**
 * Fetch the most recent inquiries for the admin tab.
 */
export const getRecentInquiries = async (pageSize = 50): Promise<Inquiry[]> => {
  try {
    const q = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Inquiry, "id">),
    }));
  } catch (err) {
    console.warn("Failed to fetch inquiries:", err);
    return [];
  }
};

/**
 * Update an inquiry's status (admin: mark contacted / converted / closed).
 */
export const updateInquiryStatus = async (
  inquiryId: string,
  status: Inquiry["status"]
): Promise<void> => {
  await updateDoc(doc(db, "inquiries", inquiryId), { status });
};
