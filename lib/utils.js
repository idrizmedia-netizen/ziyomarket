export function formatSum(n) {
  return (
    Math.round(n || 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
  );
}

function orderTimeMs(order) {
  if (order.fulfilledAt?.toDate) return order.fulfilledAt.toDate().getTime();
  if (order.createdAt?.toDate) return order.createdAt.toDate().getTime();
  return Date.now();
}

// Har bir sotuvchi bo'yicha so'nggi 7/30/365 kunlik savdo statistikasi.
// orders — faqat status === 'fulfilled' bo'lgan buyurtmalar bo'lishi kerak.
export function computeSellerStats(orders) {
  const now = Date.now();
  const map = {};

  orders.forEach((o) => {
    const sellerEmail = o.sellerEmail || o.fulfilledBy;
    if (!sellerEmail) return;
    const ageDays = (now - orderTimeMs(o)) / 86400000;
    const revenue = o.total || 0;
    const qty = (o.items || []).reduce((s, it) => s + it.qty, 0);

    if (!map[sellerEmail]) {
      map[sellerEmail] = {
        email: sellerEmail,
        name: o.sellerName || o.fulfilledByName || sellerEmail,
        week: 0,
        weekQty: 0,
        month: 0,
        monthQty: 0,
        year: 0,
        yearQty: 0,
      };
    }
    const s = map[sellerEmail];
    if (ageDays <= 7) {
      s.week += revenue;
      s.weekQty += qty;
    }
    if (ageDays <= 30) {
      s.month += revenue;
      s.monthQty += qty;
    }
    if (ageDays <= 365) {
      s.year += revenue;
      s.yearQty += qty;
    }
  });

  return Object.values(map).sort((a, b) => b.month - a.month);
}
