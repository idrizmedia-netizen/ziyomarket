"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import CartDrawer from "../../components/CartDrawer";
import FavoritesDrawer from "../../components/FavoritesDrawer";
import ReceiptModal from "../../components/ReceiptModal";
import OrderEditModal from "../../components/OrderEditModal";
import SellerApplicationBlock from "../../components/SellerApplicationBlock";
import { Receipt, ChevronDown, X, Pencil, ClipboardList, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  subscribeUserOrders,
  subscribeProducts,
  subscribeMyReviews,
  cancelOrder,
} from "../../lib/firestore";
import { formatSum } from "../../lib/utils";
import { signInWithGoogle } from "../../lib/auth";

function StarRow({ value, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? "text-accent fill-accent" : "text-border"}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [historyLimit, setHistoryLimit] = useState(5);
  const [editOrder, setEditOrder] = useState(null);
  const [tab, setTab] = useState("orders");

  function openReceipt(o) {
    setViewReceipt({
      items: o.items,
      subtotal: o.subtotal ?? o.total,
      discount: o.discount || 0,
      bonus: o.bonus || 0,
      total: o.total,
      sellerName: o.fulfilledByName || o.sellerName || "ZiyoMarket",
      date: o.fulfilledAt?.toDate
        ? o.fulfilledAt.toDate().toLocaleString("uz-UZ")
        : o.createdAt?.toDate
        ? o.createdAt.toDate().toLocaleString("uz-UZ")
        : "",
    });
  }

  async function handleCancelOwn(orderId) {
    if (!confirm("Buyurtmani bekor qilmoqchimisiz?")) return;
    try {
      await cancelOrder(orderId);
    } catch (e) {
      alert(e.message || "Xatolik yuz berdi");
    }
  }

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserOrders(user.uid, setOrders);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeMyReviews(user.uid, setReviews);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const unsub = subscribeProducts(setProducts);
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onFavoritesOpen={() => setFavoritesOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="px-5 py-6 max-w-[700px] mx-auto pb-16">
        {loading ? (
          <div className="text-muted text-center py-10">Yuklanmoqda...</div>
        ) : !user ? (
          <div className="text-center py-16">
            <div className="text-muted mb-4">Profilni ko&apos;rish uchun tizimga kiring.</div>
            <button
              onClick={() => signInWithGoogle()}
              className="bg-accent text-primaryDark rounded-full px-5 py-2.5 font-semibold text-sm"
            >
              Google bilan kirish
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-5 border border-border mb-6 flex items-center gap-3.5">
              <div className="w-[52px] h-[52px] rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                {(user.displayName || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-[17px]">{user.displayName}</div>
                <div className="text-[13px] text-muted">{user.email}</div>
              </div>
            </div>

            <SellerApplicationBlock />

            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setTab("orders")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
                  tab === "orders" ? "bg-primary text-white" : "bg-white border border-border text-ink"
                }`}
              >
                <ClipboardList size={14} />
                Buyurtmalarim
              </button>
              <button
                onClick={() => setTab("reviews")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
                  tab === "reviews" ? "bg-primary text-white" : "bg-white border border-border text-ink"
                }`}
              >
                <Star size={14} />
                Sharhlarim
              </button>
            </div>

            {tab === "orders" && (
              <>
                {orders.length === 0 ? (
                  <div className="text-muted text-sm">Hali hech narsa buyurtma qilinmagan.</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.slice(0, historyLimit).map((o) => {
                      const statusLabel =
                        o.status === "fulfilled"
                          ? "Sotib oldingiz"
                          : o.status === "cancelled"
                          ? "Bekor qilindi"
                          : "Kutilmoqda";
                      const statusClass =
                        o.status === "fulfilled"
                          ? "bg-success/10 text-success"
                          : o.status === "cancelled"
                          ? "bg-danger/10 text-danger"
                          : "bg-accent/15 text-accentDark";
                      return (
                        <div key={o.id} className="bg-white rounded-xl p-3.5 border border-border">
                          <div className="flex justify-between items-center text-xs text-muted mb-2">
                            <span>
                              {o.createdAt?.toDate
                                ? o.createdAt.toDate().toLocaleString("uz-UZ")
                                : "hozir"}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </div>
                          {o.pickupTime && o.status === "pending" && (
                            <div className="text-[12px] font-semibold text-accentDark mb-1.5">
                              Olib ketish: {new Date(o.pickupTime).toLocaleString("uz-UZ")}
                            </div>
                          )}
                          {o.note && (
                            <div className="text-[12px] text-muted mb-1.5">💬 {o.note}</div>
                          )}
                          {o.items.map((it, idx) => (
                            <div key={idx} className="text-[13px] flex justify-between py-0.5">
                              <span>
                                {it.name} × {it.qty}
                              </span>
                              <span>{formatSum(it.price * it.qty)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-[13px] font-bold text-primary mt-1.5 pt-1.5 border-t border-border">
                            <span>Jami</span>
                            <span>{formatSum(o.total)}</span>
                          </div>
                          {o.status === "fulfilled" && (
                            <button
                              onClick={() => openReceipt(o)}
                              className="flex items-center gap-1.5 text-[12px] font-semibold text-primary mt-2.5"
                            >
                              <Receipt size={13} />
                              Chekni ko&apos;rish
                            </button>
                          )}
                          {o.status === "pending" && (
                            <div className="flex items-center gap-4 mt-2.5">
                              <button
                                onClick={() => setEditOrder(o)}
                                className="flex items-center gap-1.5 text-[12px] font-semibold text-primary"
                              >
                                <Pencil size={13} />
                                Tahrirlash
                              </button>
                              <button
                                onClick={() => handleCancelOwn(o.id)}
                                className="flex items-center gap-1.5 text-[12px] font-semibold text-danger"
                              >
                                <X size={13} />
                                Bekor qilish
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {orders.length > historyLimit && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setHistoryLimit((l) => l + 5)}
                      className="flex items-center gap-1.5 border border-primary text-primary rounded-full px-5 py-2 text-sm font-semibold"
                    >
                      Eski buyurtmalarni ko&apos;rsatish
                      <ChevronDown size={15} />
                    </button>
                  </div>
                )}
              </>
            )}

            {tab === "reviews" && (
              <>
                {reviews.length === 0 ? (
                  <div className="text-muted text-sm">Hali hech qanday sharh yozmagansiz.</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {reviews.map((r) => {
                      const product = products.find((p) => p.id === r.productId);
                      return (
                        <div key={r.id} className="bg-white rounded-xl p-3.5 border border-border">
                          <div className="flex justify-between items-start mb-1.5">
                            <div className="text-sm font-semibold">
                              {product ? product.name : "Mahsulot"}
                            </div>
                            <StarRow value={r.rating} />
                          </div>
                          {r.comment && (
                            <div className="text-[13px] text-muted">{r.comment}</div>
                          )}
                          <div className="text-[11px] text-muted mt-1.5">
                            {r.createdAt?.toDate
                              ? r.createdAt.toDate().toLocaleString("uz-UZ")
                              : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        products={products}
      />
      {viewReceipt && (
        <ReceiptModal receipt={viewReceipt} onClose={() => setViewReceipt(null)} />
      )}
      {editOrder && (
        <OrderEditModal
          order={editOrder}
          products={products}
          onClose={() => setEditOrder(null)}
        />
      )}
    </div>
  );
}
