"use client";

import { useState } from "react";
import { Trash2, Pencil, Check } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { addProduct, updateProduct, deleteProduct, deleteCategory } from "../lib/firestore";

export default function CategoryAdminBlock({ category, products }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: "", price: "", qty: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ price: "", qty: "" });

  async function submit() {
    if (!form.name.trim() || !form.price || !form.qty) return;
    await addProduct(category.id, category.name, form);
    setForm({ name: "", image: "", price: "", qty: "" });
    setOpen(false);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditForm({ price: p.price, qty: p.qty });
  }

  async function saveEdit(productId) {
    await updateProduct(productId, {
      price: Number(editForm.price),
      qty: Number(editForm.qty),
    });
    setEditingId(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-4.5 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-base">{category.name}</div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setOpen((o) => !o)}
            className="border border-primary text-primary rounded-lg px-3 py-1.5 text-[13px] font-semibold"
          >
            {open ? "Bekor qilish" : "+ Mahsulot"}
          </button>
          <button onClick={() => deleteCategory(category.id)}>
            <Trash2 size={16} className="text-danger" />
          </button>
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5 bg-bg p-3 rounded-lg">
          <input
            placeholder="Nomi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Rasm URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Narxi"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Soni"
            type="number"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={submit}
            className="col-span-2 sm:col-span-4 bg-primary text-white rounded-lg py-2 text-sm font-semibold"
          >
            Saqlash
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-[13px] text-muted">Mahsulot yo&apos;q.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products.map((p) => (
            <div key={p.id} className="border border-border rounded-lg p-2">
              <ProductImage src={p.image} alt={p.name} height={100} />
              <div className="text-xs font-semibold mt-1.5">{p.name}</div>

              {editingId === p.id ? (
                <div className="flex flex-col gap-1 mt-1">
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="border border-border rounded px-2 py-1 text-xs"
                    placeholder="Narxi"
                  />
                  <input
                    type="number"
                    value={editForm.qty}
                    onChange={(e) => setEditForm({ ...editForm, qty: e.target.value })}
                    className="border border-border rounded px-2 py-1 text-xs"
                    placeholder="Soni"
                  />
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="flex items-center justify-center gap-1 bg-success text-white rounded px-2 py-1 text-xs font-semibold"
                  >
                    <Check size={12} /> Saqlash
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-xs text-primary font-bold">{formatSum(p.price)}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[11px] text-muted">{p.qty} ta qoldi</span>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)}>
                        <Pencil size={13} className="text-primary" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)}>
                        <Trash2 size={13} className="text-danger" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
