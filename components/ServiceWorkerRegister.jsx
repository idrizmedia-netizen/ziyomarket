"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // jim turamiz — SW ishlamasa ham sayt oddiy ishlayveradi
      });
    }
  }, []);
  return null;
}
