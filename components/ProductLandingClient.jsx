"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { subscribeProducts } from "../lib/firestore";
import Header from "./Header";
import ProductImage from "./ProductImage";
import CartDrawer from "./CartDrawer";
import FavoritesDrawer from "./FavoritesDrawer";
import Footer from "./Footer";
import { formatSum } from "../lib/utils";
import { useCart } from "../context/CartContext";

export default function ProductLandingClient({ productId }) {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "products", productId), (snap) => {
      setProduct(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    return () => unsub();
  }, [productId]);

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
      />

      <div className="px-5 py-8 max-w-[600px] mx-auto flex-1 w-full">
        {!product ? (
          <div className="text-center text-muted py-16">
            Mahsulot topilmadi yoki yuklanmoqda...
          </div>
        ) : (
          <>
            <ProductImage src={product.image} alt={product.name} height={280} />
            <div className="font-display text-2xl mt-4">{product.name}</div>
            <div className="text-2xl font-extrabold text-primary mt-2">
              {formatSum(product.discountPrice || product.price)}
            </div>
            {product.description && (
              <p className="text-muted mt-3 leading-relaxed">{product.description}</p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => addToCart(product.id, product.qty)}
                className="flex-1 bg-primary text-white rounded-xl py-3 font-bold"
              >
                Savatchaga qo&apos;shish
              </button>
              <Link
                href={`/?product=${product.id}`}
                className="flex-1 border border-primary text-primary rounded-xl py-3 font-bold text-center"
              >
                Sharh va tafsilotlar
              </Link>
            </div>
          </>
        )}
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
