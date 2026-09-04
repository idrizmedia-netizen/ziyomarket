"use client";

import { useState } from "react";
import { Trash2, Pencil, Check, Upload, Loader2 } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { addProduct, updateProduct, deleteProduct, deleteCategory } from "../lib/firestore";
import { uploadImage } from "../lib/imgbb";

export default function CategoryAdminBlock({ category, products }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    discountPrice: "",
    qty: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ price: "", discountPrice: "", qty: "" });

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setUploadError(err.message || "Rasm yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (!form.name.trim() || !form.price || !form.qty) return;
    await addProduct(category.id, category.name, form);
    setForm({ name: "", image: "", description: "", price: "", discountPrice: "", qty: "" });
    setOpen(false);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditForm({ price: p.price, discountPrice: p.discountPrice || "", qty: p.qty });
  }

  async function saveEdit(productId) {
    await updateProduct(productId, {
      price: Number(editForm.price),
      discountPrice: editForm.discountPrice ? Number(editForm.discountPrice) : null,
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5 bg-bg p-3 rounded-lg items-start">
          <input
            placeholder="Nomi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm"
          />

          <div>
            <label className="flex items-center justify-center gap-1.5 border border-dashed border-border rounded-lg px-3 py-2 text-xs cursor-pointer bg-white">
              {uploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Yuklanmoqda...
                </>
              ) : form.image ? (
                <>
                  <Check size={13} className="text-success" /> Rasm tanlandi
                </>
              ) : (
                <>
                  <Upload size={13} /> Rasm tanlash
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {uploadError && <div className="text-danger text-[10px] mt-1">{uploadError}</div>}
          </div>

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

          <input
            placeholder="Chegirmali narx (ixtiyoriy)"
            type="number"
            value={form.discountPrice}
            onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
            className="col-span-2 sm:col-span-2 border border-border rounded-lg px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Tavsif (ixtiyoriy)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="col-span-2 sm:col-span-2 border border-border rounded-lg px-3 py-2 text-sm"
          />

          {form.image && (
            <div className="col-span-2 sm:col-span-4 w-24">
              <ProductImage src={form.image} alt="Ko'rinish" height={70} />
            </div>
          )}

          <button
            onClick={submit}
            disabled={uploading}
            className="col-span-2 sm:col-span-4 bg-primary text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
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
                    value={editForm.discountPrice}
                    onChange={(e) => setEditForm({ ...editForm, discountPrice: e.target.value })}
                    className="border border-border rounded px-2 py-1 text-xs"
                    placeholder="Chegirmali narx"
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
                  {p.discountPrice ? (
                    <div>
                      <span className="text-[10px] text-muted line-through mr-1">
                        {formatSum(p.price)}
                      </span>
                      <span className="text-xs text-danger font-bold">
                        {formatSum(p.discountPrice)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-primary font-bold">{formatSum(p.price)}</div>
                  )}
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
