"use client";

import { useEffect, useState } from "react";
import { Store, Clock, Check, X, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { subscribeMySellerApplication, submitSellerApplication } from "../lib/firestore";

export default function SellerApplicationBlock() {
  const { user, isSeller } = useAuth();
  const [application, setApplication] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeMySellerApplication(user.uid, setApplication);
    return () => unsub();
  }, [user]);

  if (!user || isSeller) return null;

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Ism familiyangizni kiriting");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitSellerApplication({
        uid: user.uid,
        name: name.trim(),
        email: user.email,
        phone: phone.trim(),
        message: message.trim(),
      });
      setShowForm(false);
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-6">
      <div className="flex items-center gap-2 font-bold mb-2">
        <Store size={18} className="text-primary" />
        Sotuvchi bo&apos;lish
      </div>

      {!application || application.status === "rejected" ? (
        <>
          {application?.status === "rejected" && (
            <div className="flex items-center gap-1.5 text-sm text-danger mb-2.5">
              <X size={14} /> Arizangiz rad etilgan edi. Qayta topshirishingiz mumkin.
            </div>
          )}
          {!showForm ? (
            <>
              <div className="text-xs text-muted mb-3">
                ZiyoMarket&apos;da o&apos;z mahsulotlaringizni sotmoqchimisiz? Ariza
                qoldiring, admin ko&apos;rib chiqadi.
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Ariza qoldirish
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2.5">
              <input
                placeholder="Ism familiya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Telefon raqam (ixtiyoriy)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Nima sotmoqchisiz? (ixtiyoriy)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="border border-border rounded-lg px-3 py-2 text-sm"
              />
              {error && <div className="text-danger text-xs">{error}</div>}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  <Send size={13} />
                  {submitting ? "Yuborilmoqda..." : "Yuborish"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-muted px-3"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}
        </>
      ) : application.status === "pending" ? (
        <div className="flex items-center gap-1.5 text-sm text-accentDark">
          <Clock size={14} /> Arizangiz ko&apos;rib chiqilmoqda.
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-sm text-success">
          <Check size={14} /> Arizangiz tasdiqlandi!
        </div>
      )}
    </div>
  );
}
