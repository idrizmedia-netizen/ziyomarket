"use client";

import { useState } from "react";
import { X, Plus, Minus, Trash2, Check } from "lucide-react";
import { formatSum } from "../lib/utils";
import { updateOrderItems } from "../lib/firestore";

export default function OrderEditModal({ order, products, onClose }) {
  const [items, setItems] = useState(order.items.map((it) => ({ ...it })));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function changeQty(idx, delta) {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[idx] };
      const product = products.find((p) => p.id === item.productId);
      const maxQty = product ? product.qty : item.qty;
      item.qty = Math.min(maxQty, Math.max(1, item.qty + delta));
      next[idx] = item;
      return next;
    });
  }

  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  async function handleSave() {
    if (items.length === 0) {
      setError("Kamida bitta mahsulot qolishi kerak (aks holda buyurtmani bekor qiling)");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await updateOrderItems(order.id, items);
      onClose();
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-[380px] max-w-full max-h-[85vh] overflow-y-auto p-5"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="font-display text-lg">Buyurtmani tahrirlash</div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          {items.map((it, idx) => (
            <div
              key={it.productId}
              className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{it.name}</div>
                <div className="text-xs text-muted">{formatSum(it.price)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(idx, -1)}
                  className="w-7 h-7 rounded border border-border flex items-center justify-center"
                >
                  <Minus size={13} />
                </button>
                <span className="text-sm w-5 text-center">{it.qty}</span>
                <button
                  onClick={() => changeQty(idx, 1)}
                  className="w-7 h-7 rounded border border-border flex items-center justify-center"
                >
                  <Plus size={13} />
                </button>
                <button onClick={() => removeItem(idx)} className="ml-1.5">
                  <Trash2 size={16} className="text-danger" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-base font-bold border-t border-border pt-3 mb-4">
          <span>Jami</span>
          <span className="text-primary">{formatSum(total)}</span>
        </div>

        {error && <div className="text-danger text-xs mb-3">{error}</div>}

        <button
          onClick={handleSave}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-1.5 bg-primary text-white rounded-xl py-3 font-bold text-sm disabled:opacity-60"
        >
          <Check size={16} />
          {submitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>
    </div>
  );
}
