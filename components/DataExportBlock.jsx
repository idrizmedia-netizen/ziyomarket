"use client";

import { useEffect, useState } from "react";
import { Download, Users } from "lucide-react";
import { subscribeSellers, subscribeAllOrders } from "../lib/firestore";

function downloadCSV(filename, header, rows) {
  const csv = "\uFEFF" + header + "\n" + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DataExportBlock() {
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub1 = subscribeSellers(setSellers);
    const unsub2 = subscribeAllOrders(setOrders);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  function exportSellers() {
    const header = "Ism,Email,Telefon,Do'kon nomi,Manzil,Turi";
    const rows = sellers.map(
      (s) =>
        `"${s.name || ""}","${s.email}","${s.phone || ""}","${s.storeName || ""}","${
          s.address || ""
        }","${s.sellerType || "staff"}"`
    );
    downloadCSV(`ziyomarket-sotuvchilar-${new Date().toISOString().slice(0, 10)}.csv`, header, rows);
  }

  function exportCustomers() {
    const byEmail = {};
    orders.forEach((o) => {
      if (!o.buyerEmail) return;
      if (!byEmail[o.buyerEmail]) {
        byEmail[o.buyerEmail] = {
          name: o.buyerName || "",
          email: o.buyerEmail,
          phone: o.buyerPhone || "",
          orderCount: 0,
          totalSpent: 0,
        };
      }
      if (o.status === "fulfilled") {
        byEmail[o.buyerEmail].orderCount += 1;
        byEmail[o.buyerEmail].totalSpent += o.total || 0;
      }
    });
    const customers = Object.values(byEmail).sort((a, b) => b.totalSpent - a.totalSpent);

    const header = "Ism,Email,Telefon,Xaridlar soni,Jami xarid summasi";
    const rows = customers.map(
      (c) => `"${c.name}","${c.email}","${c.phone}",${c.orderCount},${c.totalSpent}`
    );
    downloadCSV(`ziyomarket-mijozlar-${new Date().toISOString().slice(0, 10)}.csv`, header, rows);
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <Users size={18} className="text-primary" />
        Ma&apos;lumotlarni yuklab olish
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={exportSellers}
          className="flex items-center gap-1.5 border border-primary text-primary rounded-lg px-3.5 py-2 text-sm font-semibold"
        >
          <Download size={14} />
          Sotuvchilar ro&apos;yxati
        </button>
        <button
          onClick={exportCustomers}
          className="flex items-center gap-1.5 border border-primary text-primary rounded-lg px-3.5 py-2 text-sm font-semibold"
        >
          <Download size={14} />
          Mijozlar ro&apos;yxati
        </button>
      </div>
    </div>
  );
}
