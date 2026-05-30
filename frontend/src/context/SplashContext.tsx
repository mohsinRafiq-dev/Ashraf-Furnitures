import React, { createContext, useContext, useState, useCallback } from "react";

interface SplashContextType {
  showSplash: boolean;
  splashComplete: boolean;
  completeSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

const SPLASH_SHOWN_KEY = 'splash_shown_v1';
// Show again at most once every 24h to remind returning users of the brand
// without nagging same-day visitors.
const SPLASH_TTL_MS = 24 * 60 * 60 * 1000;

const shouldShowSplash = (): boolean => {
  try {
    const lastShown = localStorage.getItem(SPLASH_SHOWN_KEY);
    if (!lastShown) return true;
    const elapsed = Date.now() - Number(lastShown);
    return Number.isNaN(elapsed) || elapsed > SPLASH_TTL_MS;
  } catch {
    return true;
  }
};

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);
  const [splashComplete, setSplashComplete] = useState(() => !shouldShowSplash());

  const completeSplash = useCallback(() => {
    setShowSplash(false);
    setSplashComplete(true);
    try {
      localStorage.setItem(SPLASH_SHOWN_KEY, String(Date.now()));
    } catch {
      /* private mode, ignore */
    }
  }, []);

  return (
    <SplashContext.Provider
      value={{ showSplash, splashComplete, completeSplash }}
    >
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error("useSplash must be used within SplashProvider");
  }
  return context;
}
