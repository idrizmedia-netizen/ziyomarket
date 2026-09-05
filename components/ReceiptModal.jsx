"use client";

import { Printer, X, Share2 } from "lucide-react";
import { formatSum } from "../lib/utils";

export default function ReceiptModal({ receipt, onClose }) {
  const { items, subtotal, discount, bonus, total, sellerName, date } = receipt;

  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    const lines = [
      "ZiyoMarket — chek",
      date,
      "",
      ...items.map((it) => `${it.name} x${it.qty} — ${formatSum(it.price * it.qty)}`),
      "",
      `Oraliq jami: ${formatSum(subtotal)}`,
      discount > 0 ? `Chegirma: -${formatSum(discount)}` : null,
      bonus > 0 ? `Bonus: -${formatSum(bonus)}` : null,
      `Jami: ${formatSum(total)}`,
      `Sotuvchi: ${sellerName}`,
    ].filter(Boolean);
    const text = lines.join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("Chek matni nusxalandi");
      } catch (e) {
        /* ignore */
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 print:bg-white print:p-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-[360px] max-w-full max-h-[88vh] overflow-y-auto print:rounded-none print:max-h-none print:w-full"
      >
        <div id="receipt-print" className="p-5 font-mono text-[13px]">
          <div className="text-center mb-3">
            <div className="font-display text-lg font-bold">ZiyoMarket</div>
            <div className="text-muted text-[11px]">{date}</div>
          </div>

          <div className="border-t border-dashed border-border my-2" />

          {items.map((it, idx) => (
            <div key={idx} className="flex justify-between py-0.5">
              <span>
                {it.name} x{it.qty}
              </span>
              <span>{formatSum(it.price * it.qty)}</span>
            </div>
          ))}

          <div className="border-t border-dashed border-border my-2" />

          <div className="flex justify-between py-0.5">
            <span>Oraliq jami</span>
            <span>{formatSum(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-0.5">
              <span>Chegirma</span>
              <span>-{formatSum(discount)}</span>
            </div>
          )}
          {bonus > 0 && (
            <div className="flex justify-between py-0.5">
              <span>Bonus</span>
              <span>-{formatSum(bonus)}</span>
            </div>
          )}

          <div className="border-t border-dashed border-border my-2" />

          <div className="flex justify-between font-bold text-base py-1">
            <span>JAMI</span>
            <span>{formatSum(total)}</span>
          </div>

          <div className="text-center text-[11px] text-muted mt-3">
            Sotuvchi: {sellerName}
            <br />
            Xaridingiz uchun rahmat!
          </div>
        </div>

        <div className="flex gap-2.5 px-5 pb-5 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white rounded-lg py-2.5 text-sm font-semibold"
          >
            <Printer size={15} /> Chop etish
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 border border-primary text-primary rounded-lg py-2.5 text-sm font-semibold"
          >
            <Share2 size={15} /> Ulashish
          </button>
          <button
            onClick={onClose}
            className="w-11 flex items-center justify-center border border-border rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
