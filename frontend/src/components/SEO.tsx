import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
  canonical?: string;
  noindex?: boolean;
}

/**
 * SEO Component - Optimized for performance and search engines
 * Handles: Title, Meta descriptions, Open Graph, Twitter Cards, Product markup
 */
export default function SEO({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  price,
  currency = 'PKR',
  availability,
  canonical,
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  
  // Site defaults (optimized for SEO)
  const siteTitle = 'Ashraf Furnitures - Premium Furniture Collection';
  const defaultDescription = 'Explore our curated furniture selection for quality and style. Transform your space with premium furniture from Ashraf Furnitures - sofas, dining tables, bedroom sets, and more.';
  const defaultKeywords = ['furniture', 'home furniture', 'office furniture', 'premium furniture', 'ashraf furnitures'];
  
  // Build final values
  const finalTitle = title ? `${title} | Ashraf Furnitures` : siteTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...new Set([...keywords, ...defaultKeywords])];
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = `${siteUrl}${location.pathname}`;
  const finalImage = image || `${siteUrl}/Mini.png`;
  const finalCanonical = canonical || currentUrl;

  useEffect(() => {
    // Safely update document title
    if (typeof document !== 'undefined') {
      document.title = finalTitle;
    }

    // Helper to update or create meta tags
    const updateMetaTag = (selector: string, content: string, isProperty = false) => {
      if (typeof document === 'undefined') return;
      
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${selector}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update canonical link
    const updateCanonical = (href: string) => {
      if (typeof document === 'undefined') return;
      
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // Basic SEO Meta Tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords.join(', '));
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Open Graph Tags (Facebook, LinkedIn)
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Ashraf Furnitures', true);

    // Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);

    // Product-specific tags
    if (type === 'product' && price !== undefined) {
      updateMetaTag('product:price:amount', price.toString(), true);
      updateMetaTag('product:price:currency', currency, true);
      if (availability) {
        updateMetaTag('product:availability', availability, true);
      }
    }

    // Canonical URL  
    updateCanonical(finalCanonical);

  }, [finalTitle, finalDescription, finalKeywords, finalImage, currentUrl, finalCanonical, type, price, currency, availability, noindex]);

  // This component doesn't render anything visible
  return null;
}
