import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// Collect web vitals after initial render without blocking interactivity.
const win = window as Window & {
  requestIdleCallback?: (callback: () => void, opts?: { timeout: number }) => number;
};

const startVitals = () => {
  import("./utils/webVitals")
    .then((m) => m.initWebVitals())
    .catch(() => {
      // Ignore vitals bootstrap issues
    });
};

if (typeof win.requestIdleCallback === "function") {
  win.requestIdleCallback(startVitals, { timeout: 3000 });
} else {
  window.setTimeout(startVitals, 1500);
}
