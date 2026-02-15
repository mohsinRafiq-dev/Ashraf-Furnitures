/**
 * Firebase Analytics Service
 * Handles analytics tracking using Firestore.
 * Replaces backend analytics with client-side tracking.
 */

import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== Types ====================

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type TrafficSource = 'direct' | 'search' | 'social' | 'referral' | 'other';
export type ProductAction = 'view' | 'add_to_cart' | 'purchase' | 'wishlist';

export interface VisitorSession {
  id?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  startTime: Timestamp | Date;
  endTime?: Timestamp | Date;
  pageViews: number;
  referrer?: string;
  country?: string;
  city?: string;
  deviceType: DeviceType;
  source: TrafficSource;
}

export interface ProductView {
  id?: string;
  productId: string;
  productName: string;
  sessionId: string;
  userId?: string;
  viewedAt: Timestamp | Date;
  timeSpent: number; // in seconds
  action: ProductAction;
}

// ==================== Helper Functions ====================

/**
 * Generate unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Detect device type
 */
export const detectDeviceType = (): DeviceType => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Detect traffic source
 */
export const detectTrafficSource = (): TrafficSource => {
  const referrer = document.referrer.toLowerCase();
  
  if (!referrer) return 'direct';
  
  if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) {
    return 'search';
  }
  if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('instagram') || referrer.includes('linkedin')) {
    return 'social';
  }
  
  // Check if referrer is same domain
  try {
    const referrerUrl = new URL(referrer);
    const currentUrl = new URL(window.location.href);
    if (referrerUrl.hostname === currentUrl.hostname) {
      return 'direct';
    }
  } catch {
    return 'other';
  }
  
  return 'referral';
};

// ==================== Session Tracking ====================

/**
 * Get or create visitor session
 */
export const getOrCreateSession = async (): Promise<string> => {
  // Check for existing session in sessionStorage
  const existingSessionId = sessionStorage.getItem('visitor_session_id');
  
  if (existingSessionId) {
    // Update page views for existing session
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('sessionId', '==', existingSessionId), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const sessionDoc = snapshot.docs[0];
      await updateDoc(sessionDoc.ref, {
        pageViews: (sessionDoc.data().pageViews || 0) + 1,
        endTime: serverTimestamp()
      });
      return existingSessionId;
    }
  }

  // Create new session
  const sessionId = generateSessionId();
  const sessionData: any = {
    sessionId,
    ipAddress: 'unknown', // Browser doesn't have direct access to IP
    userAgent: navigator.userAgent,
    startTime: serverTimestamp(),
    pageViews: 1,
    deviceType: detectDeviceType(),
    source: detectTrafficSource()
  };

  // Only add referrer if it exists (Firestore doesn't allow undefined)
  if (document.referrer) {
    sessionData.referrer = document.referrer;
  }

  await addDoc(collection(db, 'sessions'), sessionData);
  sessionStorage.setItem('visitor_session_id', sessionId);
  
  return sessionId;
};

/**
 * End current session
 */
export const endSession = async (): Promise<void> => {
  const sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) return;

  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('sessionId', '==', sessionId), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      await updateDoc(snapshot.docs[0].ref, {
        endTime: serverTimestamp()
      });
    }
  } catch (error) {
    // Silently fail - session ending is optional
    console.debug('Session end skipped:', error);
  }
};

// ==================== Product Tracking ====================

/**
 * Track product view
 */
export const trackProductView = async (
  productId: string,
  productName: string,
  action: ProductAction = 'view'
): Promise<void> => {
  try {
    const sessionId = await getOrCreateSession();
    
    const viewData: Omit<ProductView, 'id'> = {
      productId,
      productName,
      sessionId,
      viewedAt: serverTimestamp() as any,
      timeSpent: 0,
      action
    };

    await addDoc(collection(db, 'productViews'), viewData);
  } catch (error) {
    console.debug('Product tracking skipped:', error);
  }
};

/**
 * Track add to cart
 */
export const trackAddToCart = async (productId: string, productName: string): Promise<void> => {
  await trackProductView(productId, productName, 'add_to_cart');
};

/**
 * Track add to wishlist
 */
export const trackAddToWishlist = async (productId: string, productName: string): Promise<void> => {
  await trackProductView(productId, productName, 'wishlist');
};

// ==================== Analytics Queries ====================

/**
 * Get total visitors count
 */
export const getTotalVisitors = async (): Promise<number> => {
  const sessionsRef = collection(db, 'sessions');
  const snapshot = await getDocs(sessionsRef);
  return snapshot.size;
};

/**
 * Get visitors for a specific time period
 */
export const getVisitorsByPeriod = async (startDate: Date, endDate: Date): Promise<number> => {
  const sessionsRef = collection(db, 'sessions');
  const q = query(
    sessionsRef,
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate))
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

/**
 * Get top viewed products
 */
