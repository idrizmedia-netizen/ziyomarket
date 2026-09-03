"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { subscribeAnnouncements } from "../lib/firestore";

const READ_KEY = "ziyomarket_read_announcements";

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
      setReadIds(saved);
    } catch (e) {
      /* ignore */
    }
    const unsub = subscribeAnnouncements(setItems);
    return () => unsub();
  }, []);

  const active = items.filter((a) => a.active);
  const hasUnread = active.some((a) => !readIds.includes(a.id));

  function handleOpen() {
    setOpen((o) => !o);
    const allIds = active.map((a) => a.id);
    setReadIds(allIds);
    localStorage.setItem(READ_KEY, JSON.stringify(allIds));
  }

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative">
        <Bell size={21} />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-primary" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 bg-white text-ink rounded-xl shadow-xl w-72 max-w-[85vw] overflow-hidden z-40">
          <div className="px-4 py-2.5 text-sm font-bold border-b border-border">
            Bildirishnomalar
          </div>
          {active.length === 0 ? (
            <div className="px-4 py-4 text-sm text-muted">Hozircha bildirishnoma yo&apos;q.</div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {active.map((a) => (
                <div key={a.id} className="px-4 py-3 text-sm border-b border-border last:border-0">
                  {a.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
