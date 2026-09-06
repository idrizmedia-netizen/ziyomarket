"use client";

import { useState } from "react";
import { X, Receipt as ReceiptIcon } from "lucide-react";
import { formatSum } from "../lib/utils";
import ReceiptModal from "./ReceiptModal";
"use client";

import { useState } from "react";
import { X, Receipt as ReceiptIcon, Download } from "lucide-react";
import { formatSum } from "../lib/utils";
import ReceiptModal from "./ReceiptModal";

const PERIODS = [
  { id: "week", label: "So'nggi 7 kun", days: 7 },
  { id: "month", label: "So'nggi 30 kun", days: 30 },
  { id: "year", label: "So'nggi 365 kun", days: 365 },
  { id: "all", label: "Barcha vaqt", days: null },
];

export default function SellerLedgerModal({ sellerEmail, sellerName, orders, onClose }) {
  const [viewReceipt, setViewReceipt] = useState(null);
  const [period, setPeriod] = useState("month");

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

  function downloadReport() {
    const days = PERIODS.find((p) => p.id === period)?.days;
    const now = Date.now();
    const inRange = mine.filter((o) => {
      if (!days) return true;
      const ts = o.fulfilledAt?.toDate?.() || o.createdAt?.toDate?.();
      if (!ts) return false;
      return (now - ts.getTime()) / 86400000 <= days;
    });

    const header = "Sana,Mahsulotlar,Jami\n";
    const rows = inRange
      .map((o) => {
        const ts = o.fulfilledAt?.toDate?.() || o.createdAt?.toDate?.();
        const dateStr = ts ? ts.toLocaleString("uz-UZ") : "";
        const itemsStr = o.items.map((it) => `${it.name} x${it.qty}`).join("; ");
        return `"${dateStr}","${itemsStr}",${o.total}`;
      })
      .join("\n");
    const periodTotal = inRange.reduce((s, o) => s + (o.total || 0), 0);
    const csv = "\uFEFF" + header + rows + `\n\n,Jami,${periodTotal}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sellerName}-hisobot-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

        <div className="flex items-center gap-2 mb-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 bg-primary text-white rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap"
          >
            <Download size={14} />
            Yuklab olish
          </button>
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
