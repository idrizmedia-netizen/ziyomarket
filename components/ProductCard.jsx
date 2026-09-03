"use client";

import React from "react";
import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
      <div className="relative w-full h-48 mb-3">
        <ProductImage src={product.image} alt={product.title || product.name} />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
            {product.title || product.name}
          </h3>
          {product.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-lg text-blue-600">
            {formatSum ? formatSum(product.price) : `${product.price} so'm`}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Savatga
          </button>
        </div>
      </div>
    </div>
  );
}
