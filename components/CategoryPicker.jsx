"use client";

const PALETTE = [
  { from: "#2E3A6E", to: "#4A5AA8" }, // indigo
  { from: "#C6811F", to: "#E8A33D" }, // gold
  { from: "#2F8F52", to: "#4CAF6E" }, // green
  { from: "#B5482F", to: "#D9694A" }, // terracotta
  { from: "#5B4B8A", to: "#7E6BB8" }, // purple
  { from: "#1F7A8C", to: "#3FA6BA" }, // teal
  { from: "#A63D5F", to: "#D2648A" }, // berry
  { from: "#5C7A29", to: "#87A94A" }, // olive
];

export default function CategoryPicker({ categories, products }) {
  if (categories.length === 0) return null;

  function scrollTo(id) {
    const el = document.getElementById(`cat-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-9">
      {categories.map((cat, idx) => {
        const color = PALETTE[idx % PALETTE.length];
        const count = products.filter((p) => p.categoryId === cat.id).length;
        return (
          <button
            key={cat.id}
            onClick={() => scrollTo(cat.id)}
            style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
            className="rounded-2xl p-5 text-left text-white flex flex-col justify-between min-h-[110px] sm:min-h-[130px] transition-transform active:scale-95"
          >
            <div className="font-display text-lg sm:text-xl leading-tight">{cat.name}</div>
            <div className="text-xs sm:text-sm text-white/75 mt-2">{count} ta mahsulot</div>
          </button>
        );
      })}
    </div>
  );
}
