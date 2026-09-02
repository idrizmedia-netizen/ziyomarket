"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import CategorySection from "../components/CategorySection";
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
        <div className="bg-gradient-to-br from-primary to-primaryDark rounded-2xl p-9 text-white mb-8">
          <div className="font-display text-3xl mb-2 max-w-lg">
            Kerakli narsangizni ZiyoMarket'dan toping
          </div>
          <div className="text-white/75 text-[15px] max-w-md">
            Ishonchli sotuvchilar, qulay narxlar va tezkor yetkazib berish — barchasi bir joyda.
          </div>
        </div>

        {loading && <div className="text-muted text-center py-10">Yuklanmoqda...</div>}

        {!loading && categories.length === 0 && (
          <div className="text-muted text-center py-10">
            Hozircha bo'limlar qo'shilmagan.
          </div>
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
