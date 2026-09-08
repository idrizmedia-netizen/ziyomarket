"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "ziyomarket_theme";

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let initial = false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark") initial = true;
      else if (saved === "light") initial = false;
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) initial = true;
    } catch (e) {
      /* ignore */
    }
    setDark(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark, hydrated]);

  function toggleDark() {
    setDark((d) => !d);
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
