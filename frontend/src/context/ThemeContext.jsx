// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Feature Flag State
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

  // 2. Theme State (Check localStorage immediately to prevent flash)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // 3. Check Cookie on Mount
  useEffect(() => {
    const checkCookie = () => {
      const matches = document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("enable_dark_mode=true"));
      setIsFeatureEnabled(matches);
    };
    checkCookie();
  }, []);

  // 4. The "Effect" that actually changes the DOM
  useEffect(() => {
    const root = window.document.documentElement;

    // Safety Guard: If feature is disabled, force light mode and exit
    if (!isFeatureEnabled) {
      root.classList.remove("dark");
      return;
    }

    // Apply the class based on state
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme, isFeatureEnabled]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isFeatureEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook for easy usage
export function useTheme() {
  return useContext(ThemeContext);
}
