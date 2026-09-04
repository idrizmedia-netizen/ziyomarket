"use client";

import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const inCart = cart.find((i) => i.productId === product.id);
  const remaining = product.qty - (inCart ? inCart.qty : 0);
  const lowStock = remaining > 0 && remaining <= 3;

  return (
    <div className="bg-white rounded-2xl p-3 border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2 relative overflow-hidden">
      <div className="relative">
        <ProductImage src={product.image} alt={product.name} />
        {lowStock && (
          <span className="absolute top-1.5 left-1.5 bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Kam qoldi
          </span>
        )}
      </div>
      <div className="text-sm font-semibold leading-snug line-clamp-2">{product.name}</div>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-primary">{formatSum(product.price)}</span>
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
  );
}
