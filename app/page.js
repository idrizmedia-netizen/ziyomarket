"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import CategorySection from "../components/CategorySection";
import CategoryPicker from "../components/CategoryPicker";
import AdCarousel from "../components/AdCarousel";
import { subscribeCategories, subscribeProducts } from "../lib/firestore";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubCats = subscribeCategories(setCategories);
    const unsubProds = subscribeProducts((p) => {
      setProducts(p);
      setLoading(false);
    });
    return () => {
      unsubCats();
      unsubProds();
    };
  }, []);

  const filtered = search.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : products;

  return (
    <div className="min-h-screen">
      <Header
        onCartOpen={() => setCartOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="px-5 py-6 max-w-[1100px] mx-auto pb-16">
        <AdCarousel />

        <div className="bg-gradient-to-br from-primary to-primaryDark rounded-2xl p-9 text-white mb-8">
          <div className="font-display text-3xl mb-2 max-w-lg">
            Kerakli narsangizni ZiyoMarket'dan toping
          </div>
          <div className="text-white/75 text-[15px] max-w-md">
            Ishonchli sotuvchilar, qulay narxlar va tezkor yetkazib berish — barchasi bir joyda.
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-border animate-pulse">
                <div className="w-full h-[150px] rounded-lg bg-[#F0EBE0]" />
                <div className="h-3 bg-[#F0EBE0] rounded mt-3 w-4/5" />
                <div className="h-3 bg-[#F0EBE0] rounded mt-2 w-2/5" />
                <div className="h-8 bg-[#F0EBE0] rounded-full mt-3" />
              </div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-muted text-center py-10">
            Hozircha bo'limlar qo'shilmagan.
          </div>
        )}

        {!loading && !search.trim() && (
          <CategoryPicker categories={categories} products={products} />
        )}

        {!loading &&
          categories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              products={filtered.filter((p) => p.categoryId === cat.id)}
            />
          ))}

        {!loading && search.trim() && filtered.length === 0 && (
          <div className="text-muted text-center py-10">
            &quot;{search}&quot; bo&apos;yicha hech narsa topilmadi.
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </div>
  );
}
