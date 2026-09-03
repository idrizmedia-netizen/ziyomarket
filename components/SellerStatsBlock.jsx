"use client";

import { BarChart3 } from "lucide-react";
import { computeSellerStats, formatSum } from "../lib/utils";

export default function SellerStatsBlock({ fulfilledOrders, mode, currentEmail }) {
  const stats = computeSellerStats(fulfilledOrders);
  const rows = mode === "admin" ? stats : stats.filter((s) => s.email === currentEmail);

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <BarChart3 size={18} className="text-primary" />
        {mode === "admin" ? "Sotuvchilar statistikasi" : "Mening savdolarim"}
      </div>

      {rows.length === 0 ? (
        <div className="text-sm text-muted">Hali savdo qayd etilmagan.</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] px-2 py-2 text-xs font-bold text-muted border-b border-border">
              <span>Sotuvchi</span>
              <span>So&apos;nggi 7 kun</span>
              <span>So&apos;nggi 30 kun</span>
              <span>So&apos;nggi 365 kun</span>
            </div>
            {rows.map((s) => (
              <div
                key={s.email}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr] px-2 py-2.5 text-[13px] border-b border-border"
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
