import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import MobileNav from "../components/MobileNav";
import OrderStatusWatcher from "../components/OrderStatusWatcher";

// Firebase faqat brauzerda ishlaydi — shuning uchun sahifalar build vaqtida
// oldindan statik qilib tayyorlanmasin, har doim so'rov kelganda ishlasin.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "ZiyoMarket",
  description: "Ishonchli sotuvchilar, qulay narxlar — ZiyoMarket'da.",
  manifest: "/manifest.json",
  openGraph: {
    title: "ZiyoMarket",
    description: "Ishonchli sotuvchilar, qulay narxlar — ZiyoMarket'da.",
    images: ["/icon-512.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZiyoMarket",
    description: "Ishonchli sotuvchilar, qulay narxlar — ZiyoMarket'da.",
    images: ["/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#233457",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <CartProvider>
                <FavoritesProvider>{children}</FavoritesProvider>
              </CartProvider>
              <MobileNav />
              <OrderStatusWatcher />
            </LanguageProvider>
          </AuthProvider>
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
