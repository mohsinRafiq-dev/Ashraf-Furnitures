import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC8Wvoo3sZ-Tl5secmYTdwcL9Hr-o-8B9g',
  authDomain: 'furniture-mart-10426.firebaseapp.com',
  projectId: 'furniture-mart-10426',
  storageBucket: 'furniture-mart-10426.firebasestorage.app',
  messagingSenderId: '558910695708',
  appId: '1:558910695708:web:e458180e179f0aebf3b2d9',
  measurementId: 'G-B1B7E08BZB',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const oldCategoryMap = {
  'Living Room': 'Sofas',
  Bedroom: 'Beds',
  Dining: 'Tables',
  Office: 'Office Desks',
  Kitchen: 'Cabinets',
};

const keywordRules = [
  { test: /(sofa|couch|sectional|loveseat)/i, category: 'Sofas' },
  { test: /(bed|mattress|headboard)/i, category: 'Beds' },
  { test: /(table|dining|coffee table|console)/i, category: 'Tables' },
  { test: /(chair|stool|bar stool|recliner)/i, category: 'Chairs' },
  { test: /(wardrobe|closet|almirah)/i, category: 'Wardrobes' },
  { test: /(tv unit|tv stand|media console)/i, category: 'TV Units' },
  { test: /(cabinet|cupboard|storage cabinet)/i, category: 'Cabinets' },
  { test: /(dresser|chest of drawers)/i, category: 'Dressers' },
  { test: /(desk|office desk|study table)/i, category: 'Office Desks' },
  { test: /(bookcase|bookshelf|shelf)/i, category: 'Bookcases' },
  { test: /(nightstand|bedside)/i, category: 'Nightstands' },
  { test: /(bench)/i, category: 'Benches' },
  { test: /(kids|children|child)/i, category: 'Kids Furniture' },
  { test: /(outdoor|patio|garden)/i, category: 'Outdoor Furniture' },
  { test: /(mirror)/i, category: 'Mirrors' },
  { test: /(shoe rack|shoe cabinet|shoe storage)/i, category: 'Shoe Racks' },
  { test: /(ottoman|pouf)/i, category: 'Ottoman & Poufs' },
];

const inferCategory = (product, validCategories) => {
  const current = (product.category || '').trim();

  const haystack = `${product.name || ''} ${product.description || ''} ${product.sku || ''}`;

  for (const rule of keywordRules) {
    if (rule.test.test(haystack) && validCategories.has(rule.category)) {
      return rule.category;
    }
  }

  if (oldCategoryMap[current] && validCategories.has(oldCategoryMap[current])) {
    return oldCategoryMap[current];
  }

  if (validCategories.has(current)) return current;

  return validCategories.has('Sofas') ? 'Sofas' : current;
};

const main = async () => {
  console.log('Starting product category migration...');

  const categoriesSnap = await getDocs(collection(db, 'categories'));
  const categories = categoriesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const validCategories = new Set(categories.map((c) => c.name));

  if (validCategories.size === 0) {
    throw new Error('No categories found. Please seed categories first.');
  }

  const productsSnap = await getDocs(collection(db, 'products'));
  const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  let updated = 0;
  let unchanged = 0;
  const changedList = [];

  for (const product of products) {
    const fromCategory = (product.category || '').trim();
    const toCategory = inferCategory(product, validCategories);

    if (toCategory && fromCategory !== toCategory) {
      await updateDoc(doc(db, 'products', product.id), {
        category: toCategory,
        updatedAt: serverTimestamp(),
      });
      updated += 1;
      changedList.push({
        name: product.name,
        from: fromCategory || '(empty)',
        to: toCategory,
      });
      console.log(`Updated: ${product.name} | ${fromCategory || '(empty)'} -> ${toCategory}`);
    } else {
      unchanged += 1;
    }
  }

  console.log('Recalculating category productCount...');
  const refreshedProductsSnap = await getDocs(collection(db, 'products'));
  const refreshedProducts = refreshedProductsSnap.docs.map((d) => d.data());

  const countByCategory = {};
  for (const product of refreshedProducts) {
    const categoryName = (product.category || '').trim();
    if (!categoryName) continue;
    countByCategory[categoryName] = (countByCategory[categoryName] || 0) + 1;
  }

  for (const category of categories) {
    const count = countByCategory[category.name] || 0;
    await updateDoc(doc(db, 'categories', category.id), {
      productCount: count,
      updatedAt: serverTimestamp(),
    });
  }

  console.log('Done.');
  console.log(`Products updated: ${updated}`);
  console.log(`Products unchanged: ${unchanged}`);
  console.log('Category counts refreshed successfully.');

  if (changedList.length > 0) {
    console.log('Changed products summary:');
    changedList.forEach((c) => console.log(`- ${c.name}: ${c.from} -> ${c.to}`));
  }
};

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
