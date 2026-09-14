"use client";

import { AlertTriangle, XCircle } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";

const LOW_STOCK_THRESHOLD = 3;

export default function LowStockBlock({ products, isAdmin, currentEmail }) {
  const scoped = isAdmin ? products : products.filter((p) => p.createdBy === currentEmail);

  const outOfStock = scoped.filter((p) => p.qty === 0);
  const lowStock = scoped.filter((p) => p.qty > 0 && p.qty <= LOW_STOCK_THRESHOLD);

  if (outOfStock.length === 0 && lowStock.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <AlertTriangle size={18} className="text-danger" />
        Kam qolgan / tugagan tovarlar
      </div>

      {lowStock.length > 0 && (
        <div className="mb-3.5">
          <div className="text-xs font-semibold text-accentDark mb-2">
            Kam qoldi ({lowStock.length})
          </div>
          <div className="flex flex-col gap-1.5">
            {lowStock.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2.5 bg-bg rounded-lg px-2.5 py-2"
              >
                <div className="w-9 h-9 shrink-0 rounded overflow-hidden">
                  <ProductImage src={p.image} alt={p.name} height={36} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-muted">{p.categoryName}</div>
                </div>
                <div className="text-xs font-bold text-accentDark whitespace-nowrap">
                  {p.qty} ta qoldi
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outOfStock.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-danger mb-2 flex items-center gap-1">
            <XCircle size={12} /> Tugagan ({outOfStock.length})
          </div>
          <div className="flex flex-col gap-1.5">
            {outOfStock.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2.5 bg-bg rounded-lg px-2.5 py-2 opacity-70"
              >
                <div className="w-9 h-9 shrink-0 rounded overflow-hidden">
                  <ProductImage src={p.image} alt={p.name} height={36} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-muted">{p.categoryName}</div>
                </div>
                <div className="text-xs font-bold text-danger whitespace-nowrap">
                  {formatSum(p.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
