"use client";

import ProductCard from "./ProductCard";

export default function CategorySection({ category, products }) {
  if (products.length === 0) return null;
  return (
    <div className="mb-9">
      <div className="font-display text-xl mb-3.5 pb-2 border-b-2 border-border">
        {category.name}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
