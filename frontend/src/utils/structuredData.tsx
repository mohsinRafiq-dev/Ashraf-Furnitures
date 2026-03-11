/**
 * Structured Data (JSON-LD) for SEO
 * Generates schema.org markup for better search engine understanding
 */

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  sku?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Organization Schema - Shows business info in search results
 */
export const generateOrganizationSchema = () => {
  const siteUrl = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'Ashraf Furnitures',
    description: 'Premium furniture collection for home and office. Quality craftsmanship and modern designs.',
    url: siteUrl,
    logo: `${siteUrl}/Asset 5.png`,
    image: `${siteUrl}/Mini.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
      addressLocality: 'Your City', // Update with actual location
    },
    sameAs: [
      'https://www.facebook.com/ashraffarnitures',
      'https://www.instagram.com/ashraffarnitures',
      'https://www.tiktok.com/@ashraffarnitures',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Urdu'],
    },
    priceRange: '$$',
  };
};

/**
 * Website Schema - Defines the website structure
 */
export const generateWebsiteSchema = () => {
  const siteUrl = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ashraf Furnitures',
    url: siteUrl,
    description: 'Premium furniture collection for quality and style',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Product Schema - Rich snippets for products in search results
 */
export const generateProductSchema = (product: Product) => {
  const siteUrl = window.location.origin;
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Ashraf Furnitures',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'PKR',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: `${siteUrl}/product/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'Ashraf Furnitures',
      },
    },
  };

  // Add SKU if available
  if (product.sku) {
    schema.sku = product.sku;
  }

  // Add category if available
  if (product.category) {
    schema.category = product.category;
  }

  // Add rating and review if available
  if (product.rating && product.reviewCount && product.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
};

/**
 * Breadcrumb Schema - Shows navigation path in search results
 */
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const siteUrl = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
};

/**
 * ItemList Schema - For product listings and category pages
 */
export const generateItemListSchema = (products: Product[], listName: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'PKR',
        },
      },
    })),
  };
};

/**
 * FAQ Schema - For about page or FAQ sections
 */
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Component to inject JSON-LD structured data into page
 */
interface StructuredDataProps {
  data: object | object[];
}

export function StructuredData({ data }: StructuredDataProps) {
  const schemas = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
