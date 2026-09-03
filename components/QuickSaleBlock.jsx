"use client";

import { useState } from "react";
import { Search, Plus, Minus, X, ShoppingBag, Check } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { createDirectSale } from "../lib/firestore";
import { useAuth } from "../context/AuthContext";

export default function QuickSaleBlock({ products }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [posCart, setPosCart] = useState([]); // [{productId, qty}]
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState("");
  const [bonus, setBonus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : products;

  function addItem(productId, maxQty) {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        if (existing.qty >= maxQty) return prev;
        return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { productId, qty: 1 }];
    });
  }

  function changeQty(productId, delta, maxQty) {
    setPosCart((prev) =>
      prev
        .map((i) => {
          if (i.productId !== productId) return i;
          const next = i.qty + delta;
          if (maxQty !== undefined && next > maxQty) return i;
          return { ...i, qty: next };
        })
        .filter((i) => i.qty > 0)
    );
  }

  const detailed = posCart
    .map((i) => {
      const p = products.find((pr) => pr.id === i.productId);
      if (!p) return null;
      return { ...i, product: p };
    })
    .filter(Boolean);

  const subtotal = detailed.reduce((s, i) => s + i.product.price * i.qty, 0);
  const totalCount = posCart.reduce((s, i) => s + i.qty, 0);
  const finalTotal = Math.max(0, subtotal - Number(discount || 0) - Number(bonus || 0));

  async function handleSell() {
    setError("");
    if (detailed.length === 0) return;
    setSubmitting(true);
    try {
      await createDirectSale({
        sellerEmail: user?.email,
        sellerName: user?.displayName || user?.email,
        items: detailed.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          categoryName: i.product.categoryName,
          price: i.product.price,
          qty: i.qty,
        })),
        discount: Number(discount || 0),
        bonus: Number(bonus || 0),
      });
      setPosCart([]);
      setDiscount("");
      setBonus("");
      setCheckoutOpen(false);
      setSuccess(`Sotildi! Jami: ${formatSum(finalTotal)}`);
      setTimeout(() => setSuccess(""), 3500);
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <ShoppingBag size={18} className="text-primary" />
        Do&apos;kondan tezkor sotuv
      </div>
      <div className="text-xs text-muted mb-3">
        Mijoz do&apos;konga kelib mahsulot tanlasa, shu yerdan tanlab, chegirma
        yoki bonus qo&apos;shib, darhol sotuvni yakunlang.
      </div>

      {success && (
        <div className="bg-success/10 text-success text-sm font-semibold rounded-lg px-3 py-2 mb-3">
          {success}
        </div>
      )}

      <div className="flex items-center gap-2 bg-bg rounded-full px-3.5 py-2 mb-3">
        <Search size={15} className="text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mahsulot qidirish..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mb-4 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map((p) => {
          const inCart = posCart.find((i) => i.productId === p.id);
          const remaining = p.qty - (inCart ? inCart.qty : 0);
          return (
            <div key={p.id} className="border border-border rounded-lg p-2">
              <ProductImage src={p.image} alt={p.name} height={80} />
              <div className="text-xs font-semibold mt-1.5 leading-tight">{p.name}</div>
              <div className="text-xs text-primary font-bold">{formatSum(p.price)}</div>
              <div className="text-[10px] text-muted mb-1">{Math.max(remaining, 0)} ta bor</div>
              {inCart ? (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => changeQty(p.id, -1)}
                    className="w-6 h-6 rounded border border-border flex items-center justify-center"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-xs font-semibold">{inCart.qty}</span>
                  <button
                    onClick={() => changeQty(p.id, 1, p.qty)}
                    className="w-6 h-6 rounded border border-border flex items-center justify-center"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              ) : (
                <button
                  disabled={remaining <= 0}
                  onClick={() => addItem(p.id, p.qty)}
                  className={`w-full rounded-md py-1.5 text-[11px] font-semibold ${
                    remaining <= 0
                      ? "bg-[#E4E0D5] text-muted cursor-not-allowed"
                      : "bg-primary text-white"
                  }`}
                >
                  {remaining <= 0 ? "Tugagan" : "+ Tanlash"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {totalCount > 0 && (
        <button
          onClick={() => setCheckoutOpen(true)}
          className="w-full bg-accent text-primaryDark rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2"
        >
          Savat: {totalCount} ta — {formatSum(subtotal)} → Yakunlash
        </button>
      )}

      {checkoutOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setCheckoutOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-5 w-[380px] max-w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="font-display text-lg">Sotuvni yakunlash</div>
              <button onClick={() => setCheckoutOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-3">
              {detailed.map((i) => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span>
                    {i.product.name} × {i.qty}
                  </span>
                  <span>{formatSum(i.product.price * i.qty)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mb-3">
              <span>Oraliq jami</span>
              <span>{formatSum(subtotal)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="text-xs text-muted">Chegirma (so&apos;m)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Bonus (so&apos;m)</label>
                <input
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(e.target.value)}
                  placeholder="0"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
                />
              </div>
            </div>

            <div className="flex justify-between text-base font-bold text-primary border-t border-border pt-3 mb-4">
              <span>Yakuniy summa</span>
              <span>{formatSum(finalTotal)}</span>
            </div>

            {error && <div className="text-danger text-xs mb-2">{error}</div>}

            <button
              disabled={submitting}
              onClick={handleSell}
              className="w-full bg-success text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Check size={16} />
              {submitting ? "Saqlanmoqda..." : "Sotildi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
