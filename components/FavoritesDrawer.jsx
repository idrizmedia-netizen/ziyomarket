"use client";

import { X, Heart, ShoppingCart } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function FavoritesDrawer({ open, onClose, products }) {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  if (!open) return null;

  const items = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[340px] max-w-[90vw] bg-bg h-full p-5 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="font-display text-xl flex items-center gap-2">
            <Heart size={18} className="text-danger fill-danger" />
            {t("favorites_title")}
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-muted text-sm mt-5">{t("favorites_empty")}</div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-2.5 border border-border flex gap-2.5"
              >
                <div className="w-16 shrink-0">
                  <ProductImage src={p.image} alt={p.name} height={64} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold line-clamp-1">{p.name}</div>
                  <div className="text-[13px] text-primary font-bold">
                    {formatSum(p.discountPrice || p.price)}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => addToCart(p.id, p.qty)}
                      className="flex items-center gap-1 bg-primary text-white rounded-full px-3 py-1 text-[11px] font-semibold"
                    >
                      <ShoppingCart size={11} />
                      Savatchaga
                    </button>
                    <button onClick={() => toggleFavorite(p.id)} className="text-danger">
                      <Heart size={15} className="fill-danger" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
