"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, ShieldCheck } from "lucide-react";
import { subscribeAdmins, addAdmin, removeAdmin } from "../lib/firestore";

export default function AdminManageBlock({ currentEmail }) {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = subscribeAdmins(setAdmins);
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
      await addAdmin(clean, currentEmail);
      setEmail("");
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <ShieldCheck size={18} className="text-primary" />
        Adminlar
      </div>

      <div className="flex gap-2.5 mb-3">
        <input
          placeholder="yangi_admin@gmail.com"
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
        {admins.map((a) => (
          <div
            key={a.email}
            className="flex items-center justify-between bg-bg rounded-lg px-3 py-2 text-sm"
          >
            <span>
              {a.email}
              {a.email === currentEmail && (
                <span className="text-muted text-xs ml-1.5">(siz)</span>
              )}
            </span>
            {a.email !== currentEmail && (
              <button onClick={() => removeAdmin(a.email)}>
                <Trash2 size={14} className="text-danger" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
