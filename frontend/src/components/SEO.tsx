import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
  canonical?: string;
  noindex?: boolean;
}

/**
 * SEO Component - Dynamic meta tags for better SEO
 * Handles: Meta tags, Open Graph, Twitter Cards, Canonical URLs
 */
export default function SEO({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  author = 'Ashraf Furnitures',
  publishedTime,
  modifiedTime,
  price,
  currency = 'PKR',
  availability,
  canonical,
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  
  // Default values
  const siteTitle = 'Ashraf Furnitures - Premium Furniture Collection';
  const defaultDescription = 'Explore our curated furniture selection for quality and style. Transform your space with premium furniture from Ashraf Furnitures - sofas, dining tables, bedroom sets, and more.';
  const defaultKeywords = [
    'furniture',
    'home furniture',
    'office furniture',
    'premium furniture',
    'sofas',
    'dining tables',
    'bedroom furniture',
    'living room furniture',
    'quality furniture',
    'modern furniture',
    'ashraf furnitures',
  ];
  const siteUrl = window.location.origin;
  const currentUrl = `${siteUrl}${location.pathname}`;
  const defaultImage = `${siteUrl}/Mini.png`;

  // Combine values
  const finalTitle = title ? `${title} | Ashraf Furnitures` : siteTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...new Set([...keywords, ...defaultKeywords])]; // Remove duplicates
  const finalImage = image || defaultImage;
  const finalCanonical = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Helper function to set meta tag
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic Meta Tags
    setMeta('description', finalDescription);
    setMeta('keywords', finalKeywords.join(', '));
    setMeta('author', author);
    
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Open Graph Meta Tags (for Facebook, LinkedIn, etc.)
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:image', finalImage, true);
    setMeta('og:url', currentUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'Ashraf Furnitures', true);
    setMeta('og:locale', 'en_US', true);

    // Product-specific Open Graph tags
    if (type === 'product' && price !== undefined) {
      setMeta('product:price:amount', price.toString(), true);
      setMeta('product:price:currency', currency, true);
      if (availability) {
        setMeta('product:availability', availability, true);
      }
    }

    // Twitter Card Meta Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', finalImage);
    setMeta('twitter:site', '@ashraffarnitures');
    setMeta('twitter:creator', '@ashraffarnitures');

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        setMeta('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        setMeta('article:modified_time', modifiedTime, true);
      }
      setMeta('article:author', author, true);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);

    // Mobile app meta tags
    setMeta('mobile-web-app-capable', 'yes');
    setMeta('apple-mobile-web-app-capable', 'yes');
    setMeta('apple-mobile-web-app-status-bar-style', 'default');
    setMeta('apple-mobile-web-app-title', 'Ashraf Furnitures');

  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalImage,
    currentUrl,
    finalCanonical,
    type,
    author,
    publishedTime,
    modifiedTime,
    price,
    currency,
    availability,
    noindex,
  ]);

  return null; // This component doesn't render anything
}
