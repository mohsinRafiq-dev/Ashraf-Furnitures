import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

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
      { key: "Dimensions", value: "200cm x 90cm x 85cm" }
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
      { key: "Size", value: "Queen" },
      { key: "Material", value: "Wood & Fabric" }
    ]
  }
];

export default function SeedData() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedCategories = async () => {
    setLoading(true);
    setMessage('');
    try {
      for (const category of categories) {
        await addDoc(collection(db, 'categories'), {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setMessage(`✅ Successfully added ${categories.length} categories!`);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedProducts = async () => {
    setLoading(true);
    setMessage('');
    try {
      for (const product of products) {
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setMessage(`✅ Successfully added ${products.length} products!`);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Seed Firestore Database</h1>
        
        <div className="space-y-4">
          <button
            onClick={seedCategories}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : `Add ${categories.length} Categories`}
          </button>

          <button
            onClick={seedProducts}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : `Add ${products.length} Products`}
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-lg ${message.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This will add sample data to your Firestore database. 
            You can access this page at <code className="bg-yellow-100 px-2 py-1 rounded">/seed-data</code>
          </p>
        </div>
      </div>
    </div>
  );
}
