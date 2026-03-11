/**
 * Sitemap Generator Utility
 * Generates XML sitemap for search engines
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate sitemap XML
 */
export const generateSitemap = (urls: SitemapUrl[]): string => {
  const sitemapHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapFooter = '</urlset>';

  const urlEntries = urls
    .map((url) => {
      let entry = `\n  <url>\n    <loc>${url.loc}</loc>`;
      
      if (url.lastmod) {
        entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
      }
      
      if (url.changefreq) {
        entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
      }
      
      if (url.priority !== undefined) {
        entry += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
      }
      
      entry += '\n  </url>';
      return entry;
    })
    .join('');

  return `${sitemapHeader}${urlEntries}\n${sitemapFooter}`;
};

/**
 * Get static routes for sitemap
 */
export const getStaticRoutes = (siteUrl: string): SitemapUrl[] => {
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      loc: siteUrl,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${siteUrl}/products`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${siteUrl}/categories`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${siteUrl}/search`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.6,
    },
    {
      loc: `${siteUrl}/cart`,
      changefreq: 'always',
      priority: 0.5,
    },
    {
      loc: `${siteUrl}/wishlist`,
      changefreq: 'always',
      priority: 0.5,
    },
  ];
};

/**
 * Generate product URLs for sitemap
 */
export const getProductUrls = (
  products: Array<{ id: string; slug?: string; updatedAt?: Date | string }>,
  siteUrl: string
): SitemapUrl[] => {
  return products.map((product) => ({
    loc: `${siteUrl}/product/${product.id}`,
    lastmod: product.updatedAt 
      ? new Date(product.updatedAt).toISOString().split('T')[0]
      : undefined,
    changefreq: 'weekly' as const,
    priority: 0.8,
  }));
};

/**
 * Generate category URLs for sitemap
 */
export const getCategoryUrls = (
  categories: Array<{ slug: string; name: string; updatedAt?: Date | string }>,
  siteUrl: string
): SitemapUrl[] => {
  return categories.map((category) => ({
    loc: `${siteUrl}/categories/${category.slug}`,
    lastmod: category.updatedAt
      ? new Date(category.updatedAt).toISOString().split('T')[0]
      : undefined,
    changefreq: 'weekly' as const,
    priority: 0.7,
  }));
};

/**
 * Example usage:
 * 
 * import { generateSitemap, getStaticRoutes, getProductUrls, getCategoryUrls } from './sitemap';
 * 
 * const siteUrl = 'https://yourdomain.com';
 * const products = await getProducts();
 * const categories = await getCategories();
 * 
 * const urls = [
 *   ...getStaticRoutes(siteUrl),
 *   ...getProductUrls(products, siteUrl),
 *   ...getCategoryUrls(categories, siteUrl),
 * ];
 * 
 * const sitemapXml = generateSitemap(urls);
 * // Save or serve this XML
 */
