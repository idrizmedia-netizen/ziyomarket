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
// Har bir MAHSULOT o'z egasiga (createdBy) qarab hisoblanadi — ya'ni agar
// boshqa xodim sizning mahsulotingizni "Sotildi" qilsa ham, savdo SIZNING
// nomingizga yoziladi. Umumiy (createdBy'siz) eski mahsulotlar sotuvni
// amalga oshirgan kishiga (sellerEmail/fulfilledBy) yoziladi.
export function computeSellerStats(orders, products = [], sellers = []) {
  const now = Date.now();
  const map = {};
  const productById = Object.fromEntries(products.map((p) => [p.id, p]));
  const sellerByEmail = Object.fromEntries(sellers.map((s) => [s.email, s]));

  function nameFor(email, fallbackName) {
    const s = sellerByEmail[email];
    return s?.storeName || s?.name || fallbackName || email;
  }

  orders.forEach((o) => {
    const ageDays = (now - orderTimeMs(o)) / 86400000;
    const touchedOwners = new Set();

    (o.items || []).forEach((it) => {
      const product = productById[it.productId];
      const ownerEmail = product?.createdBy || o.sellerEmail || o.fulfilledBy;
      if (!ownerEmail) return;

      const revenue = it.price * it.qty;

      if (!map[ownerEmail]) {
        map[ownerEmail] = {
          email: ownerEmail,
          name: nameFor(ownerEmail, o.sellerName || o.fulfilledByName),
          week: 0,
          weekQty: 0,
          month: 0,
          monthQty: 0,
          year: 0,
          yearQty: 0,
          all: 0,
          allQty: 0,
          orderIds: new Set(),
        };
      }
      const s = map[ownerEmail];
      if (ageDays <= 7) {
        s.week += revenue;
        s.weekQty += it.qty;
      }
      if (ageDays <= 30) {
        s.month += revenue;
        s.monthQty += it.qty;
      }
      if (ageDays <= 365) {
        s.year += revenue;
        s.yearQty += it.qty;
      }
      s.all += revenue;
      s.allQty += it.qty;
      s.orderIds.add(o.id);
      touchedOwners.add(ownerEmail);
    });
  });

  return Object.values(map)
    .map((s) => ({ ...s, orderCount: s.orderIds.size, orderIds: undefined }))
    .sort((a, b) => b.month - a.month);
}
