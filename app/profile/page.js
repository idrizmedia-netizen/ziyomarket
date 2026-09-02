"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import CartDrawer from "../../components/CartDrawer";
import { useAuth } from "../../context/AuthContext";
import { subscribeUserOrders, subscribeProducts } from "../../lib/firestore";
import { formatSum } from "../../lib/utils";
import { signInWithGoogle } from "../../lib/auth";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserOrders(user.uid, setOrders);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const unsub = subscribeProducts(setProducts);
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen">
      <Header onCartOpen={() => setCartOpen(true)} search={search} onSearchChange={setSearch} />

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

            <div className="font-display text-lg mb-3">Xaridlar tarixi</div>

            {orders.length === 0 ? (
              <div className="text-muted text-sm">Hali hech narsa buyurtma qilinmagan.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((o) => {
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
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </div>
  );
}
