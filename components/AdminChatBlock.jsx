"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { subscribeSellers } from "../lib/firestore";
import SellerChatThread from "./SellerChatThread";

export default function AdminChatBlock({ currentEmail, currentName }) {
  const [sellers, setSellers] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const unsub = subscribeSellers(setSellers);
    return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <MessageCircle size={18} className="text-primary" />
        Sotuvchilar bilan chat
      </div>

      {sellers.length === 0 ? (
        <div className="text-sm text-muted">Hali sotuvchi yo&apos;q.</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {sellers.map((s) => (
            <button
              key={s.email}
              onClick={() => setActive(s)}
              className="flex items-center justify-between bg-bg rounded-lg px-3 py-2.5 text-sm text-left hover:bg-border/40"
            >
              <span>
                {s.storeName || s.name || s.email}
                <span className="text-muted text-xs ml-1.5">{s.email}</span>
              </span>
              <MessageCircle size={14} className="text-primary shrink-0" />
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-[420px] max-w-full p-4.5"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold">{active.storeName || active.name || active.email}</div>
              <button onClick={() => setActive(null)}>
                <X size={18} />
              </button>
            </div>
            <SellerChatThread
              sellerEmail={active.email}
              currentUserEmail={currentEmail}
              currentUserName={currentName}
              asAdmin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
