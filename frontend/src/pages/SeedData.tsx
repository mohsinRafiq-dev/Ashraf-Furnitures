/**
 * Catalog reseed tool (admin only).
 *
 * Wipes every product, removes categories that are not part of the curated
 * catalog, then rewrites all 20 categories and 100 products from
 * `data/catalogSeed.ts`.
 *
 * This runs in the browser deliberately: Firestore rules require an
 * authenticated admin for writes, and the admin signs in with Google, so the
 * logged-in session is the only practical way to authorise the writes without
 * handing a service-account key around.
 *
 * Destructive. Requires typing a confirmation phrase before it will run.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from '../store/authStore';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../data/catalogSeed';

const CONFIRM_PHRASE = 'RESEED';

interface Counts {
  categories: number;
  products: number;
}

export default function SeedData() {
  const { user, isAdmin } = useAuthStore();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [confirm, setConfirm] = useState('');
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const append = useCallback((line: string) => {
    setLog((prev) => [...prev, line]);
  }, []);

  const refreshCounts = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'products')),
      ]);
      setCounts({ categories: cats.size, products: prods.size });
    } catch (err) {
      append(`Could not read current counts: ${(err as Error).message}`);
    }
  }, [append]);

  useEffect(() => {
    void refreshCounts();
  }, [refreshCounts]);

  const reseed = async () => {
    setRunning(true);
    setDone(false);
    setLog([]);

    try {
      // ---- 1. Delete every product -------------------------------------
      append('Reading existing products…');
      const existingProducts = await getDocs(collection(db, 'products'));
      append(`Deleting ${existingProducts.size} products…`);
      let deleted = 0;
      for (const d of existingProducts.docs) {
        await deleteDoc(doc(db, 'products', d.id));
        deleted += 1;
        if (deleted % 10 === 0) append(`  …${deleted}/${existingProducts.size}`);
      }
      append(`Deleted ${deleted} products.`);

      // ---- 2. Reconcile categories -------------------------------------
      append('Reading existing categories…');
      const existingCats = await getDocs(collection(db, 'categories'));
      const wanted = new Map(SEED_CATEGORIES.map((c) => [c.name, c]));
      const seen = new Set<string>();

      let updatedCats = 0;
      let removedCats = 0;

      for (const d of existingCats.docs) {
        const name = (d.data().name as string) ?? '';
        const target = wanted.get(name);

        if (!target || seen.has(name)) {
          // Not in the curated catalog, or a duplicate of one we already kept.
          await deleteDoc(doc(db, 'categories', d.id));
          removedCats += 1;
          append(`  removed category "${name || d.id}"`);
          continue;
        }

        // Keep the document id so anything referencing it stays valid.
        await updateDoc(doc(db, 'categories', d.id), {
          ...target,
          updatedAt: serverTimestamp(),
        });
        seen.add(name);
        updatedCats += 1;
      }

      let createdCats = 0;
      for (const [name, cat] of wanted) {
        if (seen.has(name)) continue;
        await addDoc(collection(db, 'categories'), {
          ...cat,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        createdCats += 1;
        append(`  created category "${name}"`);
      }
      append(
        `Categories: ${updatedCats} updated, ${createdCats} created, ${removedCats} removed.`
      );

      // ---- 3. Insert the catalog ---------------------------------------
      append(`Adding ${SEED_PRODUCTS.length} products…`);
      let added = 0;
      for (const product of SEED_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        added += 1;
        if (added % 10 === 0) append(`  …${added}/${SEED_PRODUCTS.length}`);
      }
      append(`Added ${added} products.`);

      append('Done.');
      setDone(true);
      await refreshCounts();
    } catch (err) {
      append(`FAILED: ${(err as Error).message}`);
    } finally {
      setRunning(false);
      setConfirm('');
    }
  };

  const authorised = Boolean(user) && isAdmin();
  const canRun = authorised && !running && confirm.trim() === CONFIRM_PHRASE;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Reseed Catalog</h1>
        <p className="text-sm text-gray-600 mb-6">
          Replaces the entire product catalog with {SEED_CATEGORIES.length}{' '}
          categories and {SEED_PRODUCTS.length} curated products.
        </p>

        {!authorised && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            <p className="font-semibold mb-2">
              Not authorised — Firestore will reject the writes.
            </p>
            {/* Spell out which check failed; "sign in as admin" alone is not
                actionable when the role, not the session, is the problem. */}
            <ul className="space-y-1 font-mono text-xs">
              <li>signed in: {user ? 'yes' : 'NO'}</li>
              <li>email: {user?.email || '(none)'}</li>
              <li>role: {user?.role || '(none)'}</li>
              <li>isAdmin(): {isAdmin() ? 'true' : 'FALSE'}</li>
            </ul>
            <p className="mt-2">
              {!user
                ? 'Sign in at /login with the admin Google account.'
                : 'Signed in, but this account has no admin role — its /admins record is missing or inactive.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Categories now
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {counts ? counts.categories : '—'}
              <span className="text-base font-normal text-gray-500">
                {' '}
                → {SEED_CATEGORIES.length}
              </span>
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Products now
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {counts ? counts.products : '—'}
              <span className="text-base font-normal text-gray-500">
                {' '}
                → {SEED_PRODUCTS.length}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <strong>This deletes every existing product.</strong> Categories not in
          the curated list are deleted too; the rest are updated in place. There
          is no undo from this page — restore from your backup if needed.
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type <code className="bg-gray-100 px-1.5 py-0.5 rounded">{CONFIRM_PHRASE}</code> to enable:
        </label>
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={!authorised || running}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100"
          placeholder={CONFIRM_PHRASE}
        />

        <button
          onClick={reseed}
          disabled={!canRun}
          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {running ? 'Reseeding…' : 'Wipe and reseed catalog'}
        </button>

        {log.length > 0 && (
          <div
            className={`mt-6 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto ${
              done ? 'bg-green-50 border border-green-200' : 'bg-gray-900 text-gray-100'
            }`}
          >
            {log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
