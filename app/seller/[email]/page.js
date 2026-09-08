"use client";

import { useEffect, useState } from "react";
import { Store, Package, Star, TrendingUp } from "lucide-react";
import Header from "../../../components/Header";
import CartDrawer from "../../../components/CartDrawer";
import FavoritesDrawer from "../../../components/FavoritesDrawer";
import ProductCard from "../../../components/ProductCard";
import Footer from "../../../components/Footer";
import {
  getSellerInfo,
  subscribeSellerProducts,
  subscribeProducts,
} from "../../../lib/firestore";

export default function SellerStorefrontPage({ params }) {
  const email = decodeURIComponent(params.email);
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  useEffect(() => {
    getSellerInfo(email).then(setSeller);
    const unsub1 = subscribeSellerProducts(email, setSellerProducts);
    const unsub2 = subscribeProducts(setAllProducts);
    return () => {
      unsub1();
      unsub2();
    };
  }, [email]);

  const totalSold = sellerProducts.reduce((s, p) => s + (p.soldCount || 0), 0);
  const ratingCount = sellerProducts.reduce((s, p) => s + (p.ratingCount || 0), 0);
  const ratingSum = sellerProducts.reduce((s, p) => s + (p.ratingSum || 0), 0);
  const avgRating = ratingCount ? (ratingSum / ratingCount).toFixed(1) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onFavoritesOpen={() => setFavoritesOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="px-5 py-8 max-w-[1100px] mx-auto flex-1 w-full">
        <div className="bg-gradient-to-br from-primary to-primaryDark rounded-2xl p-7 text-white mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <Store size={28} />
          </div>
          <div>
            <div className="font-display text-2xl">{seller?.name || email}</div>
            <div className="text-white/70 text-sm">ZiyoMarket sotuvchisi</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-border p-4 text-center">
            <Package size={18} className="mx-auto text-primary mb-1" />
            <div className="font-bold">{sellerProducts.length}</div>
            <div className="text-[11px] text-muted">mahsulot</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 text-center">
            <TrendingUp size={18} className="mx-auto text-primary mb-1" />
            <div className="font-bold">{totalSold}</div>
            <div className="text-[11px] text-muted">ta sotilgan</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 text-center">
            <Star size={18} className="mx-auto text-accent mb-1" />
            <div className="font-bold">{avgRating || "—"}</div>
            <div className="text-[11px] text-muted">o&apos;rtacha baho</div>
          </div>
        </div>

        <div className="font-display text-lg mb-3">Mahsulotlari</div>
        {sellerProducts.length === 0 ? (
          <div className="text-muted text-sm">Bu sotuvchi hali mahsulot qo&apos;shmagan.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sellerProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={allProducts} />
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        products={allProducts}
      />
    </div>
  );
}
