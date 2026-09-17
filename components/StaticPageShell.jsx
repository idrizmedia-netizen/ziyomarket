"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import FavoritesDrawer from "./FavoritesDrawer";
import { useEffect } from "react";
import { subscribeProducts } from "../lib/firestore";

export default function StaticPageShell({ title, children }) {
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = subscribeProducts(setProducts);
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onFavoritesOpen={() => setFavoritesOpen(true)}
        search={search}
        onSearchChange={setSearch}
        suggestionsSource={products}
      />

      <div className="px-5 py-8 max-w-[720px] mx-auto flex-1 w-full">
        <h1 className="font-display text-2xl mb-5">{title}</h1>
        <div className="text-sm text-ink leading-relaxed flex flex-col gap-4">{children}</div>
      </div>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        products={products}
      />
    </div>
  );
}
