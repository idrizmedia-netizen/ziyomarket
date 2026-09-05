"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { subscribePendingOrders, fulfillOrder, cancelOrder } from "../lib/firestore";
import { formatSum } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function PendingOrdersBlock() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [resultMap, setResultMap] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = subscribePendingOrders(setOrders);
    return () => unsub();
  }, []);

  async function handleFulfill(orderId) {
    setError("");
    setBusyId(orderId);
    try {
      await fulfillOrder(orderId, user?.email, user?.displayName || user?.email);
      setResultMap((prev) => ({ ...prev, [orderId]: "fulfilled" }));
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancel(orderId) {
    setError("");
    setBusyId(orderId);
    try {
      await cancelOrder(orderId);
      setResultMap((prev) => ({ ...prev, [orderId]: "cancelled" }));
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <Clock size={18} className="text-accentDark" />
        Yangi buyurtmalar
        {orders.length > 0 && (
          <span className="bg-accent text-primaryDark text-xs font-bold rounded-full px-2 py-0.5">
            {orders.length}
          </span>
        )}
      </div>

      {error && <div className="text-danger text-xs mb-2">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-sm text-muted">Hozircha yangi buyurtma yo&apos;q.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => {
            const result = resultMap[o.id];
            return (
              <div key={o.id} className="border border-border rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="text-sm font-semibold">{o.buyerName}</div>
                    <div className="text-xs text-muted">{o.buyerEmail}</div>
                  </div>
                  <div className="text-sm font-bold text-primary">{formatSum(o.total)}</div>
                </div>
                <div className="text-[11px] text-muted mb-2">
                  {o.createdAt?.toDate
                    ? o.createdAt.toDate().toLocaleString("uz-UZ")
                    : "hozirgina"}
                </div>
                <div className="mb-2.5">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="text-[13px] flex justify-between py-0.5">
                      <span>
                        {it.name} × {it.qty}
                      </span>
                      <span className="text-muted">{formatSum(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>

                {result ? (
                  <div
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold ${
                      result === "fulfilled"
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {result === "fulfilled" ? (
                      <>
                        <Check size={14} /> Sotildi
                      </>
                    ) : (
                      <>
                        <X size={14} /> Bekor qilindi
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === o.id}
                      onClick={() => handleFulfill(o.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-success text-white rounded-lg py-2 text-[13px] font-semibold disabled:opacity-60"
                    >
                      <Check size={14} /> Sotildi
                    </button>
                    <button
                      disabled={busyId === o.id}
                      onClick={() => handleCancel(o.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-danger text-danger rounded-lg py-2 text-[13px] font-semibold disabled:opacity-60"
                    >
                      <X size={14} /> Bekor qilish
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
