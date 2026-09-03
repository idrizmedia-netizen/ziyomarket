import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import MobileNav from "../components/MobileNav";

export const metadata = {
  title: "ZiyoMarket",
  description: "Ishonchli sotuvchilar, qulay narxlar — ZiyoMarket'da.",
  manifest: "/manifest.json",
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
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <ServiceWorkerRegister />
        <MobileNav />
      </body>
    </html>
  );
}
