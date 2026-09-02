import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "ZiyoMarket",
  description: "Ishonchli sotuvchilar, qulay narxlar — ZiyoMarket'da.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
