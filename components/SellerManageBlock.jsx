"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, Store } from "lucide-react";
import { subscribeSellers, addSeller, removeSeller } from "../lib/firestore";

export default function SellerManageBlock({ currentEmail }) {
  const [sellers, setSellers] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = subscribeSellers(setSellers);
    return () => unsub();
  }, []);

  async function handleAdd() {
    setError("");
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setError("To'g'ri email kiriting");
      return;
    }
    try {
      await addSeller(clean, currentEmail);
      setEmail("");
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <Store size={18} className="text-primary" />
        Sotuvchilar
      </div>
      <div className="text-xs text-muted mb-3">
        Sotuvchi buyurtmalarni tayyorlab, &quot;Sotildi&quot; deb belgilay oladi.
        Bo&apos;lim/mahsulot va admin boshqaruviga kirisholmaydi.
      </div>

      <div className="flex gap-2.5 mb-3">
        <input
          placeholder="sotuvchi@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5"
        >
          <UserPlus size={15} />
          Qo&apos;shish
        </button>
      </div>
      {error && <div className="text-danger text-xs mb-2">{error}</div>}

      <div className="flex flex-col gap-1.5">
        {sellers.length === 0 && (
          <div className="text-xs text-muted">Hali sotuvchi qo&apos;shilmagan.</div>
        )}
        {sellers.map((s) => (
          <div
            key={s.email}
            className="flex items-center justify-between bg-bg rounded-lg px-3 py-2 text-sm"
          >
            <span>{s.email}</span>
            <button onClick={() => removeSeller(s.email)}>
              <Trash2 size={14} className="text-danger" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
