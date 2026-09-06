"use client";

import { useEffect, useState } from "react";
import { UserPlus2, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeSellerApplications,
  approveSellerApplication,
  rejectSellerApplication,
} from "../lib/firestore";

export default function SellerApplicationsAdminBlock() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const unsub = subscribeSellerApplications(setApps);
    return () => unsub();
  }, []);

  const pending = apps.filter((a) => a.status === "pending");

  async function handleApprove(app) {
    setBusyId(app.uid);
    try {
      await approveSellerApplication(app, user?.email);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(app) {
    setBusyId(app.uid);
    try {
      await rejectSellerApplication(app.uid, user?.email);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <UserPlus2 size={18} className="text-primary" />
        Sotuvchi arizalari
        {pending.length > 0 && (
          <span className="bg-accent text-primaryDark text-xs font-bold rounded-full px-2 py-0.5">
            {pending.length}
          </span>
        )}
      </div>

      {pending.length === 0 ? (
        <div className="text-sm text-muted">Hozircha yangi ariza yo&apos;q.</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {pending.map((a) => (
            <div key={a.uid} className="border border-border rounded-xl p-3">
              <div className="text-sm font-semibold">{a.name}</div>
              <div className="text-xs text-muted">{a.email}</div>
              {a.phone && <div className="text-xs text-muted">{a.phone}</div>}
              {a.message && <div className="text-sm mt-1.5">{a.message}</div>}
              <div className="flex gap-2 mt-2.5">
                <button
                  disabled={busyId === a.uid}
                  onClick={() => handleApprove(a)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-success text-white rounded-lg py-2 text-[13px] font-semibold disabled:opacity-60"
                >
                  <Check size={14} /> Tasdiqlash
                </button>
                <button
                  disabled={busyId === a.uid}
                  onClick={() => handleReject(a)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-danger text-danger rounded-lg py-2 text-[13px] font-semibold disabled:opacity-60"
                >
                  <X size={14} /> Rad etish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
