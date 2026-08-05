/**
 * Seed catalog for the storefront — generated, not hand-maintained.
 *
 * 20 categories x 5 products = 100 products.
 * Every image URL was HTTP-verified to return an image before being written here.
 * All products ship with hidePrice: true, so the storefront shows
 * "Contact for Price" rather than a number.
 */

export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  color: string;
  image: string;
  productCount: number;
}

export interface SeedProduct {
  name: string;
  description: string;
  price: number;
  hidePrice: boolean;
  category: string;
  slug: string;
  sku: string;
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
  stock: number;
  featured: boolean;
  variants: Array<{ name: string; values: string[] }>;
  specifications: Array<{ name: string; value: string }>;
  rating: number;
  reviews: number;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    "name": "Sofas",
    "slug": "sofas",
    "description": "Comfortable sofas and couches for your living room",
    "color": "from-amber-500 to-orange-600",
    "image": "https://plus.unsplash.com/premium_photo-1681449856688-2abd99ab5a73?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Beds",
    "slug": "beds",
    "description": "Premium beds and bed frames for restful sleep",
    "color": "from-blue-500 to-indigo-600",
    "image": "https://plus.unsplash.com/premium_photo-1678790909042-daaceb35933d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Chairs",
    "slug": "chairs",
    "description": "Stylish chairs for dining, office, and living spaces",
    "color": "from-green-500 to-teal-600",
    "image": "https://plus.unsplash.com/premium_photo-1683141419137-db47132b8df4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Tables",
    "slug": "tables",
    "description": "Dining tables, coffee tables, and side tables",
    "color": "from-purple-500 to-pink-600",
    "image": "https://plus.unsplash.com/premium_photo-1679520112257-f868838fc2ae?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Wardrobes",
    "slug": "wardrobes",
    "description": "Spacious wardrobes and closet solutions",
    "color": "from-rose-500 to-red-600",
    "image": "https://plus.unsplash.com/premium_photo-1674773520163-c93eeb8cc2f7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Cabinets",
    "slug": "cabinets",
    "description": "Storage cabinets and sideboards for every room",
    "color": "from-teal-500 to-cyan-600",
    "image": "https://plus.unsplash.com/premium_photo-1683141318297-75a3d8e86476?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "TV Units",
    "slug": "tv-units",
    "description": "Media consoles and entertainment units",
    "color": "from-slate-500 to-gray-700",
    "image": "https://plus.unsplash.com/premium_photo-1683141392308-aaa39d916686?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Bar Stools",
    "slug": "bar-stools",
    "description": "Counter and bar seating",
    "color": "from-orange-500 to-amber-600",
    "image": "https://plus.unsplash.com/premium_photo-1671269942067-bb709a81273c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Shoe Racks",
    "slug": "shoe-racks",
    "description": "Shoe storage and entryway organisers",
    "color": "from-lime-500 to-green-600",
    "image": "https://plus.unsplash.com/premium_photo-1733514691441-4f293f52d27c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Bookcases",
    "slug": "bookcases",
    "description": "Bookshelves and display units",
    "color": "from-yellow-600 to-amber-700",
    "image": "https://plus.unsplash.com/premium_photo-1681488394409-5614ef55488c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Office Desks",
    "slug": "office-desks",
    "description": "Desks and workstations for home and office",
    "color": "from-indigo-500 to-blue-700",
    "image": "https://plus.unsplash.com/premium_photo-1683309563514-aff14da6c40d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Console Tables",
    "slug": "console-tables",
    "description": "Entryway and hallway console tables",
    "color": "from-fuchsia-500 to-purple-600",
    "image": "https://plus.unsplash.com/premium_photo-1734543931990-c40c832fa671?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Nightstands",
    "slug": "nightstands",
    "description": "Bedside tables and nightstands",
    "color": "from-sky-500 to-blue-600",
    "image": "https://plus.unsplash.com/premium_photo-1670076505460-a6d1a8ecb0f9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Dressers",
    "slug": "dressers",
    "description": "Dressers, chests and dressing tables",
    "color": "from-pink-500 to-rose-600",
    "image": "https://plus.unsplash.com/premium_photo-1683129613576-cb27862274c2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Benches",
    "slug": "benches",
    "description": "Benches for dining, bedroom and entryway",
    "color": "from-emerald-500 to-green-700",
    "image": "https://plus.unsplash.com/premium_photo-1714675673807-9a495cb15267?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Mirrors",
    "slug": "mirrors",
    "description": "Wall, floor and vanity mirrors",
    "color": "from-cyan-500 to-sky-600",
    "image": "https://plus.unsplash.com/premium_photo-1681980018817-b36ab8848616?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Recliners",
    "slug": "recliners",
    "description": "Recliners and lounge seating",
    "color": "from-red-500 to-orange-700",
    "image": "https://plus.unsplash.com/premium_photo-1669740216429-9dc5b9376969?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Outdoor Furniture",
    "slug": "outdoor-furniture",
    "description": "Garden, patio and balcony furniture",
    "color": "from-green-600 to-emerald-700",
    "image": "https://plus.unsplash.com/premium_photo-1689609949905-0d27dac6c38e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Kids Furniture",
    "slug": "kids-furniture",
    "description": "Furniture built for children",
    "color": "from-violet-500 to-purple-600",
    "image": "https://plus.unsplash.com/premium_photo-1684164600683-6ecb6c9c0eb7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  },
  {
    "name": "Ottoman & Poufs",
    "slug": "ottoman-poufs",
    "description": "Ottomans, poufs and footstools",
    "color": "from-amber-600 to-yellow-700",
    "image": "https://plus.unsplash.com/premium_photo-1664699106353-fdd2ddd86bd8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=800&fit=crop&q=80&fm=jpg",
    "productCount": 5
  }
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    "name": "Lahore 3-Seater Fabric Sofa",
    "description": "A generously padded three-seater built on a seasoned sheesham frame, wrapped in a hard-wearing woven fabric that suits daily family use.",
    "price": 88000,
    "hidePrice": true,
    "category": "Sofas",
    "slug": "lahore-3-seater-fabric-sofa",
    "sku": "AF-SOF-1001",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1681449856688-2abd99ab5a73?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Lahore 3-Seater Fabric Sofa — a living room with a leather couch and a potted plant",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1724582586495-d050726cf354?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Lahore 3-Seater Fabric Sofa — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Lahore 3-Seater Fabric Sofa — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham frame with high-density foam"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Kashmir Chesterfield Leather Sofa",
    "description": "Deep-buttoned Chesterfield styling in premium leatherette, with rolled arms and a solid hardwood base finished by hand.",
    "price": 145000,
    "hidePrice": true,
    "category": "Sofas",
    "slug": "kashmir-chesterfield-leather-sofa",
    "sku": "AF-SOF-1002",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kashmir Chesterfield Leather Sofa — a living room with a couch and a coffee table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1724582586580-8b52c02e99dd?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kashmir Chesterfield Leather Sofa — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141389818-77fd3485334b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kashmir Chesterfield Leather Sofa — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham frame with high-density foam"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Gojra L-Shaped Sectional Sofa",
    "description": "A roomy L-shaped sectional that anchors a large living room, with reversible chaise and removable washable covers.",
    "price": 165000,
    "hidePrice": true,
    "category": "Sofas",
    "slug": "gojra-l-shaped-sectional-sofa",
    "sku": "AF-SOF-1003",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1759722668253-1767030ad9b2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Gojra L-Shaped Sectional Sofa — A modern grey sectional sofa in an empty room.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Gojra L-Shaped Sectional Sofa — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1759722667079-1a4e23d9ead9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG1vZGVybiUyMHNvZmElMjBsaXZpbmclMjByb29tfGVufDB8fHx8MTc4NTkzNzUyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Gojra L-Shaped Sectional Sofa — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham frame with high-density foam"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Heritage Carved Wooden Sofa Set",
    "description": "Traditional five-seat set with hand-carved sheesham detailing and firm cushioning — a classic drawing-room centrepiece.",
    "price": 195000,
    "hidePrice": true,
    "category": "Sofas",
    "slug": "heritage-carved-wooden-sofa-set",
    "sku": "AF-SOF-1004",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1779144639439-00e6d853fd6f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Heritage Carved Wooden Sofa Set — Sunlight casts dramatic shadows on a brown leather sofa.",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141389818-77fd3485334b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Heritage Carved Wooden Sofa Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1681449856688-2abd99ab5a73?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Heritage Carved Wooden Sofa Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham frame with high-density foam"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Noor 2-Seater Loveseat",
    "description": "A compact loveseat for apartments and reading corners, with tapered legs and a supportive sprung seat.",
    "price": 62000,
    "hidePrice": true,
    "category": "Sofas",
    "slug": "noor-2-seater-loveseat",
    "sku": "AF-SOF-1005",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1681046751108-a516bea00570?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Noor 2-Seater Loveseat — a white couch sitting in front of a round window",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1759722667079-1a4e23d9ead9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG1vZGVybiUyMHNvZmElMjBsaXZpbmclMjByb29tfGVufDB8fHx8MTc4NTkzNzUyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Noor 2-Seater Loveseat — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bW9kZXJuJTIwc29mYSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTIzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Noor 2-Seater Loveseat — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham frame with high-density foam"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Sheesham King Size Bed",
    "description": "A substantial king bed in solid sheesham with a panelled headboard and reinforced slat support.",
    "price": 135000,
    "hidePrice": true,
    "category": "Beds",
    "slug": "sheesham-king-size-bed",
    "sku": "AF-BED-1006",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1678790909042-daaceb35933d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham King Size Bed — a bed with two pillows and a head board",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1517862774645-dd398fbfaffa?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham King Size Bed — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1757344454333-cc666252e596?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham King Size Bed — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham (rosewood)"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Royal Four Poster Bed",
    "description": "Turned corner posts and a carved crown give this bed real presence in a large master bedroom.",
    "price": 210000,
    "hidePrice": true,
    "category": "Beds",
    "slug": "royal-four-poster-bed",
    "sku": "AF-BED-1007",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1633944095397-878622ebc01c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Royal Four Poster Bed — a bed sitting in a bedroom next to a window",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1617198998846-56e8a4c6e7b7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Royal Four Poster Bed — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1733266857336-bc762e48cf76?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Royal Four Poster Bed — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham (rosewood)"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Minimalist Platform Bed",
    "description": "A low-profile platform frame with clean lines and a wide floating headboard — no box spring needed.",
    "price": 92000,
    "hidePrice": true,
    "category": "Beds",
    "slug": "minimalist-platform-bed",
    "sku": "AF-BED-1008",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1688384452844-8364c3e2fc28?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Minimalist Platform Bed — a bed sitting in a bedroom next to a window",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1757344454333-cc666252e596?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Minimalist Platform Bed — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1750420556288-d0e32a6f517b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGJlZCUyMGJlZHJvb20lMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTM1fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Minimalist Platform Bed — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham (rosewood)"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Ashraf Storage Bed with Drawers",
    "description": "Four deep drawers built into the base recover valuable space in smaller bedrooms.",
    "price": 118000,
    "hidePrice": true,
    "category": "Beds",
    "slug": "ashraf-storage-bed-with-drawers",
    "sku": "AF-BED-1009",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1517912181842-e5a9d4701a4e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ashraf Storage Bed with Drawers — white comforter",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1733266857336-bc762e48cf76?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ashraf Storage Bed with Drawers — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1678790909042-daaceb35933d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ashraf Storage Bed with Drawers — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham (rosewood)"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Classic Carved Double Bed",
    "description": "Hand-carved floral detail on headboard and footboard, finished in a warm traditional stain.",
    "price": 105000,
    "hidePrice": true,
    "category": "Beds",
    "slug": "classic-carved-double-bed",
    "sku": "AF-BED-1010",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1673014202228-65e0e9064a34?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Classic Carved Double Bed — a bedroom with a large bed and a wooden ceiling",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1750420556288-d0e32a6f517b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGJlZCUyMGJlZHJvb20lMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTM1fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Classic Carved Double Bed — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1633944095397-878622ebc01c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YmVkJTIwYmVkcm9vbSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc1MzV8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Classic Carved Double Bed — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham (rosewood)"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Solid Sheesham Dining Chair",
    "description": "A sturdy everyday dining chair with a contoured back and a padded seat in stain-resistant fabric.",
    "price": 14500,
    "hidePrice": true,
    "category": "Chairs",
    "slug": "solid-sheesham-dining-chair",
    "sku": "AF-CHA-1011",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141419137-db47132b8df4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Solid Sheesham Dining Chair — Minimal style dining room 3d rendering image.There are concrete floor,Decorate wall with white wood lattice and finished with wood furniture.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1640938776314-4d303f8a1380?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Solid Sheesham Dining Chair — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1699588772787-1eed3b726e0a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Solid Sheesham Dining Chair — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Velvet Accent Armchair",
    "description": "A softly curved accent chair in plush velvet, raised on tapered wooden legs.",
    "price": 46000,
    "hidePrice": true,
    "category": "Chairs",
    "slug": "velvet-accent-armchair",
    "sku": "AF-CHA-1012",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Velvet Accent Armchair — white ceramic mug on brown wooden table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1650476524564-f94dc9669067?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Velvet Accent Armchair — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1676321688723-72ddb32096cf?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Velvet Accent Armchair — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Ergonomic Study Chair",
    "description": "Contoured lumbar support and a breathable back for long study or work sessions.",
    "price": 28000,
    "hidePrice": true,
    "category": "Chairs",
    "slug": "ergonomic-study-chair",
    "sku": "AF-CHA-1013",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ergonomic Study Chair — black and brown wooden chair",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1699588772787-1eed3b726e0a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ergonomic Study Chair — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1565307586367-2c27d915cc8e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGRpbmluZyUyMGNoYWlyJTIwZnVybml0dXJlfGVufDB8fHx8MTc4NTkzNzU0N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ergonomic Study Chair — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Rattan Cane Back Chair",
    "description": "Woven cane back paired with a solid wood frame — light, airy and cool in summer.",
    "price": 18500,
    "hidePrice": true,
    "category": "Chairs",
    "slug": "rattan-cane-back-chair",
    "sku": "AF-CHA-1014",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Cane Back Chair — gray and white padded chair",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1676321688723-72ddb32096cf?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Cane Back Chair — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141419137-db47132b8df4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Cane Back Chair — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Upholstered Wingback Chair",
    "description": "A high wingback that shelters from draughts, with deep buttoning and rolled arms.",
    "price": 54000,
    "hidePrice": true,
    "category": "Chairs",
    "slug": "upholstered-wingback-chair",
    "sku": "AF-CHA-1015",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1705479742794-5cd85f349bd5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Wingback Chair — a wooden chair with a brown seat and back rest",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1565307586367-2c27d915cc8e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGRpbmluZyUyMGNoYWlyJTIwZnVybml0dXJlfGVufDB8fHx8MTc4NTkzNzU0N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Wingback Chair — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZGluaW5nJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Wingback Chair — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "6-Seater Sheesham Dining Table",
    "description": "A full-size family dining table in solid sheesham, finished to show the natural grain.",
    "price": 125000,
    "hidePrice": true,
    "category": "Tables",
    "slug": "6-seater-sheesham-dining-table",
    "sku": "AF-TAB-1016",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1679520112257-f868838fc2ae?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "6-Seater Sheesham Dining Table — a wooden table topped with wicker place mats",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1547062200-f195b1c77e30?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "6-Seater Sheesham Dining Table — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1615920606214-6428b3324c74?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "6-Seater Sheesham Dining Table — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham top with hardwood legs"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Round Marble Top Coffee Table",
    "description": "A honed marble top on a slim metal base — a calm centrepiece for a living room.",
    "price": 48000,
    "hidePrice": true,
    "category": "Tables",
    "slug": "round-marble-top-coffee-table",
    "sku": "AF-TAB-1017",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Marble Top Coffee Table — white ceramic mug on brown wooden table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1758977403865-f79e156415b3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Marble Top Coffee Table — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1677220808756-0e66328115c8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Marble Top Coffee Table — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham top with hardwood legs"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Nested Side Table Set",
    "description": "Three tables that tuck away into one another, useful when guests arrive.",
    "price": 26000,
    "hidePrice": true,
    "category": "Tables",
    "slug": "nested-side-table-set",
    "sku": "AF-TAB-1018",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1636138388621-258a72ecb07e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Nested Side Table Set — a dining room with a table and chairs",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1615920606214-6428b3324c74?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Nested Side Table Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1618108487640-249b7e29d73e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGRpbmluZyUyMHRhYmxlJTIwd29vZGVufGVufDB8fHx8MTc4NTkzNzU2MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Nested Side Table Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham top with hardwood legs"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Extendable Family Dining Table",
    "description": "Seats six day to day and extends to ten with a concealed butterfly leaf.",
    "price": 158000,
    "hidePrice": true,
    "category": "Tables",
    "slug": "extendable-family-dining-table",
    "sku": "AF-TAB-1019",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1606660023296-81d67734170a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Extendable Family Dining Table — dining table with plates and drinking glasses",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1677220808756-0e66328115c8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Extendable Family Dining Table — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1679520112257-f868838fc2ae?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Extendable Family Dining Table — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham top with hardwood legs"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Walnut Study Table",
    "description": "A clean-lined writing table with a single drawer and cable routing at the back.",
    "price": 42000,
    "hidePrice": true,
    "category": "Tables",
    "slug": "walnut-study-table",
    "sku": "AF-TAB-1020",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1682582241642-d16c69cc087c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Walnut Study Table — a wooden table with two vases on top of it",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1618108487640-249b7e29d73e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGRpbmluZyUyMHRhYmxlJTIwd29vZGVufGVufDB8fHx8MTc4NTkzNzU2MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Walnut Study Table — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZGluaW5nJTIwdGFibGUlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NTYxfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Walnut Study Table — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham top with hardwood legs"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "3-Door Sheesham Wardrobe",
    "description": "Three full-height doors with a hanging section, shelving column and two base drawers.",
    "price": 165000,
    "hidePrice": true,
    "category": "Wardrobes",
    "slug": "3-door-sheesham-wardrobe",
    "sku": "AF-WAR-1021",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1674773520163-c93eeb8cc2f7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "3-Door Sheesham Wardrobe — a bedroom with a bed and a closet",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1662454419622-a41092ecd245?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "3-Door Sheesham Wardrobe — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1573311392049-4186e3a47e9c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "3-Door Sheesham Wardrobe — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham and engineered wood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Sliding Mirror Wardrobe",
    "description": "Space-saving sliding doors with full-length mirrors — ideal where a swing door will not fit.",
    "price": 185000,
    "hidePrice": true,
    "category": "Wardrobes",
    "slug": "sliding-mirror-wardrobe",
    "sku": "AF-WAR-1022",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sliding Mirror Wardrobe — brown wooden 2-door cabinet",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sliding Mirror Wardrobe — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1674773520192-cec460924db7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sliding Mirror Wardrobe — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham and engineered wood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Compact 2-Door Almirah",
    "description": "A practical two-door almirah for guest rooms, with an internal locker.",
    "price": 88000,
    "hidePrice": true,
    "category": "Wardrobes",
    "slug": "compact-2-door-almirah",
    "sku": "AF-WAR-1023",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1611048268330-53de574cae3b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact 2-Door Almirah — brown wooden table with chairs",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1573311392049-4186e3a47e9c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact 2-Door Almirah — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1682450195449-32ab08ddf7e7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHdhcmRyb2JlJTIwY2xvc2V0JTIwYmVkcm9vbXxlbnwwfHx8fDE3ODU5Mzc1NzF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact 2-Door Almirah — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham and engineered wood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Walk-in Modular Wardrobe",
    "description": "An open modular system of rails, shelves and drawer banks, configurable to your room.",
    "price": 245000,
    "hidePrice": true,
    "category": "Wardrobes",
    "slug": "walk-in-modular-wardrobe",
    "sku": "AF-WAR-1024",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1631889993877-71e193bf79b8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Walk-in Modular Wardrobe — a bedroom with a bed and a closet",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1674773520192-cec460924db7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Walk-in Modular Wardrobe — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1674773520163-c93eeb8cc2f7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Walk-in Modular Wardrobe — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham and engineered wood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Kids Two-Tone Wardrobe",
    "description": "A lower-height wardrobe scaled for children, with rounded edges and bright accents.",
    "price": 72000,
    "hidePrice": true,
    "category": "Wardrobes",
    "slug": "kids-two-tone-wardrobe",
    "sku": "AF-WAR-1025",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1674815329032-421d305ad589?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Two-Tone Wardrobe — a walk in closet with a lot of shelves",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1682450195449-32ab08ddf7e7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHdhcmRyb2JlJTIwY2xvc2V0JTIwYmVkcm9vbXxlbnwwfHx8fDE3ODU5Mzc1NzF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Two-Tone Wardrobe — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d2FyZHJvYmUlMjBjbG9zZXQlMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzU3MXww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Two-Tone Wardrobe — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham and engineered wood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Crockery Display Cabinet",
    "description": "Glazed upper doors display your dinner service while closed lower storage hides the rest.",
    "price": 96000,
    "hidePrice": true,
    "category": "Cabinets",
    "slug": "crockery-display-cabinet",
    "sku": "AF-CAB-1026",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141318297-75a3d8e86476?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Crockery Display Cabinet — Modern interior of living room with wooden dresser 3d rendering",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1594580701468-e5678582b8ce?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Crockery Display Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Crockery Display Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with sheesham veneer"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Sideboard Storage Cabinet",
    "description": "A long, low sideboard with three drawers and two cupboards — good behind a dining table.",
    "price": 78000,
    "hidePrice": true,
    "category": "Cabinets",
    "slug": "sideboard-storage-cabinet",
    "sku": "AF-CAB-1027",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1532588213355-52317771cce6?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sideboard Storage Cabinet — person walking beside white and brown wooden sideboard",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1653971858625-9cb23d0dca80?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sideboard Storage Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683129613576-cb27862274c2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sideboard Storage Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with sheesham veneer"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Bathroom Vanity Cabinet",
    "description": "Moisture-resistant finish with a basin cut-out and soft-close doors.",
    "price": 54000,
    "hidePrice": true,
    "category": "Cabinets",
    "slug": "bathroom-vanity-cabinet",
    "sku": "AF-CAB-1028",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1600422086908-72be2c8f5f3f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bathroom Vanity Cabinet — brown wooden cabinet beside white printer",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bathroom Vanity Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1544691560-fc2053d97726?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGNhYmluZXQlMjBzdG9yYWdlJTIwZnVybml0dXJlfGVufDB8fHx8MTc4NTkzNzU4M3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bathroom Vanity Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with sheesham veneer"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Two-Drawer Filing Cabinet",
    "description": "A compact lockable filing cabinet sized for A4 and legal folders.",
    "price": 34000,
    "hidePrice": true,
    "category": "Cabinets",
    "slug": "two-drawer-filing-cabinet",
    "sku": "AF-CAB-1029",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1628843201283-2ca32147ad3e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Two-Drawer Filing Cabinet — black and brown short coated dog sitting on brown wooden chair",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683129613576-cb27862274c2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Two-Drawer Filing Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141318297-75a3d8e86476?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Two-Drawer Filing Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with sheesham veneer"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Glass Front Curio Cabinet",
    "description": "Slim glazed cabinet with internal lighting for displaying collectables.",
    "price": 68000,
    "hidePrice": true,
    "category": "Cabinets",
    "slug": "glass-front-curio-cabinet",
    "sku": "AF-CAB-1030",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1683129618086-4c87d263b48b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Glass Front Curio Cabinet — Modern interior of living room with wooden dresser and white armchair 3d rendering",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1544691560-fc2053d97726?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGNhYmluZXQlMjBzdG9yYWdlJTIwZnVybml0dXJlfGVufDB8fHx8MTc4NTkzNzU4M3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Glass Front Curio Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1532588213355-52317771cce6?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y2FiaW5ldCUyMHN0b3JhZ2UlMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3NTgzfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Glass Front Curio Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with sheesham veneer"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Floating Wall TV Unit",
    "description": "A wall-mounted console that keeps the floor clear and hides cabling behind the panel.",
    "price": 58000,
    "hidePrice": true,
    "category": "TV Units",
    "slug": "floating-wall-tv-unit",
    "sku": "AF-TV--1031",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141392308-aaa39d916686?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Floating Wall TV Unit — Smart Tv Mockup hanging on the wooden wall, living room. 3d rendering",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1631679893114-7957e44879db?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Floating Wall TV Unit — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1681236323432-3df82be0c1b0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Floating Wall TV Unit — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with matte finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Sheesham TV Console",
    "description": "Solid sheesham console with two drawers and open shelving for devices.",
    "price": 82000,
    "hidePrice": true,
    "category": "TV Units",
    "slug": "sheesham-tv-console",
    "sku": "AF-TV--1032",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham TV Console — turned-off flat screen TV",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1724582586508-8f06117dc979?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham TV Console — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1636206508343-a6c955887476?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham TV Console — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with matte finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Modern Media Wall Unit",
    "description": "A full media wall combining closed storage, open shelves and a TV recess.",
    "price": 148000,
    "hidePrice": true,
    "category": "TV Units",
    "slug": "modern-media-wall-unit",
    "sku": "AF-TV--1033",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1584280795027-321f4d68e77b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Modern Media Wall Unit — black flat screen tv on white wooden tv rack",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1681236323432-3df82be0c1b0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Modern Media Wall Unit — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1724582586470-85422853ad61?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHR2JTIwdW5pdCUyMG1lZGlhJTIwY29uc29sZSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTk0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Modern Media Wall Unit — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with matte finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Compact TV Stand",
    "description": "A small-footprint stand for bedrooms and studies, fitting screens up to 43 inches.",
    "price": 32000,
    "hidePrice": true,
    "category": "TV Units",
    "slug": "compact-tv-stand",
    "sku": "AF-TV--1034",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1738168259543-d0c58e2b91ed?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact TV Stand — A living room with a large television on a wall",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1636206508343-a6c955887476?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact TV Stand — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141392308-aaa39d916686?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact TV Stand — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with matte finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Entertainment Center with Storage",
    "description": "Generous drawers and cupboards for consoles, controllers and cables.",
    "price": 105000,
    "hidePrice": true,
    "category": "TV Units",
    "slug": "entertainment-center-with-storage",
    "sku": "AF-TV--1035",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1663811397219-c572550dffc5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entertainment Center with Storage — a room with a couch and a tv",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1724582586470-85422853ad61?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHR2JTIwdW5pdCUyMG1lZGlhJTIwY29uc29sZSUyMGxpdmluZyUyMHJvb218ZW58MHx8fHwxNzg1OTM3NTk0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entertainment Center with Storage — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dHYlMjB1bml0JTIwbWVkaWElMjBjb25zb2xlJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODU5Mzc1OTR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entertainment Center with Storage — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with matte finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Adjustable Swivel Bar Stool",
    "description": "Gas-lift height adjustment and a full swivel, with a footrest ring.",
    "price": 22000,
    "hidePrice": true,
    "category": "Bar Stools",
    "slug": "adjustable-swivel-bar-stool",
    "sku": "AF-BAR-1036",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1671269942067-bb709a81273c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Adjustable Swivel Bar Stool — a kitchen with a counter top and stools",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1779278547541-370129cc09f7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Adjustable Swivel Bar Stool — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1651980951664-7c3f82a1b788?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Adjustable Swivel Bar Stool — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Metal frame with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Wooden Counter Stool",
    "description": "A backless solid-wood stool that tucks fully under a counter.",
    "price": 15000,
    "hidePrice": true,
    "category": "Bar Stools",
    "slug": "wooden-counter-stool",
    "sku": "AF-BAR-1037",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Wooden Counter Stool — two brown wooden bar stools",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1782898623070-490783c8ef0d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Wooden Counter Stool — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1684445034763-a424df9913b5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Wooden Counter Stool — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Metal frame with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Industrial Metal Bar Stool",
    "description": "Powder-coated steel with a distressed finish and a shaped seat.",
    "price": 17500,
    "hidePrice": true,
    "category": "Bar Stools",
    "slug": "industrial-metal-bar-stool",
    "sku": "AF-BAR-1038",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1782898623036-203c18390257?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Industrial Metal Bar Stool — Stylish brown leather bar stools next to a counter.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1651980951664-7c3f82a1b788?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Industrial Metal Bar Stool — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1767773796788-eec9640ccfc0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGJhciUyMHN0b29sJTIwa2l0Y2hlbiUyMGNvdW50ZXJ8ZW58MHx8fHwxNzg1OTM3NjA0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Industrial Metal Bar Stool — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Metal frame with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Upholstered Backrest Stool",
    "description": "A padded seat and low back for longer sitting at a breakfast bar.",
    "price": 26000,
    "hidePrice": true,
    "category": "Bar Stools",
    "slug": "upholstered-backrest-stool",
    "sku": "AF-BAR-1039",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1771365155377-d58bdc1e09b2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Backrest Stool — Two wooden bar stools at a counter",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1684445034763-a424df9913b5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Backrest Stool — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1671269942067-bb709a81273c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Backrest Stool — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Metal frame with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Rattan Kitchen Stool",
    "description": "Woven rattan seat on a light timber frame — informal and hard-wearing.",
    "price": 19500,
    "hidePrice": true,
    "category": "Bar Stools",
    "slug": "rattan-kitchen-stool",
    "sku": "AF-BAR-1040",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1661915960808-877b2b8760cc?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Kitchen Stool — 3d render of luxury house kitchen and bar counter",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1767773796788-eec9640ccfc0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGJhciUyMHN0b29sJTIwa2l0Y2hlbiUyMGNvdW50ZXJ8ZW58MHx8fHwxNzg1OTM3NjA0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Kitchen Stool — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YmFyJTIwc3Rvb2wlMjBraXRjaGVuJTIwY291bnRlcnxlbnwwfHx8fDE3ODU5Mzc2MDR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Kitchen Stool — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Metal frame with upholstered seat"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "4-Tier Wooden Shoe Rack",
    "description": "Four open tiers holding roughly sixteen pairs, with a ventilated back.",
    "price": 18000,
    "hidePrice": true,
    "category": "Shoe Racks",
    "slug": "4-tier-wooden-shoe-rack",
    "sku": "AF-SHO-1041",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1733514691441-4f293f52d27c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "4-Tier Wooden Shoe Rack — A room with a bench and a window",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1785870500429-c40dc0892918?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "4-Tier Wooden Shoe Rack — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1749704008853-713f9064dbec?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "4-Tier Wooden Shoe Rack — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood and metal"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Closed Shoe Cabinet",
    "description": "Tilt-out doors keep footwear out of sight in a narrow hallway.",
    "price": 34000,
    "hidePrice": true,
    "category": "Shoe Racks",
    "slug": "closed-shoe-cabinet",
    "sku": "AF-SHO-1042",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1780529596044-b09085d34602?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Closed Shoe Cabinet — Traditional japanese entryway with wooden shoe rack and window.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1776482128060-dc64101dbb65?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Closed Shoe Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1675616575361-dee0c05a3113?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Closed Shoe Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood and metal"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Entryway Bench Shoe Rack",
    "description": "A padded bench to sit on while changing shoes, with racking beneath.",
    "price": 28000,
    "hidePrice": true,
    "category": "Shoe Racks",
    "slug": "entryway-bench-shoe-rack",
    "sku": "AF-SHO-1043",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1785064038050-696fb9ee2fe9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entryway Bench Shoe Rack — Worn leather boots under bench in sunlit hallway",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1749704008853-713f9064dbec?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entryway Bench Shoe Rack — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1752061289543-de2e7720b029?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHNob2UlMjByYWNrJTIwc3RvcmFnZSUyMGVudHJ5d2F5fGVufDB8fHx8MTc4NTkzNzYxNHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entryway Bench Shoe Rack — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood and metal"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Slim Vertical Shoe Organizer",
    "description": "A tall, narrow tower for tight entryways where floor space is scarce.",
    "price": 21000,
    "hidePrice": true,
    "category": "Shoe Racks",
    "slug": "slim-vertical-shoe-organizer",
    "sku": "AF-SHO-1044",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1752606300966-a991b182d2d5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Slim Vertical Shoe Organizer — Shoes and a box sit by the door.",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1675616575361-dee0c05a3113?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Slim Vertical Shoe Organizer — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1733514691441-4f293f52d27c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Slim Vertical Shoe Organizer — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood and metal"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Metal Frame Shoe Stand",
    "description": "A light powder-coated frame that assembles in minutes and wipes clean.",
    "price": 12500,
    "hidePrice": true,
    "category": "Shoe Racks",
    "slug": "metal-frame-shoe-stand",
    "sku": "AF-SHO-1045",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1670076515936-f501bff79b18?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Metal Frame Shoe Stand — a room with a bed and a door",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1752061289543-de2e7720b029?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHNob2UlMjByYWNrJTIwc3RvcmFnZSUyMGVudHJ5d2F5fGVufDB8fHx8MTc4NTkzNzYxNHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Metal Frame Shoe Stand — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1780529596044-b09085d34602?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c2hvZSUyMHJhY2slMjBzdG9yYWdlJTIwZW50cnl3YXl8ZW58MHx8fHwxNzg1OTM3NjE0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Metal Frame Shoe Stand — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood and metal"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "5-Tier Sheesham Bookcase",
    "description": "Five deep shelves in solid sheesham, braced to carry a full load of books.",
    "price": 68000,
    "hidePrice": true,
    "category": "Bookcases",
    "slug": "5-tier-sheesham-bookcase",
    "sku": "AF-BOO-1046",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1681488394409-5614ef55488c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "5-Tier Sheesham Bookcase — elegant reading room with library and armchair for relaxing. space for text. 3d rendering",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1677462679593-97b817fb118a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "5-Tier Sheesham Bookcase — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1614620026694-f5f38182ab9f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "5-Tier Sheesham Bookcase — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Ladder Style Bookshelf",
    "description": "A leaning ladder shelf with graduated depths — light and easy to move.",
    "price": 32000,
    "hidePrice": true,
    "category": "Bookcases",
    "slug": "ladder-style-bookshelf",
    "sku": "AF-BOO-1047",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1603058817990-2b9a9abbce86?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ladder Style Bookshelf — brown wooden book shelf with books",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1617283410420-76fd3d910621?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ladder Style Bookshelf — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1704686580778-680853cd8d29?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Ladder Style Bookshelf — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Corner Book Unit",
    "description": "Turns an unused corner into five levels of storage.",
    "price": 38000,
    "hidePrice": true,
    "category": "Bookcases",
    "slug": "corner-book-unit",
    "sku": "AF-BOO-1048",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1625053376622-e462848c453f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Corner Book Unit — brown wooden book shelves with books",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1614620026694-f5f38182ab9f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Corner Book Unit — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1700308234428-c619d7408fbd?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGJvb2tzaGVsZiUyMGJvb2tjYXNlJTIwbGlicmFyeXxlbnwwfHx8fDE3ODU5Mzc2Mjh8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Corner Book Unit — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Glass Door Library Cabinet",
    "description": "Glazed doors keep dust off books and papers while leaving them visible.",
    "price": 92000,
    "hidePrice": true,
    "category": "Bookcases",
    "slug": "glass-door-library-cabinet",
    "sku": "AF-BOO-1049",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1739133086794-6424277dbfd0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Glass Door Library Cabinet — A book shelf filled with lots of books",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1704686580778-680853cd8d29?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Glass Door Library Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1681488394409-5614ef55488c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Glass Door Library Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Wall Mounted Floating Shelf Set",
    "description": "A set of three floating shelves with concealed brackets.",
    "price": 16500,
    "hidePrice": true,
    "category": "Bookcases",
    "slug": "wall-mounted-floating-shelf-set",
    "sku": "AF-BOO-1050",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1695942301094-472c4dbf9130?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Wall Mounted Floating Shelf Set — a wooden table with a book on it in front of a bookshelf",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1700308234428-c619d7408fbd?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGJvb2tzaGVsZiUyMGJvb2tjYXNlJTIwbGlicmFyeXxlbnwwfHx8fDE3ODU5Mzc2Mjh8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Wall Mounted Floating Shelf Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1603058817990-2b9a9abbce86?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Ym9va3NoZWxmJTIwYm9va2Nhc2UlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NTkzNzYyOHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Wall Mounted Floating Shelf Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Executive Sheesham Desk",
    "description": "A wide executive desk with a drawer pedestal and a modesty panel.",
    "price": 145000,
    "hidePrice": true,
    "category": "Office Desks",
    "slug": "executive-sheesham-desk",
    "sku": "AF-OFF-1051",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1683309563514-aff14da6c40d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Executive Sheesham Desk — a desk with a keyboard, a mouse, and a notebook",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Executive Sheesham Desk — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Executive Sheesham Desk — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham with engineered wood top"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Compact Work-from-Home Desk",
    "description": "A small desk that fits a laptop, monitor and notebook without dominating a room.",
    "price": 38000,
    "hidePrice": true,
    "category": "Office Desks",
    "slug": "compact-work-from-home-desk",
    "sku": "AF-OFF-1052",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1519219788971-8d9797e0928e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact Work-from-Home Desk — gray balanced-arm lamp on brown wooden table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact Work-from-Home Desk — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1661290409459-f06002ea077e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact Work-from-Home Desk — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham with engineered wood top"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "L-Shaped Corner Desk",
    "description": "Two work surfaces at right angles, giving room for dual monitors.",
    "price": 88000,
    "hidePrice": true,
    "category": "Office Desks",
    "slug": "l-shaped-corner-desk",
    "sku": "AF-OFF-1053",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "L-Shaped Corner Desk — MacBook Pro, white ceramic mug,and black smartphone on table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "L-Shaped Corner Desk — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1437419764061-2473afe69fc2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG9mZmljZSUyMGRlc2slMjB3b3Jrc3BhY2UlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NjQyfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "L-Shaped Corner Desk — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham with engineered wood top"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Standing Height Adjustable Desk",
    "description": "Adjusts between sitting and standing height for long working days.",
    "price": 125000,
    "hidePrice": true,
    "category": "Office Desks",
    "slug": "standing-height-adjustable-desk",
    "sku": "AF-OFF-1054",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Standing Height Adjustable Desk — brown wooden table and chairs",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1661290409459-f06002ea077e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Standing Height Adjustable Desk — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683309563514-aff14da6c40d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Standing Height Adjustable Desk — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham with engineered wood top"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Student Study Desk with Drawers",
    "description": "A hard-wearing study desk with three drawers and a book shelf above.",
    "price": 42000,
    "hidePrice": true,
    "category": "Office Desks",
    "slug": "student-study-desk-with-drawers",
    "sku": "AF-OFF-1055",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1711051475177-1ebe1594a9c3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Student Study Desk with Drawers — a laptop computer sitting on top of a wooden table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1437419764061-2473afe69fc2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG9mZmljZSUyMGRlc2slMjB3b3Jrc3BhY2UlMjB3b29kZW58ZW58MHx8fHwxNzg1OTM3NjQyfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Student Study Desk with Drawers — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1519219788971-8d9797e0928e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8b2ZmaWNlJTIwZGVzayUyMHdvcmtzcGFjZSUyMHdvb2RlbnxlbnwwfHx8fDE3ODU5Mzc2NDJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Student Study Desk with Drawers — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Sheesham with engineered wood top"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Entryway Console Table",
    "description": "A slim console for keys and post, with a shelf below for baskets.",
    "price": 44000,
    "hidePrice": true,
    "category": "Console Tables",
    "slug": "entryway-console-table",
    "sku": "AF-CON-1056",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1734543931990-c40c832fa671?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entryway Console Table — A room with a wooden floor and a coat rack",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1784651859206-f45977db8823?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entryway Console Table — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1784653549130-67586c49f016?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Entryway Console Table — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid wood with metal accents"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Marble Top Console",
    "description": "A polished marble top over a slender metal frame.",
    "price": 78000,
    "hidePrice": true,
    "category": "Console Tables",
    "slug": "marble-top-console",
    "sku": "AF-CON-1057",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1777305293159-70adab4ea6ef?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Marble Top Console — Modern hallway with decorative wall hangings and plants.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1771354959667-96360bf59eab?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Marble Top Console — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1751297026087-5bf8a77310f1?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Marble Top Console — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid wood with metal accents"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Slim Hallway Console",
    "description": "Only 30 cm deep, so it fits a narrow corridor without obstruction.",
    "price": 36000,
    "hidePrice": true,
    "category": "Console Tables",
    "slug": "slim-hallway-console",
    "sku": "AF-CON-1058",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1765766599670-a625d0fef258?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Slim Hallway Console — Modern hallway with mirrored doors and sleek furniture",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1784653549130-67586c49f016?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Slim Hallway Console — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1758279745605-1e03b0d62613?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGNvbnNvbGUlMjB0YWJsZSUyMGVudHJ5d2F5JTIwaGFsbHdheXxlbnwwfHx8fDE3ODU5Mzc2NTJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Slim Hallway Console — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid wood with metal accents"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Carved Wooden Console",
    "description": "Traditional carved apron and turned legs in a warm stain.",
    "price": 62000,
    "hidePrice": true,
    "category": "Console Tables",
    "slug": "carved-wooden-console",
    "sku": "AF-CON-1059",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1785535573604-62e31f0fd341?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Carved Wooden Console — A round mirror above a wooden console table with decor.",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1751297026087-5bf8a77310f1?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Carved Wooden Console — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1734543931990-c40c832fa671?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Carved Wooden Console — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid wood with metal accents"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Console with Drawer Storage",
    "description": "Three drawers keep clutter out of sight at the front door.",
    "price": 54000,
    "hidePrice": true,
    "category": "Console Tables",
    "slug": "console-with-drawer-storage",
    "sku": "AF-CON-1060",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1736194029197-9aee24e44525?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Console with Drawer Storage — A living room with a round mirror on the wall",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1758279745605-1e03b0d62613?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGNvbnNvbGUlMjB0YWJsZSUyMGVudHJ5d2F5JTIwaGFsbHdheXxlbnwwfHx8fDE3ODU5Mzc2NTJ8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Console with Drawer Storage — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1777305293159-70adab4ea6ef?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y29uc29sZSUyMHRhYmxlJTIwZW50cnl3YXklMjBoYWxsd2F5fGVufDB8fHx8MTc4NTkzNzY1Mnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Console with Drawer Storage — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid wood with metal accents"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Sheesham Bedside Table",
    "description": "A solid sheesham bedside table with one drawer and an open cubby.",
    "price": 24000,
    "hidePrice": true,
    "category": "Nightstands",
    "slug": "sheesham-bedside-table",
    "sku": "AF-NIG-1061",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1670076505460-a6d1a8ecb0f9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham Bedside Table — a room with a bed and a table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1754606581512-222f5ea9d8c9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham Bedside Table — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1752062488003-c15c8e8df6a4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Sheesham Bedside Table — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Two-Drawer Nightstand",
    "description": "Two smooth-running drawers on metal runners, at mattress height.",
    "price": 29000,
    "hidePrice": true,
    "category": "Nightstands",
    "slug": "two-drawer-nightstand",
    "sku": "AF-NIG-1062",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1649194271420-b2ff52418a62?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Two-Drawer Nightstand — a bedside table with a phone on top of it",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1766431015004-6cd4c33ae158?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Two-Drawer Nightstand — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683917067802-ba72faa14006?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Two-Drawer Nightstand — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Round Pedestal Side Table",
    "description": "A small round pedestal table that suits tight spaces beside a bed.",
    "price": 18000,
    "hidePrice": true,
    "category": "Nightstands",
    "slug": "round-pedestal-side-table",
    "sku": "AF-NIG-1063",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1637947148874-5549202425f3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Pedestal Side Table — a white and yellow shelf with two vases on top of it",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1752062488003-c15c8e8df6a4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Pedestal Side Table — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1752062004433-98a3d1b73a98?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG5pZ2h0c3RhbmQlMjBiZWRzaWRlJTIwdGFibGV8ZW58MHx8fHwxNzg1OTM3NjY0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Pedestal Side Table — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Floating Wall Nightstand",
    "description": "Wall-mounted to keep the floor clear — useful in small bedrooms.",
    "price": 21000,
    "hidePrice": true,
    "category": "Nightstands",
    "slug": "floating-wall-nightstand",
    "sku": "AF-NIG-1064",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1767979066227-efe943345c65?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Floating Wall Nightstand — Vintage rotary phone and lamp on nightstand",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683917067802-ba72faa14006?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Floating Wall Nightstand — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1670076505460-a6d1a8ecb0f9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Floating Wall Nightstand — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Mirrored Bedside Cabinet",
    "description": "Mirrored facings bounce light around a darker bedroom.",
    "price": 46000,
    "hidePrice": true,
    "category": "Nightstands",
    "slug": "mirrored-bedside-cabinet",
    "sku": "AF-NIG-1065",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1736194027949-b9ab72b2297b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Mirrored Bedside Cabinet — A bedroom with a bed and a night stand",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1752062004433-98a3d1b73a98?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG5pZ2h0c3RhbmQlMjBiZWRzaWRlJTIwdGFibGV8ZW58MHx8fHwxNzg1OTM3NjY0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Mirrored Bedside Cabinet — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1649194271420-b2ff52418a62?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bmlnaHRzdGFuZCUyMGJlZHNpZGUlMjB0YWJsZXxlbnwwfHx8fDE3ODU5Mzc2NjR8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Mirrored Bedside Cabinet — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "6-Drawer Sheesham Dresser",
    "description": "Six deep drawers across a wide frame — the main clothing store for a bedroom.",
    "price": 132000,
    "hidePrice": true,
    "category": "Dressers",
    "slug": "6-drawer-sheesham-dresser",
    "sku": "AF-DRE-1066",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1683129613576-cb27862274c2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "6-Drawer Sheesham Dresser — Modern interior of living room with wooden cabinet 3d rendering",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1612908317776-a3afde8232fa?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "6-Drawer Sheesham Dresser — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1692451438819-24d1ac92c3eb?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "6-Drawer Sheesham Dresser — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Dressing Table with Mirror",
    "description": "A dressing table with a pivoting mirror and a shallow jewellery drawer.",
    "price": 78000,
    "hidePrice": true,
    "category": "Dressers",
    "slug": "dressing-table-with-mirror",
    "sku": "AF-DRE-1067",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1544691560-fc2053d97726?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Dressing Table with Mirror — brown wooden drawer chest",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1683731332610-23d833f5871f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Dressing Table with Mirror — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683121820976-d90c558311bd?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Dressing Table with Mirror — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Tallboy Chest of Drawers",
    "description": "A tall, narrow five-drawer chest for rooms without floor width to spare.",
    "price": 88000,
    "hidePrice": true,
    "category": "Dressers",
    "slug": "tallboy-chest-of-drawers",
    "sku": "AF-DRE-1068",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1698953704644-6fb636c6389d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Tallboy Chest of Drawers — a wooden chest of drawers sitting in front of a store",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1692451438819-24d1ac92c3eb?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Tallboy Chest of Drawers — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1656690099910-237ce0e574fe?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGRyZXNzZXIlMjBjaGVzdCUyMG9mJTIwZHJhd2Vyc3xlbnwwfHx8fDE3ODU5Mzc2Nzd8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Tallboy Chest of Drawers — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Compact 3-Drawer Chest",
    "description": "A small chest that works beside a bed or inside a wardrobe bay.",
    "price": 42000,
    "hidePrice": true,
    "category": "Dressers",
    "slug": "compact-3-drawer-chest",
    "sku": "AF-DRE-1069",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1579283111509-855c7eea1c49?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact 3-Drawer Chest — brown wooden lowboy dresser",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683121820976-d90c558311bd?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact 3-Drawer Chest — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1683129613576-cb27862274c2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Compact 3-Drawer Chest — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Vanity Dresser with Stool",
    "description": "Includes a matching upholstered stool that tucks fully underneath.",
    "price": 96000,
    "hidePrice": true,
    "category": "Dressers",
    "slug": "vanity-dresser-with-stool",
    "sku": "AF-DRE-1070",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1683141434978-7ee72f385a9b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Vanity Dresser with Stool — Interior of living room with wooden sideboard and blank mock up poster frame 3d rendering",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1656690099910-237ce0e574fe?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGRyZXNzZXIlMjBjaGVzdCUyMG9mJTIwZHJhd2Vyc3xlbnwwfHx8fDE3ODU5Mzc2Nzd8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Vanity Dresser with Stool — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1544691560-fc2053d97726?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZHJlc3NlciUyMGNoZXN0JTIwb2YlMjBkcmF3ZXJzfGVufDB8fHx8MTc4NTkzNzY3N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Vanity Dresser with Stool — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid sheesham"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Solid Wood Dining Bench",
    "description": "Seats three along a dining table and slides underneath when not in use.",
    "price": 38000,
    "hidePrice": true,
    "category": "Benches",
    "slug": "solid-wood-dining-bench",
    "sku": "AF-BEN-1071",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1714675673807-9a495cb15267?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Solid Wood Dining Bench — a wooden table with a vase on top of it",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1620429408060-423d98bf9092?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Solid Wood Dining Bench — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1596702337959-2fcaf14d21e7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Solid Wood Dining Bench — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Upholstered Entryway Bench",
    "description": "A padded bench in hard-wearing fabric for pulling shoes on and off.",
    "price": 32000,
    "hidePrice": true,
    "category": "Benches",
    "slug": "upholstered-entryway-bench",
    "sku": "AF-BEN-1072",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1571062618385-7cf10f16a2f4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Entryway Bench — brown wooden board",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1595541465802-ceccad3c168e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Entryway Bench — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1768597134391-f9756d798cf4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Upholstered Entryway Bench — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Storage Bench with Lid",
    "description": "A hinged lid opens onto deep storage for blankets or toys.",
    "price": 44000,
    "hidePrice": true,
    "category": "Benches",
    "slug": "storage-bench-with-lid",
    "sku": "AF-BEN-1073",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1573079883023-62fc208b9d75?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Storage Bench with Lid — empty gray wooden park bench",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1596702337959-2fcaf14d21e7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Storage Bench with Lid — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1742196644161-1ab5c8d25180?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHdvb2RlbiUyMGJlbmNoJTIwZnVybml0dXJlfGVufDB8fHx8MTc4NTkzNzY4Nnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Storage Bench with Lid — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Garden Teak Bench",
    "description": "Weather-resistant teak that silvers gracefully if left untreated.",
    "price": 68000,
    "hidePrice": true,
    "category": "Benches",
    "slug": "garden-teak-bench",
    "sku": "AF-BEN-1074",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1613287509996-4a2613ee887a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Garden Teak Bench — brown wooden bench on brown soil",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1768597134391-f9756d798cf4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Garden Teak Bench — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1714675673807-9a495cb15267?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Garden Teak Bench — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Bedroom End-of-Bed Bench",
    "description": "A long, low bench sized to sit at the foot of a king bed.",
    "price": 36000,
    "hidePrice": true,
    "category": "Benches",
    "slug": "bedroom-end-of-bed-bench",
    "sku": "AF-BEN-1075",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1681449856049-ccaefa9927e8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bedroom End-of-Bed Bench — a wooden bench sitting in front of a white wall",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1742196644161-1ab5c8d25180?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHdvb2RlbiUyMGJlbmNoJTIwZnVybml0dXJlfGVufDB8fHx8MTc4NTkzNzY4Nnww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bedroom End-of-Bed Bench — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1571062618385-7cf10f16a2f4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d29vZGVuJTIwYmVuY2glMjBmdXJuaXR1cmV8ZW58MHx8fHwxNzg1OTM3Njg2fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bedroom End-of-Bed Bench — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Solid hardwood"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Full Length Standing Mirror",
    "description": "A leaning full-length mirror with a solid wood frame and safety backing.",
    "price": 42000,
    "hidePrice": true,
    "category": "Mirrors",
    "slug": "full-length-standing-mirror",
    "sku": "AF-MIR-1076",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1681980018817-b36ab8848616?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Full Length Standing Mirror — a mirror and a vase on a table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1617228206053-477863025d9c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Full Length Standing Mirror — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1513716875652-59c99449ee70?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Full Length Standing Mirror — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Silvered glass with wooden frame"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Round Wall Mirror",
    "description": "A simple round mirror with a slim metal rim — works in any room.",
    "price": 22000,
    "hidePrice": true,
    "category": "Mirrors",
    "slug": "round-wall-mirror",
    "sku": "AF-MIR-1077",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1595455967759-5f1356993e53?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Wall Mirror — black framed wall mounted mirror",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1619213348491-b7b7602727f9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Wall Mirror — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1674758184821-f315bfbcdbc0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Wall Mirror — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Silvered glass with wooden frame"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Carved Frame Wall Mirror",
    "description": "A hand-carved timber frame around a bevelled glass panel.",
    "price": 54000,
    "hidePrice": true,
    "category": "Mirrors",
    "slug": "carved-frame-wall-mirror",
    "sku": "AF-MIR-1078",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1606241018160-4985a8ab5dec?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Carved Frame Wall Mirror — gold and silver steel wall decor",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1513716875652-59c99449ee70?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Carved Frame Wall Mirror — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1631701601945-414a32dbef47?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHdhbGwlMjBtaXJyb3IlMjBpbnRlcmlvciUyMGRlY29yfGVufDB8fHx8MTc4NTkzNzcwMHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Carved Frame Wall Mirror — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Silvered glass with wooden frame"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Bathroom Vanity Mirror",
    "description": "Moisture-resistant backing and a frame finished to resist steam.",
    "price": 18000,
    "hidePrice": true,
    "category": "Mirrors",
    "slug": "bathroom-vanity-mirror",
    "sku": "AF-MIR-1079",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bathroom Vanity Mirror — black and brown wooden table with chairs",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1674758184821-f315bfbcdbc0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bathroom Vanity Mirror — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1681980018817-b36ab8848616?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bathroom Vanity Mirror — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Silvered glass with wooden frame"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Decorative Sunburst Mirror",
    "description": "A radiating sunburst frame that reads as wall art as much as a mirror.",
    "price": 34000,
    "hidePrice": true,
    "category": "Mirrors",
    "slug": "decorative-sunburst-mirror",
    "sku": "AF-MIR-1080",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1681449855986-61d3f05063ca?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Decorative Sunburst Mirror — a white chair and a large mirror in a room",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1631701601945-414a32dbef47?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHdhbGwlMjBtaXJyb3IlMjBpbnRlcmlvciUyMGRlY29yfGVufDB8fHx8MTc4NTkzNzcwMHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Decorative Sunburst Mirror — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1595455967759-5f1356993e53?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d2FsbCUyMG1pcnJvciUyMGludGVyaW9yJTIwZGVjb3J8ZW58MHx8fHwxNzg1OTM3NzAwfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Decorative Sunburst Mirror — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Silvered glass with wooden frame"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Single Seater Recliner",
    "description": "A single recliner with a smooth manual mechanism and a padded footrest.",
    "price": 78000,
    "hidePrice": true,
    "category": "Recliners",
    "slug": "single-seater-recliner",
    "sku": "AF-REC-1081",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1669740216429-9dc5b9376969?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Single Seater Recliner — a man lying on a chair",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1702865071803-cb154cd45f48?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Single Seater Recliner — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1780764818642-7447d9858332?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Single Seater Recliner — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Hardwood frame with leatherette"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Leather Push-Back Recliner",
    "description": "Push-back action with no lever, wrapped in soft leatherette.",
    "price": 92000,
    "hidePrice": true,
    "category": "Recliners",
    "slug": "leather-push-back-recliner",
    "sku": "AF-REC-1082",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1765896387427-e04e04cb4464?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Leather Push-Back Recliner — A tabby cat rests on a yellow patterned armchair.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1761469194706-ca0ad26dc7e3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Leather Push-Back Recliner — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1673277598692-9668e7f1a43e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Leather Push-Back Recliner — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Hardwood frame with leatherette"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Rocking Recliner Chair",
    "description": "Rocks gently upright and reclines fully — good for nursing and reading.",
    "price": 105000,
    "hidePrice": true,
    "category": "Recliners",
    "slug": "rocking-recliner-chair",
    "sku": "AF-REC-1083",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1714872245785-674ae3038d21?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rocking Recliner Chair — a living room with a couch, chair and television",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1780764818642-7447d9858332?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rocking Recliner Chair — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1758915753395-a5dddea1d813?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHJlY2xpbmVyJTIwYXJtY2hhaXIlMjBsb3VuZ2V8ZW58MHx8fHwxNzg1OTM3NzExfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rocking Recliner Chair — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Hardwood frame with leatherette"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "2-Seater Recliner Sofa",
    "description": "Two independently reclining seats sharing a central console.",
    "price": 168000,
    "hidePrice": true,
    "category": "Recliners",
    "slug": "2-seater-recliner-sofa",
    "sku": "AF-REC-1084",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1518975555701-c6c56f3e650b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "2-Seater Recliner Sofa — woman reading with magazine beside filled green ceramic coffee cup",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1673277598692-9668e7f1a43e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "2-Seater Recliner Sofa — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1669740216429-9dc5b9376969?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "2-Seater Recliner Sofa — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Hardwood frame with leatherette"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Manual Lounge Recliner",
    "description": "A deep lounge recliner with a high back and generous armrests.",
    "price": 88000,
    "hidePrice": true,
    "category": "Recliners",
    "slug": "manual-lounge-recliner",
    "sku": "AF-REC-1085",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1673277598674-0c08eb81c013?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Manual Lounge Recliner — a green chair sitting on top of a hard wood floor",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1758915753395-a5dddea1d813?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHJlY2xpbmVyJTIwYXJtY2hhaXIlMjBsb3VuZ2V8ZW58MHx8fHwxNzg1OTM3NzExfDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Manual Lounge Recliner — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1765896387427-e04e04cb4464?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cmVjbGluZXIlMjBhcm1jaGFpciUyMGxvdW5nZXxlbnwwfHx8fDE3ODU5Mzc3MTF8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Manual Lounge Recliner — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Hardwood frame with leatherette"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Patio Dining Set",
    "description": "A four-seat outdoor dining set in treated timber with a parasol hole.",
    "price": 128000,
    "hidePrice": true,
    "category": "Outdoor Furniture",
    "slug": "patio-dining-set",
    "sku": "AF-OUT-1086",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1689609949905-0d27dac6c38e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Patio Dining Set — a deck with chairs and potted plants on it",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1693643449872-67f203f99560?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Patio Dining Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1762608675427-09ac2dbd1540?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Patio Dining Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Treated teak and weatherproof rattan"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Rattan Garden Sofa Set",
    "description": "All-weather synthetic rattan with quick-dry cushions.",
    "price": 165000,
    "hidePrice": true,
    "category": "Outdoor Furniture",
    "slug": "rattan-garden-sofa-set",
    "sku": "AF-OUT-1087",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Garden Sofa Set — brown wooden table and chairs",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1666217394671-327373f1bd4d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Garden Sofa Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1668073437554-b48d66e9f368?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Rattan Garden Sofa Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Treated teak and weatherproof rattan"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Teak Outdoor Bench",
    "description": "Solid teak that stands up to sun and rain without a cover.",
    "price": 62000,
    "hidePrice": true,
    "category": "Outdoor Furniture",
    "slug": "teak-outdoor-bench",
    "sku": "AF-OUT-1088",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1617887021567-fe8d2480bd96?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Teak Outdoor Bench — black and gray chairs and table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1762608675427-09ac2dbd1540?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Teak Outdoor Bench — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1718096551438-6f8e53069457?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG91dGRvb3IlMjBwYXRpbyUyMGZ1cm5pdHVyZSUyMGdhcmRlbnxlbnwwfHx8fDE3ODU5Mzc3MjN8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Teak Outdoor Bench — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Treated teak and weatherproof rattan"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Folding Balcony Table Set",
    "description": "Folds flat against a wall when the balcony is needed for something else.",
    "price": 34000,
    "hidePrice": true,
    "category": "Outdoor Furniture",
    "slug": "folding-balcony-table-set",
    "sku": "AF-OUT-1089",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1621506821950-f5c98fa9ff62?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Folding Balcony Table Set — brown wooden table and chairs",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1668073437554-b48d66e9f368?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Folding Balcony Table Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1689609949905-0d27dac6c38e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Folding Balcony Table Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Treated teak and weatherproof rattan"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Poolside Lounger",
    "description": "An adjustable-back lounger with a wipe-clean weatherproof finish.",
    "price": 48000,
    "hidePrice": true,
    "category": "Outdoor Furniture",
    "slug": "poolside-lounger",
    "sku": "AF-OUT-1090",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1671910904777-c2a982549bfd?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Poolside Lounger — a living room with a couch and a coffee table",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1718096551438-6f8e53069457?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG91dGRvb3IlMjBwYXRpbyUyMGZ1cm5pdHVyZSUyMGdhcmRlbnxlbnwwfHx8fDE3ODU5Mzc3MjN8MA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Poolside Lounger — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8b3V0ZG9vciUyMHBhdGlvJTIwZnVybml0dXJlJTIwZ2FyZGVufGVufDB8fHx8MTc4NTkzNzcyM3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Poolside Lounger — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Treated teak and weatherproof rattan"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Kids Bunk Bed",
    "description": "A sturdy bunk with a full-length guard rail and an integrated ladder.",
    "price": 118000,
    "hidePrice": true,
    "category": "Kids Furniture",
    "slug": "kids-bunk-bed",
    "sku": "AF-KID-1091",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1684164600683-6ecb6c9c0eb7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Bunk Bed — a child's bedroom with a bed and a painting easel",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1769690398735-88d840c9228c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Bunk Bed — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1714966393897-edc99af881e7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Bunk Bed — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with child-safe finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Children's Study Table Set",
    "description": "A height-appropriate desk and chair pair for homework years.",
    "price": 38000,
    "hidePrice": true,
    "category": "Kids Furniture",
    "slug": "children-s-study-table-set",
    "sku": "AF-KID-1092",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1763478958800-3a2a6321f645?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Children's Study Table Set — Cozy child's bedroom with bed and desk.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1556265617-02021d9b0fa5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Children's Study Table Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1684263443153-f2ebe2fb9553?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Children's Study Table Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with child-safe finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Toy Storage Unit",
    "description": "Open bins at child height so tidying up is actually achievable.",
    "price": 32000,
    "hidePrice": true,
    "category": "Kids Furniture",
    "slug": "toy-storage-unit",
    "sku": "AF-KID-1093",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1780042731982-b8db1a86bfcf?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Toy Storage Unit — Teddy bear on bedside table with floral bedding and wallpaper.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1714966393897-edc99af881e7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Toy Storage Unit — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1780042731951-3885599aafa9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGtpZHMlMjByb29tJTIwZnVybml0dXJlJTIwY2hpbGRyZW4lMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzczNHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Toy Storage Unit — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with child-safe finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Kids Single Bed with Drawers",
    "description": "A single bed with two storage drawers built into the base.",
    "price": 72000,
    "hidePrice": true,
    "category": "Kids Furniture",
    "slug": "kids-single-bed-with-drawers",
    "sku": "AF-KID-1094",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1769690399035-2f4e60edf2ea?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Single Bed with Drawers — A cozy bedroom with a teddy bear on a bench.",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1684263443153-f2ebe2fb9553?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Single Bed with Drawers — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1684164600683-6ecb6c9c0eb7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Kids Single Bed with Drawers — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with child-safe finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Play Table and Chair Set",
    "description": "A low table with two small chairs, rounded at every edge.",
    "price": 26000,
    "hidePrice": true,
    "category": "Kids Furniture",
    "slug": "play-table-and-chair-set",
    "sku": "AF-KID-1095",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1685152326415-815ab8503736?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Play Table and Chair Set — a child's room with a book shelf and toys",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1780042731951-3885599aafa9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGtpZHMlMjByb29tJTIwZnVybml0dXJlJTIwY2hpbGRyZW4lMjBiZWRyb29tfGVufDB8fHx8MTc4NTkzNzczNHww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Play Table and Chair Set — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1763478958800-3a2a6321f645?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8a2lkcyUyMHJvb20lMjBmdXJuaXR1cmUlMjBjaGlsZHJlbiUyMGJlZHJvb218ZW58MHx8fHwxNzg1OTM3NzM0fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Play Table and Chair Set — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Engineered wood with child-safe finish"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  },
  {
    "name": "Velvet Storage Ottoman",
    "description": "A padded lid lifts to reveal storage — footrest and blanket box in one.",
    "price": 34000,
    "hidePrice": true,
    "category": "Ottoman & Poufs",
    "slug": "velvet-storage-ottoman",
    "sku": "AF-OTT-1096",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1664699106353-fdd2ddd86bd8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Velvet Storage Ottoman — a white stool sitting on top of a carpeted floor",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1690618299438-cb453b14bab3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Velvet Storage Ottoman — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1593195150503-8e2a51338ff2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Velvet Storage Ottoman — detail view",
        "isPrimary": false
      }
    ],
    "stock": 3,
    "featured": true,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Upholstered foam with hardwood base"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.3,
    "reviews": 4
  },
  {
    "name": "Round Fabric Pouf",
    "description": "A light round pouf that moves easily for extra seating.",
    "price": 16000,
    "hidePrice": true,
    "category": "Ottoman & Poufs",
    "slug": "round-fabric-pouf",
    "sku": "AF-OTT-1097",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1612372603963-403340a8942b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Fabric Pouf — gray and black chair beside white wall",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1690618299433-8d0ba9a0f341?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Fabric Pouf — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1673548916469-cfcc10981d0b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Round Fabric Pouf — detail view",
        "isPrimary": false
      }
    ],
    "stock": 10,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Upholstered foam with hardwood base"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.9,
    "reviews": 15
  },
  {
    "name": "Leather Footstool",
    "description": "A compact leatherette footstool that pairs with an armchair.",
    "price": 22000,
    "hidePrice": true,
    "category": "Ottoman & Poufs",
    "slug": "leather-footstool",
    "sku": "AF-OTT-1098",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1784126689194-0b07c65e3353?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Leather Footstool — Textured dark red surface with subtle light.",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1593195150503-8e2a51338ff2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Leather Footstool — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1568598617558-79e56547418f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG90dG9tYW4lMjBwb3VmJTIwZm9vdHN0b29sfGVufDB8fHx8MTc4NTkzNzc0N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Leather Footstool — detail view",
        "isPrimary": false
      }
    ],
    "stock": 17,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Upholstered foam with hardwood base"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.8,
    "reviews": 26
  },
  {
    "name": "Woven Jute Pouf",
    "description": "Hand-woven natural jute with a firm structured filling.",
    "price": 18500,
    "hidePrice": true,
    "category": "Ottoman & Poufs",
    "slug": "woven-jute-pouf",
    "sku": "AF-OTT-1099",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1726463450351-4b603da0f507?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Woven Jute Pouf — A blue ottoman sitting in front of a mirror",
        "isPrimary": true
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1673548916469-cfcc10981d0b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Woven Jute Pouf — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://plus.unsplash.com/premium_photo-1664699106353-fdd2ddd86bd8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Woven Jute Pouf — detail view",
        "isPrimary": false
      }
    ],
    "stock": 6,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Upholstered foam with hardwood base"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.7,
    "reviews": 37
  },
  {
    "name": "Bench Ottoman with Tray",
    "description": "A long ottoman with a reversible tray top for drinks.",
    "price": 42000,
    "hidePrice": true,
    "category": "Ottoman & Poufs",
    "slug": "bench-ottoman-with-tray",
    "sku": "AF-OTT-1100",
    "images": [
      {
        "url": "https://plus.unsplash.com/premium_photo-1674815329902-b7f159e5d15f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bench Ottoman with Tray — a couple of stools sitting on top of a floor",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1568598617558-79e56547418f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG90dG9tYW4lMjBwb3VmJTIwZm9vdHN0b29sfGVufDB8fHx8MTc4NTkzNzc0N3ww&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bench Ottoman with Tray — alternate view",
        "isPrimary": false
      },
      {
        "url": "https://images.unsplash.com/photo-1612372603963-403340a8942b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8b3R0b21hbiUyMHBvdWYlMjBmb290c3Rvb2x8ZW58MHx8fHwxNzg1OTM3NzQ3fDA&ixlib=rb-4.1.0&w=1200&h=900&fit=crop&q=80&fm=jpg",
        "alt": "Bench Ottoman with Tray — detail view",
        "isPrimary": false
      }
    ],
    "stock": 13,
    "featured": false,
    "variants": [
      {
        "name": "Finish",
        "values": [
          "Natural",
          "Walnut",
          "Espresso"
        ]
      },
      {
        "name": "Size",
        "values": [
          "Standard",
          "Custom"
        ]
      }
    ],
    "specifications": [
      {
        "name": "Material",
        "value": "Upholstered foam with hardwood base"
      },
      {
        "name": "Finish",
        "value": "Hand-polished, matte lacquer"
      },
      {
        "name": "Assembly",
        "value": "Delivered assembled within Gojra"
      },
      {
        "name": "Warranty",
        "value": "1 year against manufacturing defects"
      },
      {
        "name": "Made to order",
        "value": "Custom sizes and finishes available"
      }
    ],
    "rating": 4.6,
    "reviews": 8
  }
];
