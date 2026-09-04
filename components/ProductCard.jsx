"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import ProductImage from "./ProductImage";
import ProductDetailModal from "./ProductDetailModal";
import { formatSum } from "../lib/utils";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const [showDetail, setShowDetail] = useState(false);
  const inCart = cart.find((i) => i.productId === product.id);
  const remaining = product.qty - (inCart ? inCart.qty : 0);
  const lowStock = remaining > 0 && remaining <= 3;
  const avg = product.ratingCount ? product.ratingSum / product.ratingCount : 0;

  return (
    <>
      <div className="bg-white rounded-2xl p-3 border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2 relative overflow-hidden">
        <div className="relative cursor-pointer" onClick={() => setShowDetail(true)}>
          <ProductImage src={product.image} alt={product.name} />
          {lowStock && (
            <span className="absolute top-1.5 left-1.5 bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Kam qoldi
            </span>
          )}
          {product.discountPrice && (
            <span className="absolute top-1.5 right-1.5 bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Chegirma
            </span>
          )}
        </div>

        <div
          className="text-sm font-semibold leading-snug line-clamp-2 cursor-pointer"
          onClick={() => setShowDetail(true)}
        >
          {product.name}
        </div>

        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-accent fill-accent" />
            <span className="text-[11px] text-muted">
              {avg.toFixed(1)} ({product.ratingCount})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {product.discountPrice ? (
            <span className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-muted line-through">{formatSum(product.price)}</span>
              <span className="text-[15px] font-bold text-danger">
                {formatSum(product.discountPrice)}
              </span>
            </span>
          ) : (
            <span className="text-[15px] font-bold text-primary">{formatSum(product.price)}</span>
          )}
          <span className="text-[11px] text-muted">{Math.max(remaining, 0)} ta</span>
        </div>

        <button
          disabled={remaining <= 0}
          onClick={() => addToCart(product.id, product.qty)}
          className={`mt-0.5 rounded-xl py-2.5 text-[13px] font-bold transition-colors ${
            remaining <= 0
              ? "bg-[#E4E0D5] text-muted cursor-not-allowed"
              : "bg-primary text-white hover:bg-primaryDark"
          }`}
        >
          {remaining <= 0 ? "Tugagan" : "Savatchaga qo'shish"}
        </button>
      </div>

      {showDetail && (
        <ProductDetailModal product={product} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
