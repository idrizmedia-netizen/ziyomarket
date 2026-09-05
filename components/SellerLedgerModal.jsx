"use client";

import { useState } from "react";
import { X, Receipt as ReceiptIcon } from "lucide-react";
import { formatSum } from "../lib/utils";
import ReceiptModal from "./ReceiptModal";

export default function SellerLedgerModal({ sellerEmail, sellerName, orders, onClose }) {
  const [viewReceipt, setViewReceipt] = useState(null);

  const mine = orders
    .filter((o) => (o.sellerEmail || o.fulfilledBy) === sellerEmail)
    .sort((a, b) => {
      const ta = a.fulfilledAt?.toDate?.() || a.createdAt?.toDate?.() || 0;
      const tb = b.fulfilledAt?.toDate?.() || b.createdAt?.toDate?.() || 0;
      return tb - ta;
    });

  const total = mine.reduce((s, o) => s + (o.total || 0), 0);

  function openReceipt(o) {
    setViewReceipt({
      items: o.items,
      subtotal: o.subtotal ?? o.total,
      discount: o.discount || 0,
      bonus: o.bonus || 0,
      total: o.total,
      sellerName: o.fulfilledByName || o.sellerName || sellerName,
      date: o.fulfilledAt?.toDate
        ? o.fulfilledAt.toDate().toLocaleString("uz-UZ")
        : o.createdAt?.toDate
        ? o.createdAt.toDate().toLocaleString("uz-UZ")
        : "",
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[380px] max-w-[92vw] bg-bg h-full p-5 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-1">
          <div className="font-display text-lg">{sellerName}</div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="text-xs text-muted mb-4">
          {mine.length} ta chek — jami {formatSum(total)}
        </div>

        {mine.length === 0 ? (
          <div className="text-sm text-muted">Hali sotuv yo&apos;q.</div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {mine.map((o) => {
              const ts = o.fulfilledAt?.toDate?.() || o.createdAt?.toDate?.();
              return (
                <button
                  key={o.id}
                  onClick={() => openReceipt(o)}
                  className="bg-white rounded-xl p-3 border border-border text-left flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs text-muted">
                      {ts ? ts.toLocaleString("uz-UZ") : ""}
                    </div>
                    <div className="text-sm font-semibold">
                      {o.items.length} xil mahsulot
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">{formatSum(o.total)}</span>
                    <ReceiptIcon size={15} className="text-muted" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {viewReceipt && (
        <ReceiptModal receipt={viewReceipt} onClose={() => setViewReceipt(null)} />
      )}
    </div>
  );
}
