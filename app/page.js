"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import FavoritesDrawer from "../components/FavoritesDrawer";
import CategorySection from "../components/CategorySection";
import CategoryPicker from "../components/CategoryPicker";
import AdCarousel from "../components/AdCarousel";
import { ArrowUpDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { subscribeCategories, subscribeProducts } from "../lib/firestore";

export default function HomePage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
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

  const searched = search.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : products;

  const filtered = [...searched].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    const ratingA = a.ratingCount ? a.ratingSum / a.ratingCount : 0;
    const ratingB = b.ratingCount ? b.ratingSum / b.ratingCount : 0;
    if (sortMode === "price_asc") return priceA - priceB;
    if (sortMode === "price_desc") return priceB - priceA;
    if (sortMode === "rating_desc") return ratingB - ratingA;
    return 0;
  });

  return (
    <div className="min-h-screen">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onFavoritesOpen={() => setFavoritesOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="px-5 py-6 max-w-[1100px] mx-auto pb-16">
        <AdCarousel />

        <div className="bg-gradient-to-br from-primary to-primaryDark rounded-2xl p-9 text-white mb-8">
          <div className="font-display text-3xl mb-2 max-w-lg">
            {t("hero_title")}
          </div>
          <div className="text-white/75 text-[15px] max-w-md">
            {t("hero_subtitle")}
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
            {t("no_categories")}
          </div>
        )}

        {!loading && !search.trim() && (
          <CategoryPicker categories={categories} products={products} />
        )}

        {!loading && products.length > 0 && (
          <div className="flex items-center justify-end gap-2 mb-4">
            <ArrowUpDown size={14} className="text-muted" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="border border-border rounded-lg px-3 py-1.5 text-sm bg-white"
            >
              <option value="default">{t("sort_default")}</option>
              <option value="price_asc">{t("sort_price_asc")}</option>
              <option value="price_desc">{t("sort_price_desc")}</option>
              <option value="rating_desc">{t("sort_rating")}</option>
            </select>
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
            &quot;{search}&quot; {t("no_search_results")}
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        products={products}
      />
    </div>
  );
}
