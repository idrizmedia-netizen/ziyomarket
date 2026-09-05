"use client";

import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatSum } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { subscribeReviews, subscribeUserOrders, addReview } from "../lib/firestore";
import { signInWithGoogle } from "../lib/auth";

function StarRow({ value, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? "text-accent fill-accent" : "text-border"}
        />
      ))}
    </div>
  );
}

export default function ProductDetailModal({ product, onClose }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const gallery = product.images && product.images.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const unsub = subscribeReviews(product.id, setReviews);
    return () => unsub();
  }, [product.id]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserOrders(user.uid, setUserOrders);
    return () => unsub();
  }, [user]);

  const hasPurchased = userOrders.some(
    (o) => o.status === "fulfilled" && o.items.some((it) => it.productId === product.id)
  );
  const alreadyReviewed = reviews.some((r) => r.buyerUid === user?.uid);

  const avg = product.ratingCount ? product.ratingSum / product.ratingCount : 0;

  async function handleSubmitReview() {
    setError("");
    if (rating === 0) {
      setError("Yulduzcha tanlang");
      return;
    }
    setSubmitting(true);
    try {
      await addReview({
        productId: product.id,
        buyerUid: user.uid,
        buyerName: user.displayName || user.email,
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment("");
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-[480px] max-w-full max-h-[88vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div className="font-display text-lg">{product.name}</div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <ProductImage src={gallery[activeImage]} alt={product.name} height={220} />

          {gallery.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 ${
                    idx === activeImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <ProductImage src={img} alt="" height={56} />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            {product.discountPrice ? (
              <>
                <span className="text-sm text-muted line-through">{formatSum(product.price)}</span>
                <span className="text-xl font-bold text-danger">
                  {formatSum(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">{formatSum(product.price)}</span>
            )}
          </div>

          {product.ratingCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRow value={avg} />
              <span className="text-xs text-muted">
                {avg.toFixed(1)} ({product.ratingCount} ta baho)
              </span>
            </div>
          )}

          {product.description && (
            <p className="text-sm text-muted mt-3 leading-relaxed">{product.description}</p>
          )}

          <div className="border-t border-border mt-5 pt-4">
            <div className="font-bold text-sm mb-3">Sharh qoldirish</div>

            {!user ? (
              <button
                onClick={() => signInWithGoogle()}
                className="text-sm text-primary font-semibold border border-primary rounded-lg px-4 py-2"
              >
                Sharh yozish uchun kiring
              </button>
            ) : alreadyReviewed ? (
              <div className="text-sm text-muted">Siz bu mahsulotga sharh qoldirgansiz.</div>
            ) : !hasPurchased ? (
              <div className="text-sm text-muted">
                Sharh yozish uchun avval shu mahsulotni sotib olishingiz kerak.
              </div>
            ) : (
              <div>
                <div className="flex gap-1 mb-2.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(n)}
                    >
                      <Star
                        size={26}
                        className={
                          n <= (hoverRating || rating)
                            ? "text-accent fill-accent"
                            : "text-border"
                        }
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Fikringiz (ixtiyoriy)"
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm mb-2.5"
                />
                {error && <div className="text-danger text-xs mb-2">{error}</div>}
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  {submitting ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-border mt-5 pt-4">
            <div className="font-bold text-sm mb-3">
              Sharhlar {reviews.length > 0 && `(${reviews.length})`}
            </div>
            {reviews.length === 0 ? (
              <div className="text-sm text-muted">Hali sharh yo&apos;q.</div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {reviews.map((r) => (
                  <div key={r.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{r.buyerName}</span>
                      <StarRow value={r.rating} size={12} />
                    </div>
                    {r.comment && <div className="text-sm text-muted">{r.comment}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
