import React, { createContext, useContext, useState, useCallback } from "react";

interface SplashContextType {
  showSplash: boolean;
  splashComplete: boolean;
  completeSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

const SPLASH_SHOWN_KEY = 'splash_shown';

export function SplashProvider({ children }: { children: React.ReactNode }) {
  // Check if splash was already shown in this session
  const [showSplash, setShowSplash] = useState(() => {
    const wasShown = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    return wasShown !== 'true';
  });
  const [splashComplete, setSplashComplete] = useState(false);

  const completeSplash = useCallback(() => {
    setShowSplash(false);
    setSplashComplete(true);
    // Mark splash as shown in this session
    sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
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
