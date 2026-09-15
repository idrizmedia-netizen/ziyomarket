import { collection, getDocs } from "firebase/firestore";
import { serverDb } from "../lib/firebase-server";

const BASE_URL = "https://ziyomarket.vercel.app";

export default async function sitemap() {
  const staticRoutes = ["", "/faq", "/terms", "/privacy"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "hourly" : "monthly",
    priority: path === "" ? 1 : 0.5,
  }));

  let productRoutes = [];
  try {
    const snap = await getDocs(collection(serverDb, "products"));
    productRoutes = snap.docs.map((d) => ({
      url: `${BASE_URL}/product/${d.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch (e) {
    /* Firestore vaqtincha ishlamasa ham sitemap bo'sh qolmasin */
  }

  return [...staticRoutes, ...productRoutes];
}
