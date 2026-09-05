"use client";

import ProductCard from "./ProductCard";

export default function ProductRow({ title, icon, products }) {
  if (products.length === 0) return null;
  return (
    <div className="mb-9">
      <div className="flex items-center gap-2 font-display text-xl mb-3.5">
        {icon}
        {title}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {products.map((p) => (
          <div key={p.id} className="w-[160px] sm:w-[190px] shrink-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
