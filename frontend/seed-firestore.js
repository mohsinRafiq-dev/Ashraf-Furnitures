/**
 * Seed Firestore with sample data
 * Run: node seed-firestore.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8Wvoo3sZ-Tl5secmYTdwcL9Hr-o-8B9g",
  authDomain: "furniture-mart-10426.firebaseapp.com",
  projectId: "furniture-mart-10426",
  storageBucket: "furniture-mart-10426.firebasestorage.app",
  messagingSenderId: "558910695708",
  appId: "1:558910695708:web:e458180e179f0aebf3b2d9",
  measurementId: "G-B1B7E08BZB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Comfortable and stylish living room furniture",
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    productCount: 0
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Rest and relaxation bedroom essentials",
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1540932239986-30128078ceb?w=800&h=600&fit=crop",
    productCount: 0
  },
  {
    name: "Dining",
    slug: "dining",
    description: "Elegant dining room furniture",
    color: "from-green-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop",
    productCount: 0
  },
  {
    name: "Office",
    slug: "office",
    description: "Professional home office furniture",
    color: "from-gray-600 to-gray-800",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop",
    productCount: 0
  }
];

const products = [
  {
    name: "Modern Sofa Set",
    slug: "modern-sofa-set",
    description: "3-seater comfortable modern sofa with premium fabric",
    price: 899.99,
    category: "Living Room",
    stock: 15,
    sku: "SOF-001",
    featured: true,
    rating: 4.5,
    reviews: 24,
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
        alt: "Modern Sofa",
        isPrimary: true
      }
    ],
    variants: [],
    specifications: [
      { key: "Material", value: "Premium Fabric" },
      { key: "Dimensions", value: "200cm x 90cm x 85cm" },
      { key: "Color", value: "Gray" }
    ]
  },
  {
    name: "Queen Size Bed",
    slug: "queen-size-bed",
    description: "Elegant queen size bed with upholstered headboard",
    price: 1299.99,
    category: "Bedroom",
    stock: 8,
    sku: "BED-001",
    featured: true,
    rating: 4.8,
    reviews: 36,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
        alt: "Queen Bed",
        isPrimary: true
      }
    ],
    variants: [],
    specifications: [
      { key: "Size", value: "Queen (60x80 inches)" },
      { key: "Material", value: "Wood & Fabric" },
      { key: "Color", value: "Beige" }
    ]
  },
  {
    name: "Dining Table Set",
    slug: "dining-table-set",
    description: "6-seater wooden dining table with chairs",
    price: 749.99,
    category: "Dining",
    stock: 12,
    sku: "DIN-001",
    featured: false,
    rating: 4.3,
    reviews: 18,
    images: [
      {
        url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop",
        alt: "Dining Table",
        isPrimary: true
      }
    ],
    variants: [],
    specifications: [
      { key: "Material", value: "Solid Wood" },
      { key: "Seats", value: "6 People" },
      { key: "Dimensions", value: "180cm x 90cm x 75cm" }
    ]
  },
  {
    name: "Office Desk",
    slug: "office-desk",
    description: "Modern L-shaped office desk with storage",
    price: 449.99,
    category: "Office",
    stock: 20,
    sku: "OFF-001",
    featured: false,
    rating: 4.6,
    reviews: 42,
    images: [
      {
        url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop",
        alt: "Office Desk",
        isPrimary: true
      }
    ],
    variants: [],
    specifications: [
      { key: "Material", value: "Wood & Metal" },
      { key: "Shape", value: "L-Shaped" },
      { key: "Storage", value: "3 Drawers" }
    ]
  },
  {
    name: "Coffee Table",
    slug: "coffee-table",
    description: "Modern glass top coffee table",
    price: 199.99,
    category: "Living Room",
    stock: 25,
    sku: "COF-001",
    featured: false,
    rating: 4.4,
    reviews: 15,
    images: [
      {
        url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
        alt: "Coffee Table",
        isPrimary: true
      }
    ],
    variants: [],
    specifications: [
      { key: "Material", value: "Glass & Wood" },
      { key: "Dimensions", value: "100cm x 60cm x 45cm" },
      { key: "Style", value: "Modern" }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting Firestore seeding...\n');

    // Add categories
    console.log('📁 Adding categories...');
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Added category: ${category.name} (${docRef.id})`);
    }

    // Add products
    console.log('\n📦 Adding products...');
    for (const product of products) {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Added product: ${product.name} (${docRef.id})`);
    }

    console.log('\n✨ Database seeded successfully!');
    console.log(`📊 Added ${categories.length} categories and ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
