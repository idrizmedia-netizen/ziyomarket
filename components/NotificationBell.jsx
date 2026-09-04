"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X, Megaphone } from "lucide-react";
import { subscribeAnnouncements } from "../lib/firestore";

const READ_KEY = "ziyomarket_read_announcements";

function timeAgo(ts) {
  if (!ts?.toDate) return "";
  const diffMs = Date.now() - ts.toDate().getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "hozirgina";
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  return `${days} kun oldin`;
}

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const wrapRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const active = items.filter((a) => a.active);
  const unreadCount = active.filter((a) => !readIds.includes(a.id)).length;

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      const allIds = active.map((a) => a.id);
      setReadIds(allIds);
      localStorage.setItem(READ_KEY, JSON.stringify(allIds));
    }
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={handleToggle}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        aria-label="Bildirishnomalar"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-[3px] flex items-center justify-center bg-danger text-white text-[9px] font-bold rounded-full border-2 border-primary">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-16 sm:top-11 bg-white text-ink rounded-2xl shadow-2xl sm:w-80 max-w-full sm:max-w-[88vw] overflow-hidden z-40 border border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Megaphone size={15} className="text-primary" />
              Bildirishnomalar
            </div>
            <button onClick={() => setOpen(false)} className="text-muted">
              <X size={16} />
            </button>
          </div>

          {active.length === 0 ? (
            <div className="px-4 py-8 text-sm text-muted text-center">
              Hozircha bildirishnoma yo&apos;q.
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {active.map((a) => (
                <div
                  key={a.id}
                  className="px-4 py-3 text-sm border-b border-border last:border-0 hover:bg-bg transition-colors"
                >
                  <div className="leading-snug">{a.message}</div>
                  <div className="text-[11px] text-muted mt-1">{timeAgo(a.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
