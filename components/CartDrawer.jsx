"use client";

import { useState } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatSum } from "../lib/utils";
import { placeOrder } from "../lib/firestore";
import { signInWithGoogle } from "../lib/auth";
import ProductImage from "./ProductImage";

export default function CartDrawer({ open, onClose, products }) {
  const { cart, changeQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const items = cart
    .map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) return null;
      return { ...i, product };
    })
    .filter(Boolean);

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  async function handleConfirm() {
    setError("");
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (e) {
        setError("Kirish bekor qilindi");
        return;
      }
    }
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      await placeOrder({
        uid: user?.uid,
        buyerName: user?.displayName || "Foydalanuvchi",
        buyerEmail: user?.email || "",
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          categoryName: i.product.categoryName,
          price: i.product.price,
          qty: i.qty,
        })),
      });
      clearCart();
      onClose();
      alert("So'rovingiz qabul qilindi! Sotuvchi tayyorlab bergach, xaridingiz profilingizda \"Sotib oldingiz\" deb ko'rinadi.");
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[340px] max-w-[90vw] bg-bg h-full p-5 overflow-y-auto flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="font-display text-xl">Savatcha</div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-muted text-sm mt-5">Savatcha bo'sh.</div>
        ) : (
          <div className="flex flex-col gap-3 flex-1">
            {items.map((i) => (
              <div
                key={i.productId}
                className="bg-white rounded-xl p-2.5 border border-border flex gap-2.5"
              >
                <div className="w-14 shrink-0">
                  <ProductImage src={i.product.image} alt={i.product.name} height={56} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">{i.product.name}</div>
                  <div className="text-[13px] text-primary font-bold">
                    {formatSum(i.product.price)}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => changeQty(i.productId, -1)}
                      className="w-[22px] h-[22px] rounded border border-border bg-white flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-[13px]">{i.qty}</span>
                    <button
                      onClick={() => changeQty(i.productId, 1, i.product.qty)}
                      className="w-[22px] h-[22px] rounded border border-border bg-white flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(i.productId)} className="ml-auto">
                      <Trash2 size={15} className="text-danger" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="text-danger text-xs mt-3">{error}</div>}

        <div className="border-t border-border mt-4 pt-4">
          <div className="flex justify-between text-[15px] mb-3">
            <span>Jami:</span>
            <span className="font-bold">{formatSum(total)}</span>
          </div>
          <button
            disabled={items.length === 0 || submitting}
            onClick={handleConfirm}
            className={`w-full rounded-xl py-3 font-bold text-[15px] ${
              items.length === 0 || submitting
                ? "bg-[#E4E0D5] text-muted cursor-not-allowed"
                : "bg-accent text-primaryDark"
            }`}
          >
            {submitting ? "Yuborilmoqda..." : "Buyurtma berish"}
          </button>
        </div>
        <div className="text-[11px] text-muted mt-2 text-center">
          Yetkazib berish xizmati hozircha yo&apos;q — buyurtma tasdiqlangach,
          do&apos;kondan o&apos;zingiz olib ketasiz.
        </div>
      </div>
    </div>
  );
}
