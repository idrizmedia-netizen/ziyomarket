"use client";

import { useState } from "react";
import { Star, ShoppingCart, BadgeCheck, Heart } from "lucide-react";
import ProductImage from "./ProductImage";
import ProductDetailModal from "./ProductDetailModal";
import { formatSum } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const [showDetail, setShowDetail] = useState(false);
  const favorite = isFavorite(product.id);
  const inCart = cart.find((i) => i.productId === product.id);
  const remaining = product.qty - (inCart ? inCart.qty : 0);
  const lowStock = remaining > 0 && remaining <= 3;
  const avg = product.ratingCount ? product.ratingSum / product.ratingCount : 0;
  const discountPct =
    product.discountPrice && product.price
      ? Math.round(100 - (product.discountPrice / product.price) * 100)
      : 0;

  return (
    <>
      <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden group">
        <div className="relative cursor-pointer" onClick={() => setShowDetail(true)}>
          <ProductImage src={product.image} alt={product.name} height={160} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          {lowStock && (
            <span className="absolute top-2 left-2 bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
              {t("low_stock")}
            </span>
          )}
          {discountPct > 0 && (
            <span className="absolute top-2 right-2 bg-danger text-white text-[11px] font-extrabold px-2 py-1 rounded-full shadow">
              -{discountPct}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow"
          >
            <Heart
              size={14}
              className={favorite ? "text-danger fill-danger" : "text-muted"}
            />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 p-3 flex-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {product.discountPrice ? (
              <>
                <span className="text-[12px] text-muted line-through">{formatSum(product.price)}</span>
                <span className="text-lg font-extrabold text-danger">
                  {formatSum(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-extrabold text-primary">{formatSum(product.price)}</span>
            )}
          </div>

          <div
            className="text-sm font-medium leading-snug line-clamp-2 cursor-pointer text-ink"
            onClick={() => setShowDetail(true)}
          >
            {product.name}
          </div>

          <div className="flex items-center justify-between mt-0.5">
            {product.ratingCount > 0 ? (
              <div className="flex items-center gap-1">
                <Star size={12} className="text-accent fill-accent" />
                <span className="text-[11px] text-muted font-medium">
                  {avg.toFixed(1)} ({product.ratingCount})
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-muted flex items-center gap-1">
                <BadgeCheck size={12} className="text-success" /> {t("new_badge")}
              </span>
            )}
            <span className="text-[11px] text-muted whitespace-nowrap">
              {Math.max(remaining, 0)} {t("unit")}
            </span>
          </div>

          <button
            disabled={remaining <= 0}
            onClick={() => addToCart(product.id, product.qty)}
            className={`mt-1.5 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-bold transition-all ${
              remaining <= 0
                ? "bg-[#E4E0D5] text-muted cursor-not-allowed"
                : "bg-primary text-white hover:bg-primaryDark active:scale-95"
            }`}
          >
            <ShoppingCart size={14} />
            {remaining <= 0 ? t("out_of_stock") : t("add_to_cart")}
          </button>
        </div>
      </div>

      {showDetail && (
        <ProductDetailModal product={product} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
