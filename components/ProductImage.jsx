"use client";

import { useState } from "react";
import { Package } from "lucide-react";

export default function ProductImage({ src, alt, height = 150 }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        style={{ height }}
        className="w-full bg-[#F0EBE0] rounded-lg flex items-center justify-center"
      >
        <Package size={28} className="text-muted" />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
      style={{ height }}
      className="w-full object-cover rounded-lg block"
    />
  );
}
