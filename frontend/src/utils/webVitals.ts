type VitalName = 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB';

interface VitalMetric {
  name: VitalName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  ts: number;
}

const storageKey = 'ashraf_web_vitals';

const getRating = (name: VitalName, value: number): VitalMetric['rating'] => {
  switch (name) {
    case 'LCP':
      if (value <= 2500) return 'good';
      if (value <= 4000) return 'needs-improvement';
      return 'poor';
    case 'CLS':
      if (value <= 0.1) return 'good';
      if (value <= 0.25) return 'needs-improvement';
      return 'poor';
    case 'INP':
      if (value <= 200) return 'good';
      if (value <= 500) return 'needs-improvement';
      return 'poor';
    case 'FCP':
      if (value <= 1800) return 'good';
      if (value <= 3000) return 'needs-improvement';
      return 'poor';
    case 'TTFB':
      if (value <= 800) return 'good';
      if (value <= 1800) return 'needs-improvement';
      return 'poor';
    default:
      return 'needs-improvement';
  }
};

const saveMetric = (name: VitalName, value: number) => {
  const metric: VitalMetric = {
    name,
    value: Number(value.toFixed(name === 'CLS' ? 4 : 0)),
    rating: getRating(name, value),
    ts: Date.now(),
  };

  try {
    const current = sessionStorage.getItem(storageKey);
    const all: VitalMetric[] = current ? JSON.parse(current) : [];
    const withoutSame = all.filter((m) => m.name !== metric.name);
    sessionStorage.setItem(storageKey, JSON.stringify([...withoutSame, metric]));
  } catch {
    // Ignore storage errors silently
  }
};

export const initWebVitals = () => {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  // TTFB (from Navigation Timing)
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav) {
    saveMetric('TTFB', nav.responseStart);
  }

  // FCP
  try {
    const poFcp = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          saveMetric('FCP', entry.startTime);
          poFcp.disconnect();
        }
      }
    });
    poFcp.observe({ type: 'paint', buffered: true });
  } catch {
    // Browser does not support this metric observer
  }

  // LCP
  try {
    let lcpValue = 0;
    const poLcp = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) lcpValue = lastEntry.startTime;
    });
    poLcp.observe({ type: 'largest-contentful-paint', buffered: true });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && lcpValue > 0) {
        saveMetric('LCP', lcpValue);
        poLcp.disconnect();
      }
    });
  } catch {
    // Browser does not support this metric observer
  }

  // CLS
  try {
    let cls = 0;
    const poCls = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
        if (!entry.hadRecentInput && entry.value) {
          cls += entry.value;
        }
      }
      saveMetric('CLS', cls);
    });
    poCls.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Browser does not support this metric observer
  }

  // INP (best-effort via event observer)
  try {
    let worstInteraction = 0;
    const poEvent = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as Array<PerformanceEntry & { duration?: number }>) {
        if (entry.duration && entry.duration > worstInteraction) {
          worstInteraction = entry.duration;
        }
      }
      if (worstInteraction > 0) saveMetric('INP', worstInteraction);
    });
    poEvent.observe({ type: 'event', durationThreshold: 40, buffered: true } as PerformanceObserverInit);
  } catch {
    // Browser does not support this metric observer
  }
};
