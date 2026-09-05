"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeUserOrders } from "../lib/firestore";
import { showOrderNotification } from "../lib/notifications";

export default function OrderStatusWatcher() {
  const { user } = useAuth();
  const prevStatuses = useRef(new Map());
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!user) {
      prevStatuses.current = new Map();
      firstLoad.current = true;
      return;
    }

    const unsub = subscribeUserOrders(user.uid, (orders) => {
      if (firstLoad.current) {
        orders.forEach((o) => prevStatuses.current.set(o.id, o.status));
        firstLoad.current = false;
        return;
      }

      orders.forEach((o) => {
        const prev = prevStatuses.current.get(o.id);
        if (prev && prev !== o.status) {
          if (o.status === "fulfilled") {
            showOrderNotification(
              "ZiyoMarket — buyurtmangiz tayyor!",
              "Siz sotib olgan mahsulotlarni do'kondan olib ketishingiz mumkin."
            );
          } else if (o.status === "cancelled") {
            showOrderNotification(
              "ZiyoMarket — buyurtma bekor qilindi",
              "Buyurtmangiz bekor qilindi. Batafsil profilingizda."
            );
          }
        }
        prevStatuses.current.set(o.id, o.status);
      });
    });

    return () => unsub();
  }, [user]);

  return null;
}
