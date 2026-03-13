import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyC8Wvoo3sZ-Tl5secmYTdwcL9Hr-o-8B9g',
  authDomain: 'furniture-mart-10426.firebaseapp.com',
  projectId: 'furniture-mart-10426',
  storageBucket: 'furniture-mart-10426.firebasestorage.app',
  messagingSenderId: '558910695708',
  appId: '1:558910695708:web:e458180e179f0aebf3b2d9',
  measurementId: 'G-B1B7E08BZB',
});

const db = getFirestore(app);

const officialCategories = new Set([
  'Sofas',
  'Beds',
  'Chairs',
  'Tables',
  'Wardrobes',
  'TV Units',
  'Cabinets',
  'Dressers',
  'Office Desks',
  'Bookcases',
  'Nightstands',
  'Recliners',
  'Benches',
  'Bar Stools',
  'Kids Furniture',
  'Outdoor Furniture',
  'Mirrors',
  'Shoe Racks',
  'Console Tables',
  'Ottoman & Poufs',
]);

const main = async () => {
  const productsSnap = await getDocs(collection(db, 'products'));
  let moved = 0;

  for (const productDoc of productsSnap.docs) {
    const product = productDoc.data();
    const currentCategory = (product.category || '').trim();

    if (!officialCategories.has(currentCategory)) {
      await updateDoc(doc(db, 'products', productDoc.id), {
        category: 'Sofas',
        updatedAt: serverTimestamp(),
      });
      console.log(`Moved ${product.name || productDoc.id}: ${currentCategory || '(empty)'} -> Sofas`);
      moved += 1;
    }
  }

  const categoriesSnap = await getDocs(collection(db, 'categories'));
  const productsAfterSnap = await getDocs(collection(db, 'products'));

  const countByCategory = {};
  for (const productDoc of productsAfterSnap.docs) {
    const product = productDoc.data();
    const cat = (product.category || '').trim();
    if (!cat) continue;
    countByCategory[cat] = (countByCategory[cat] || 0) + 1;
  }

  for (const categoryDoc of categoriesSnap.docs) {
    const category = categoryDoc.data();
    await updateDoc(doc(db, 'categories', categoryDoc.id), {
      productCount: countByCategory[category.name] || 0,
      updatedAt: serverTimestamp(),
    });
  }

  console.log(`Done. Products moved: ${moved}`);
};

main().catch((error) => {
  console.error('Normalization failed:', error);
  process.exit(1);
});
