/**
 * Performance Monitoring Utilities
 * Track and log performance metrics
 */

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private enabled: boolean;

  constructor() {
    // Only enable in development
    this.enabled = import.meta.env.DEV;
  }

  /**
   * Start tracking a performance metric
   * @param name Metric name
   */
  start(name: string): void {
    if (!this.enabled) return;
    this.metrics.set(name, performance.now());
  }

  /**
   * End tracking and log the duration
   * @param name Metric name
   * @param shouldLog Whether to log to console
   */
  end(name: string, shouldLog: boolean = true): number | null {
    if (!this.enabled) return null;

    const startTime = this.metrics.get(name);
    if (!startTime) {
      console.warn(`Performance metric "${name}" was never started`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);

    if (shouldLog) {
      const color = duration < 100 ? 'green' : duration < 500 ? 'orange' : 'red';
      console.log(
        `%c⚡ ${name}: ${duration.toFixed(2)}ms`,
        `color: ${color}; font-weight: bold`
      );
    }

    return duration;
  }

  /**
   * Measure function execution time
   * @param name Metric name
   * @param fn Function to measure
   */
  async measure<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    if (!this.enabled) {
      return await fn();
    }

    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Log Core Web Vitals when available
   */
  logWebVitals(): void {
    if (!this.enabled || typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      console.log(`%c🎨 FCP: ${fcp.startTime.toFixed(2)}ms`, 'color: blue; font-weight: bold');
    }

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            console.log(`%c📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`, 'color: purple; font-weight: bold');
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

  /**
   * Get navigation timing metrics
   */
  getNavigationMetrics(): Record<string, number> | null {
    if (typeof window === 'undefined' || !window.performance?.timing) {
      return null;
    }

    const timing = window.performance.timing;
    const navigation = {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      domProcessing: timing.domComplete - timing.domLoading,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      ttfb: timing.responseStart - timing.navigationStart, // Time to First Byte
    };

    if (this.enabled) {
      console.group('📈 Navigation Timing');
      Object.entries(navigation).forEach(([key, value]) => {
        console.log(`${key}: ${value}ms`);
      });
      console.groupEnd();
    }

    return navigation;
  }
}

// Singleton instance
export const perfMonitor = new PerformanceMonitor();

// Log web vitals when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    perfMonitor.logWebVitals();
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        perfMonitor.logWebVitals();
        perfMonitor.getNavigationMetrics();
      }, 0);
    });
  }
}

/**
 * React Hook for performance tracking
 */
export const usePerformance = (name: string) => {
  const start = () => perfMonitor.start(name);
  const end = () => perfMonitor.end(name);
  const measure = <T,>(fn: () => T | Promise<T>) => perfMonitor.measure(name, fn);

  return { start, end, measure };
};
