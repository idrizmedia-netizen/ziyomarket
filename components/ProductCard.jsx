"use client";

import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const inCart = cart.find((i) => i.productId === product.id);
  const remaining = product.qty - (inCart ? inCart.qty : 0);

  return (
    <div className="bg-white rounded-2xl p-3 border border-border flex flex-col gap-2">
      <ProductImage src={product.image} alt={product.name} />
      <div className="text-sm font-semibold leading-snug">{product.name}</div>
      <div className="text-[15px] font-bold text-primary">{formatSum(product.price)}</div>
      <div className="text-xs text-muted">Qolgan: {Math.max(remaining, 0)} ta</div>
      <button
        disabled={remaining <= 0}
        onClick={() => addToCart(product.id, product.qty)}
        className={`mt-1 rounded-lg py-2 text-[13px] font-semibold ${
          remaining <= 0
            ? "bg-[#E4E0D5] text-muted cursor-not-allowed"
            : "bg-primary text-white"
        }`}
      >
        {remaining <= 0 ? "Tugagan" : "Savatchaga qo'shish"}
      </button>
    </div>
  );
}
