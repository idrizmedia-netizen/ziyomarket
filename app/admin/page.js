"use client";

import { useEffect, useState } from "react";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  Boxes,
  Settings,
  Download,
} from "lucide-react";
import Header from "../../components/Header";
import CartDrawer from "../../components/CartDrawer";
import FavoritesDrawer from "../../components/FavoritesDrawer";
import StatCard from "../../components/StatCard";
import CategoryAdminBlock from "../../components/CategoryAdminBlock";
import BulkImportBlock from "../../components/BulkImportBlock";
import AdminManageBlock from "../../components/AdminManageBlock";
import SellerManageBlock from "../../components/SellerManageBlock";
import PendingOrdersBlock from "../../components/PendingOrdersBlock";
import QuickSaleBlock from "../../components/QuickSaleBlock";
import SellerStatsBlock from "../../components/SellerStatsBlock";
import SellerRevenueChart from "../../components/SellerRevenueChart";
import AnnouncementsBlock from "../../components/AnnouncementsBlock";
import AdsManageBlock from "../../components/AdsManageBlock";
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
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [tab, setTab] = useState("orders");

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

  const salesByProduct = Object.values(
    sales.reduce((acc, r) => {
      const key = r.name + "|" + r.categoryName;
      if (!acc[key]) {
        acc[key] = { name: r.name, categoryName: r.categoryName, qty: 0, revenue: 0 };
      }
      acc[key].qty += r.qty;
      acc[key].revenue += r.qty * r.price;
      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);

  function exportSalesCSV() {
    const header = "Mahsulot,Bo'lim,Jami soni,Jami summa\n";
    const rows = salesByProduct
      .map((r) => `"${r.name}","${r.categoryName}",${r.qty},${r.revenue}`)
      .join("\n");
    const csv = "\uFEFF" + header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ziyomarket-sotuvlar-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs = [
    { id: "orders", label: "Buyurtmalar", icon: ClipboardList },
    { id: "stats", label: "Statistika", icon: BarChart3 },
    ...(isAdmin ? [{ id: "products", label: "Mahsulotlar", icon: Boxes }] : []),
    ...(isAdmin ? [{ id: "settings", label: "Sozlamalar", icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onFavoritesOpen={() => setFavoritesOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

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

            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                      active ? "bg-primary text-white" : "bg-white border border-border text-ink"
                    }`}
                  >
                    <Icon size={15} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {tab === "orders" && (
              <>
                <PendingOrdersBlock />
                <QuickSaleBlock products={products} />
              </>
            )}

            {tab === "stats" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
                  <StatCard label="Sotilgan mahsulot" value={`${totalQty} ta`} icon={<Package size={18} />} />
                  <StatCard label="Umumiy tushum" value={formatSum(totalRevenue)} icon={<TrendingUp size={18} />} />
                  <StatCard label="Yakunlangan buyurtmalar" value={fulfilledOrders.length} icon={<ShoppingCart size={18} />} />
                </div>

                <SellerStatsBlock
                  fulfilledOrders={fulfilledOrders}
                  mode={isAdmin ? "admin" : "seller"}
                  currentEmail={user.email}
                />

                <SellerRevenueChart fulfilledOrders={fulfilledOrders} />

                <div className="flex items-center justify-between mt-8 mb-3">
                  <div className="font-display text-lg">Sotuvlar tarixi</div>
                  {salesByProduct.length > 0 && (
                    <button
                      onClick={exportSalesCSV}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary rounded-lg px-3 py-1.5"
                    >
                      <Download size={13} />
                      Excel&apos;ga yuklab olish
                    </button>
                  )}
                </div>
                {salesByProduct.length === 0 ? (
                  <div className="text-muted text-sm">Hali yakunlangan sotuv bo&apos;lmagan.</div>
                ) : (
                  <div className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr] px-3.5 py-2.5 text-xs font-bold text-muted border-b border-border">
                      <span>Mahsulot</span>
                      <span>Bo&apos;lim</span>
                      <span>Jami soni</span>
                      <span>Jami summa</span>
                    </div>
                    {salesByProduct.map((r, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr] px-3.5 py-2.5 text-[13px] border-b border-border last:border-0"
                      >
                        <span className="font-medium">{r.name}</span>
                        <span className="text-muted">{r.categoryName}</span>
                        <span>{r.qty} ta</span>
                        <span className="font-semibold text-primary">{formatSum(r.revenue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "products" && isAdmin && (
              <>
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

                <BulkImportBlock categories={categories} />

                {categories.map((cat) => (
                  <CategoryAdminBlock
                    key={cat.id}
                    category={cat}
                    products={products.filter((p) => p.categoryId === cat.id)}
                  />
                ))}
              </>
            )}

            {tab === "settings" && isAdmin && (
              <>
                <AnnouncementsBlock />
                <AdsManageBlock />
                <AdminManageBlock currentEmail={user.email} />
                <SellerManageBlock currentEmail={user.email} />
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
    </div>
  );
}
