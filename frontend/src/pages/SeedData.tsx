import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const categories = [
  {
    name: "Sofas",
    slug: "sofas",
    description: "Comfortable sofas and couches for your living room",
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Beds",
    slug: "beds",
    description: "Premium beds and bed frames for restful sleep",
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Chairs",
    slug: "chairs",
    description: "Stylish chairs for dining, office, and living spaces",
    color: "from-green-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Tables",
    slug: "tables",
    description: "Dining tables, coffee tables, and side tables",
    color: "from-purple-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Wardrobes",
    slug: "wardrobes",
    description: "Spacious wardrobes and closet solutions",
    color: "from-rose-500 to-red-600",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "TV Units",
    slug: "tv-units",
    description: "Modern TV stands and entertainment centers",
    color: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1598300188775-3914c67cfb82?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Cabinets",
    slug: "cabinets",
    description: "Storage cabinets for kitchen, living room, and office",
    color: "from-yellow-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Dressers",
    slug: "dressers",
    description: "Elegant dressers and chest of drawers",
    color: "from-indigo-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Office Desks",
    slug: "office-desks",
    description: "Professional desks for home and office workspace",
    color: "from-gray-600 to-gray-800",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Bookcases",
    slug: "bookcases",
    description: "Stylish bookcases and shelving units",
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Nightstands",
    slug: "nightstands",
    description: "Bedside tables and nightstands",
    color: "from-fuchsia-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Recliners",
    slug: "recliners",
    description: "Comfortable recliners for relaxation",
    color: "from-orange-500 to-red-600",
    image: "https://images.unsplash.com/photo-1586158291800-2665f07bba79?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Benches",
    slug: "benches",
    description: "Versatile benches for entryways and dining",
    color: "from-lime-500 to-green-600",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Bar Stools",
    slug: "bar-stools",
    description: "Modern bar stools and counter height seating",
    color: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1572635148113-b43c0f6d5ff0?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Kids Furniture",
    slug: "kids-furniture",
    description: "Fun and safe furniture for children's rooms",
    color: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1616628188540-14bbe1c27bc8?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Outdoor Furniture",
    slug: "outdoor-furniture",
    description: "Weather-resistant outdoor and patio furniture",
    color: "from-teal-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Mirrors",
    slug: "mirrors",
    description: "Decorative wall and floor mirrors",
    color: "from-slate-500 to-gray-600",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Shoe Racks",
    slug: "shoe-racks",
    description: "Organized storage solutions for footwear",
    color: "from-amber-600 to-yellow-600",
    image: "https://images.unsplash.com/photo-1584996221744-7e830b96f507?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Console Tables",
    slug: "console-tables",
    description: "Elegant console tables for entryways and hallways",
    color: "from-sky-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=1200&h=800&fit=crop&q=80",
    productCount: 0
  },
  {
    name: "Ottoman & Poufs",
    slug: "ottoman-poufs",
    description: "Versatile ottomans and poufs for seating and storage",
    color: "from-red-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&q=80",
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
