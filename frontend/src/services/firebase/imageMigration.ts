/**
 * Legacy Image Migration
 *
 * Walks every product + category document, finds the ones whose images are
 * still stored as data: URLs (base64), uploads them to Firebase Storage,
 * and rewrites the doc with the new https URL. After migration the docs
 * shrink by 2-3 orders of magnitude.
 *
 * Designed to be safe to re-run: docs already on https URLs are skipped.
 */

import {
  collection,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { uploadImage } from "./storageService";

const isDataUrl = (s: string): boolean => !!s && s.startsWith("data:");

const dataUrlToFile = async (dataUrl: string, filename = "legacy.jpg"): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
};

export interface MigrationProgress {
  scanned: number;
  migrated: number;
  skipped: number;
  failed: number;
  failures: Array<{ id: string; collection: string; error: string }>;
}

export type MigrationProgressListener = (progress: MigrationProgress) => void;

/**
 * Migrate every product image. Returns final stats.
 */
export const migrateProductImages = async (
  onProgress?: MigrationProgressListener
): Promise<MigrationProgress> => {
  const progress: MigrationProgress = {
    scanned: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    failures: [],
  };

  const snap = await getDocs(collection(db, "products"));

  for (const docSnap of snap.docs) {
    progress.scanned++;
    const data = docSnap.data();
    const images = Array.isArray(data.images) ? data.images : [];
    const firstImage = images[0];
    const url = typeof firstImage === "string" ? firstImage : firstImage?.url;

    if (!url || !isDataUrl(url)) {
      progress.skipped++;
      onProgress?.(progress);
      continue;
    }

    try {
      const file = await dataUrlToFile(url, `${docSnap.id}.jpg`);
      const uploaded = await uploadImage({
        folder: "products",
        itemId: docSnap.id,
        file,
      });

      await updateDoc(doc(db, "products", docSnap.id), {
        images: [
          {
            url: uploaded.url,
            alt: firstImage?.alt || data.name || "",
            isPrimary: true,
          },
        ],
        updatedAt: serverTimestamp(),
      });

      progress.migrated++;
    } catch (err: any) {
      progress.failed++;
      progress.failures.push({
        id: docSnap.id,
        collection: "products",
        error: err?.message || String(err),
      });
    }
    onProgress?.(progress);
  }

  return progress;
};

/**
 * Migrate every category image.
 */
export const migrateCategoryImages = async (
  onProgress?: MigrationProgressListener
): Promise<MigrationProgress> => {
  const progress: MigrationProgress = {
    scanned: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    failures: [],
  };

  const snap = await getDocs(collection(db, "categories"));

  for (const docSnap of snap.docs) {
    progress.scanned++;
    const data = docSnap.data();
    const url = data.image;

    if (!url || !isDataUrl(url)) {
      progress.skipped++;
      onProgress?.(progress);
      continue;
    }

    try {
      const file = await dataUrlToFile(url, `${docSnap.id}.jpg`);
      const uploaded = await uploadImage({
        folder: "categories",
        itemId: docSnap.id,
        file,
      });

      await updateDoc(doc(db, "categories", docSnap.id), {
        image: uploaded.url,
        updatedAt: serverTimestamp(),
      });

      progress.migrated++;
    } catch (err: any) {
      progress.failed++;
      progress.failures.push({
        id: docSnap.id,
        collection: "categories",
        error: err?.message || String(err),
      });
    }
    onProgress?.(progress);
  }

  return progress;
};
