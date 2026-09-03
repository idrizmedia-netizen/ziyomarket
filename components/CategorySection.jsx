"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 10;

export default function CategorySection({ category, products }) {
  const [limit, setLimit] = useState(PAGE_SIZE);

  if (products.length === 0) return null;
  const visible = products.slice(0, limit);
  const hasMore = products.length > limit;

  return (
    <div id={`cat-${category.id}`} className="mb-9 scroll-mt-20">
      <div className="font-display text-xl mb-3.5 pb-2 border-b-2 border-border">
        {category.name}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="flex items-center gap-1.5 border border-primary text-primary rounded-full px-5 py-2 text-sm font-semibold"
          >
            Yana ko&apos;rsatish
            <ChevronDown size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