export const getTopProducts = async (limitCount: number = 10) => {
  const viewsRef = collection(db, 'productViews');
  const q = query(viewsRef, orderBy('viewedAt', 'desc'), limit(limitCount * 10)); // Get more to aggregate
  const snapshot = await getDocs(q);

  // Aggregate views by product
  const productViewCounts: { [key: string]: { id: string; name: string; views: number } } = {};
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (!productViewCounts[data.productId]) {
      productViewCounts[data.productId] = {
        id: data.productId,
        name: data.productName,
        views: 0
      };
    }
    productViewCounts[data.productId].views++;
  });

  // Sort by views and return top N
  return Object.values(productViewCounts)
    .sort((a, b) => b.views - a.views)
    .slice(0, limitCount);
};

/**
 * Get traffic sources distribution
 */
export const getTrafficSources = async () => {
  const sessionsRef = collection(db, 'sessions');
  const snapshot = await getDocs(sessionsRef);

  const sources: { [key in TrafficSource]: number } = {
    direct: 0,
    search: 0,
    social: 0,
    referral: 0,
    other: 0
  };

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    sources[data.source as TrafficSource]++;
  });

  const total = snapshot.size || 1;

  return [
    { source: 'Direct', percentage: Math.round((sources.direct / total) * 100), color: 'from-blue-500 to-blue-600' },
    { source: 'Search', percentage: Math.round((sources.search / total) * 100), color: 'from-green-500 to-green-600' },
    { source: 'Social', percentage: Math.round((sources.social / total) * 100), color: 'from-purple-500 to-purple-600' },
    { source: 'Referral', percentage: Math.round((sources.referral / total) * 100), color: 'from-orange-500 to-orange-600' }
  ];
};

/**
 * Get device type distribution
 */
export const getDeviceTypes = async () => {
  const sessionsRef = collection(db, 'sessions');
  const snapshot = await getDocs(sessionsRef);

  const devices: { [key in DeviceType]: number } = {
    mobile: 0,
    tablet: 0,
    desktop: 0
  };

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    devices[data.deviceType as DeviceType]++;
  });

  return devices;
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = async () => {
  try {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalVisitors,
      visitorsThisMonth,
      visitorsThisWeek,
      topProducts,
      trafficSources
    ] = await Promise.all([
      getTotalVisitors(),
      getVisitorsByPeriod(oneMonthAgo, now),
      getVisitorsByPeriod(oneWeekAgo, now),
      getTopProducts(5),
      getTrafficSources()
    ]);

    return {
      totalVisitors,
      visitorsThisMonth,
      visitorsThisWeek,
      topProducts,
      trafficSources
    };
  } catch (error) {
    console.debug('Analytics summary skipped:', error);
    return {
      totalVisitors: 0,
      visitorsThisMonth: 0,
      visitorsThisWeek: 0,
      topProducts: [],
      trafficSources: []
    };
  }
};

/**
 * Get all product analytics with views and actions
 */
export const getProductAnalytics = async () => {
  try {
    const viewsRef = collection(db, 'productViews');
    const snapshot = await getDocs(viewsRef);

    // Aggregate analytics by product
    const productAnalytics: { 
      [key: string]: { 
        id: string; 
        name: string; 
        views: number;
        addToCart: number;
        wishlist: number;
        totalActions: number;
      } 
    } = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      
      if (!productAnalytics[data.productId]) {
        productAnalytics[data.productId] = {
          id: data.productId,
          name: data.productName,
          views: 0,
          addToCart: 0,
          wishlist: 0,
          totalActions: 0
        };
      }

      // Count different action types
      if (data.action === 'view') {
        productAnalytics[data.productId].views++;
      } else if (data.action === 'add_to_cart') {
        productAnalytics[data.productId].addToCart++;
      } else if (data.action === 'wishlist') {
        productAnalytics[data.productId].wishlist++;
      }
      
      productAnalytics[data.productId].totalActions++;
    });

    // Convert to array and sort by total actions
    return Object.values(productAnalytics)
      .sort((a, b) => b.totalActions - a.totalActions);
  } catch (error) {
    console.debug('Product analytics skipped:', error);
    return [];
  }
};

/**
 * Get product analytics by ID
 */
export const getProductAnalyticsById = async (productId: string) => {
  try {
    const viewsRef = collection(db, 'productViews');
    const q = query(viewsRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);

    let views = 0;
    let addToCart = 0;
    let wishlist = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.action === 'view') views++;
      else if (data.action === 'add_to_cart') addToCart++;
      else if (data.action === 'wishlist') wishlist++;
    });

    return {
      productId,
      views,
      addToCart,
      wishlist,
      totalActions: views + addToCart + wishlist
    };
  } catch (error) {
    console.debug('Product analytics by ID skipped:', error);
    return {
      productId,
      views: 0,
      addToCart: 0,
      wishlist: 0,
      totalActions: 0
    };
  }
};

// ==================== Initialize Analytics ====================
/**
 * Initialize analytics tracking
 * Call this on app mount
 */
export const initializeAnalytics = async (): Promise<void> => {
  try {
    await getOrCreateSession();

    // End session on page unload
    window.addEventListener('beforeunload', () => {
      endSession();
    });

    // Update session on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        endSession();
      }
    });
  } catch (error) {
    console.debug('Analytics initialization skipped:', error);
  }
};
