"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { subscribeAnnouncements } from "../lib/firestore";

export default function AnnouncementBanner() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = subscribeAnnouncements(setItems);
    return () => unsub();
  }, []);

  const active = items.filter((a) => a.active);
  if (active.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-5">
      {active.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-2.5 bg-accent/15 text-accentDark rounded-xl px-4 py-3 text-sm font-medium"
        >
          <Megaphone size={16} className="shrink-0" />
          <span>{a.message}</span>
        </div>
      ))}
    </div>
  );
}
