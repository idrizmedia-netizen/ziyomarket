"use client";

import { useState } from "react";
import { BarChart3, ChevronRight } from "lucide-react";
import { computeSellerStats, formatSum } from "../lib/utils";
import SellerLedgerModal from "./SellerLedgerModal";

export default function SellerStatsBlock({ fulfilledOrders, mode, currentEmail }) {
  const [ledgerSeller, setLedgerSeller] = useState(null);
  const stats = computeSellerStats(fulfilledOrders);
  const rows = mode === "admin" ? stats : stats.filter((s) => s.email === currentEmail);

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <BarChart3 size={18} className="text-primary" />
        {mode === "admin" ? "Sotuvchilar statistikasi" : "Mening savdolarim"}
      </div>
      <div className="text-xs text-muted mb-3">
        Cheklar ro&apos;yxatini ko&apos;rish uchun qatorni bosing.
      </div>

      {rows.length === 0 ? (
        <div className="text-sm text-muted">Hali savdo qayd etilmagan.</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_24px] px-2 py-2 text-xs font-bold text-muted border-b border-border">
              <span>Sotuvchi</span>
              <span>So&apos;nggi 7 kun</span>
              <span>So&apos;nggi 30 kun</span>
              <span>So&apos;nggi 365 kun</span>
              <span></span>
            </div>
            {rows.map((s) => (
              <button
                key={s.email}
                onClick={() => setLedgerSeller(s)}
                className="w-full grid grid-cols-[1.4fr_1fr_1fr_1fr_24px] px-2 py-2.5 text-[13px] border-b border-border last:border-0 hover:bg-bg text-left items-center"
              >
                <span className="truncate">{s.name}</span>
                <span>
                  {formatSum(s.week)}
                  <span className="text-muted text-[11px]"> ({s.weekQty} ta)</span>
                </span>
                <span>
                  {formatSum(s.month)}
                  <span className="text-muted text-[11px]"> ({s.monthQty} ta)</span>
                </span>
                <span>
                  {formatSum(s.year)}
                  <span className="text-muted text-[11px]"> ({s.yearQty} ta)</span>
                </span>
                <ChevronRight size={15} className="text-muted" />
              </button>
            ))}
          </div>
        </div>
      )}

      {ledgerSeller && (
        <SellerLedgerModal
          sellerEmail={ledgerSeller.email}
          sellerName={ledgerSeller.name}
          orders={fulfilledOrders}
          onClose={() => setLedgerSeller(null)}
        />
      )}
    </div>
  );
}
