import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { StructuredData, generateBreadcrumbSchema } from '../utils/structuredData';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component with Schema.org markup for SEO
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbsFromPath(location.pathname);

  // Always include Home at the beginning
  const fullBreadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', path: '/' },
    ...breadcrumbItems.filter(item => item.path !== '/'),
  ];

  // Generate structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema(
    fullBreadcrumbs.map(item => ({
      name: item.name,
      url: item.path,
    }))
  );

  return (
    <>
      {/* Inject structured data */}
      <StructuredData data={breadcrumbSchema} />
      
      {/* Breadcrumb UI */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        {fullBreadcrumbs.map((item, index) => {
          const isLast = index === fullBreadcrumbs.length - 1;
          const isHome = index === 0;

          return (
            <div key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}
              
              {isLast ? (
                <span className="text-gray-900 font-medium flex items-center">
                  {isHome && <Home className="w-4 h-4 mr-1" />}
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-amber-600 transition-colors flex items-center"
                >
                  {isHome && <Home className="w-4 h-4 mr-1" />}
                  {!isHome && item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

/**
 * Generate breadcrumbs from URL path
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    
    // Capitalize and format segment name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      name,
      path: currentPath,
    });
  });

  return breadcrumbs;
}
