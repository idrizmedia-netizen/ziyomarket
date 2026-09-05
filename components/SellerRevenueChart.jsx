"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatSum } from "../lib/utils";

const DAYS = 14;

function buildDailyData(fulfilledOrders) {
  const days = [];
  const now = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" }),
      revenue: 0,
    });
  }
  const byKey = Object.fromEntries(days.map((d) => [d.key, d]));

  fulfilledOrders.forEach((o) => {
    const ts = o.fulfilledAt?.toDate ? o.fulfilledAt.toDate() : o.createdAt?.toDate?.();
    if (!ts) return;
    const key = ts.toISOString().slice(0, 10);
    if (byKey[key]) byKey[key].revenue += o.total || 0;
  });

  return days;
}

export default function SellerRevenueChart({ fulfilledOrders }) {
  const data = buildDailyData(fulfilledOrders);
  const hasData = data.some((d) => d.revenue > 0);

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="font-bold mb-3">So&apos;nggi 14 kunlik tushum</div>
      {!hasData ? (
        <div className="text-sm text-muted">Hali ma&apos;lumot yo&apos;q.</div>
      ) : (
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E1D2" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#767A8A" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#767A8A" }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
              />
              <Tooltip
                formatter={(value) => [formatSum(value), "Tushum"]}
                contentStyle={{ borderRadius: 10, border: "1px solid #E7E1D2", fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="#233457" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
