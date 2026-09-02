"use client";

import { useEffect, useState } from "react";
import { Package, TrendingUp, ShoppingCart } from "lucide-react";
import Header from "../../components/Header";
import CartDrawer from "../../components/CartDrawer";
import StatCard from "../../components/StatCard";
import CategoryAdminBlock from "../../components/CategoryAdminBlock";
import AdminManageBlock from "../../components/AdminManageBlock";
import SellerManageBlock from "../../components/SellerManageBlock";
import PendingOrdersBlock from "../../components/PendingOrdersBlock";
import { useAuth } from "../../context/AuthContext";
import {
  subscribeCategories,
  subscribeProducts,
  subscribeAllOrders,
  addCategory,
} from "../../lib/firestore";
import { formatSum } from "../../lib/utils";
import { signInWithGoogle } from "../../lib/auth";

export default function AdminPage() {
  const { user, isAdmin, isSeller, loading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCatName, setNewCatName] = useState("");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const unsubCats = subscribeCategories(setCategories);
    const unsubProds = subscribeProducts(setProducts);
    return () => {
      unsubCats();
      unsubProds();
    };
  }, []);

  useEffect(() => {
    if (!isSeller) return;
    const unsub = subscribeAllOrders(setOrders);
    return () => unsub();
  }, [isSeller]);

  const fulfilledOrders = orders.filter((o) => o.status === "fulfilled");
  const sales = fulfilledOrders.flatMap((o) =>
    o.items.map((it) => ({ ...it, buyer: o.buyerName, date: o.createdAt }))
  );
  const totalQty = sales.reduce((s, r) => s + r.qty, 0);
  const totalRevenue = sales.reduce((s, r) => s + r.qty * r.price, 0);

  return (
    <div className="min-h-screen">
      <Header onCartOpen={() => setCartOpen(true)} search={search} onSearchChange={setSearch} />

      <div className="px-5 py-6 max-w-[1000px] mx-auto pb-16">
        {loading ? (
          <div className="text-muted text-center py-10">Yuklanmoqda...</div>
        ) : !user ? (
          <div className="text-center py-16">
            <div className="text-muted mb-4">Boshqaruv paneli uchun tizimga kiring.</div>
            <button
              onClick={() => signInWithGoogle()}
              className="bg-accent text-primaryDark rounded-full px-5 py-2.5 font-semibold text-sm"
            >
              Google bilan kirish
            </button>
          </div>
        ) : !isSeller ? (
          <div className="text-center py-16 text-muted">
            Sizda boshqaruv paneliga kirish huquqi yo&apos;q. Agar bu xato bo&apos;lsa,
            saytni sozlagan shaxsdan sizni admin yoki sotuvchi qilib qo&apos;shishini
            so&apos;rang.
          </div>
        ) : (
          <>
            <div className="font-display text-2xl mb-5">Boshqaruv paneli</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              <StatCard label="Sotilgan mahsulot" value={`${totalQty} ta`} icon={<Package size={18} />} />
              <StatCard label="Umumiy tushum" value={formatSum(totalRevenue)} icon={<TrendingUp size={18} />} />
              <StatCard label="Yakunlangan buyurtmalar" value={fulfilledOrders.length} icon={<ShoppingCart size={18} />} />
            </div>

            {/* Sotuvchi va admin ikkalasi ham ko'radi va boshqaradi */}
            <PendingOrdersBlock />

            {isAdmin && (
              <>
                <AdminManageBlock currentEmail={user.email} />
                <SellerManageBlock currentEmail={user.email} />

                <div className="bg-white rounded-2xl p-4.5 border border-border mb-6.5">
                  <div className="font-bold mb-2.5">Yangi bo&apos;lim qo&apos;shish</div>
                  <div className="flex gap-2.5">
                    <input
                      placeholder="Bo'lim nomi (masalan: Poyabzal)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm"
                    />
                    <button
                      onClick={() => {
                        if (newCatName.trim()) addCategory(newCatName.trim());
                        setNewCatName("");
                      }}
                      className="bg-primary text-white rounded-lg px-4.5 py-2.5 text-sm font-semibold"
                    >
                      Qo&apos;shish
                    </button>
                  </div>
                </div>

                {categories.map((cat) => (
                  <CategoryAdminBlock
                    key={cat.id}
                    category={cat}
                    products={products.filter((p) => p.categoryId === cat.id)}
                  />
                ))}
              </>
            )}

            <div className="font-display text-lg mt-8 mb-3">Sotuvlar tarixi</div>
            {sales.length === 0 ? (
              <div className="text-muted text-sm">Hali yakunlangan sotuv bo&apos;lmagan.</div>
            ) : (
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-[1.4fr_1fr_0.6fr_0.8fr_1fr] px-3.5 py-2.5 text-xs font-bold text-muted border-b border-border">
                  <span>Mahsulot</span>
                  <span>Bo&apos;lim</span>
                  <span>Soni</span>
                  <span>Summasi</span>
                  <span>Xaridor</span>
                </div>
                {[...sales].reverse().map((r, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1.4fr_1fr_0.6fr_0.8fr_1fr] px-3.5 py-2.5 text-[13px] border-b border-border"
                  >
                    <span>{r.name}</span>
                    <span className="text-muted">{r.categoryName}</span>
                    <span>{r.qty}</span>
                    <span>{formatSum(r.qty * r.price)}</span>
                    <span className="text-muted">{r.buyer}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </div>
  );
}
