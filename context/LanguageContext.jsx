"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../lib/translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "ziyomarket_lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("uz");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "uz" || saved === "ru") setLang(saved);
    } catch (e) {
      /* ignore */
    }
  }, []);

  function changeLang(next) {
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function t(key) {
    return translations[lang]?.[key] || translations.uz[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
