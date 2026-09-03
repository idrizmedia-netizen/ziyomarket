"use client";

import { useEffect, useState } from "react";
import { Megaphone, Trash2 } from "lucide-react";
import {
  subscribeAnnouncements,
  addAnnouncement,
  toggleAnnouncement,
  deleteAnnouncement,
} from "../lib/firestore";

export default function AnnouncementsBlock() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsub = subscribeAnnouncements(setItems);
    return () => unsub();
  }, []);

  async function handleAdd() {
    if (!text.trim()) return;
    await addAnnouncement(text.trim());
    setText("");
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <Megaphone size={18} className="text-primary" />
        Bildirishnomalar
      </div>
      <div className="text-xs text-muted mb-3">
        Bu yerga yozgan xabaringiz bosh sahifada barcha foydalanuvchilarga
        ko&apos;rinadi.
      </div>

      <div className="flex gap-2.5 mb-3">
        <input
          placeholder="Masalan: Ertaga do'kon 10:00 dan ishlaydi"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-semibold"
        >
          E&apos;lon qilish
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <div className="text-xs text-muted">Hali bildirishnoma yo&apos;q.</div>
        )}
        {items.map((a) => (
          <div
            key={a.id}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
              a.active ? "bg-bg" : "bg-bg opacity-50"
            }`}
          >
            <span className="flex-1">{a.message}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleAnnouncement(a.id, !a.active)}
                className="text-xs font-semibold text-primary"
              >
                {a.active ? "Yashirish" : "Ko'rsatish"}
              </button>
              <button onClick={() => deleteAnnouncement(a.id)}>
                <Trash2 size={14} className="text-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
