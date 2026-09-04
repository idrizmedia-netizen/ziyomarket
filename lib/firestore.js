"use client";

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

// ---------- Categories ----------

export function subscribeCategories(callback) {
  const q = query(collection(db, "categories"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addCategory(name) {
  await addDoc(collection(db, "categories"), {
    name,
    createdAt: serverTimestamp(),
  });
}

export async function deleteCategory(categoryId) {
  // cascade delete products in this category
  const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, "categories", categoryId));
  await batch.commit();
}

// ---------- Products ----------

export function subscribeProducts(callback) {
  const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addProduct(categoryId, categoryName, data) {
  await addDoc(collection(db, "products"), {
    categoryId,
    categoryName,
    name: data.name,
    image: data.image || "",
    description: data.description || "",
    price: Number(data.price),
    discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
    qty: Number(data.qty),
    ratingSum: 0,
    ratingCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(productId, data) {
  await updateDoc(doc(db, "products", productId), data);
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, "products", productId));
}

// ---------- Orders ----------
// Xarid ikki bosqichli: xaridor "Buyurtma berish" bossa -> status 'pending'
// yaratiladi, tovar soni HALI KAMAYMAYDI. Sotuvchi/admin buyurtmani
// "Sotildi" qilganda -> status 'fulfilled' bo'ladi va aynan o'sha payt
// tovar soni kamayadi (fulfillOrder funksiyasi).

export async function placeOrder({ uid, buyerName, buyerEmail, items }) {
  // items: [{ productId, name, categoryName, price, qty }]
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  await addDoc(collection(db, "orders"), {
    buyerUid: uid,
    buyerName,
    buyerEmail,
    items,
    total,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function fulfillOrder(orderId, sellerEmail) {
  await runTransaction(db, async (tx) => {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists()) throw new Error("Buyurtma topilmadi");
    const order = orderSnap.data();
    if (order.status !== "pending") throw new Error("Bu buyurtma allaqachon yakunlangan");

    const productRefs = order.items.map((it) => doc(db, "products", it.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

    productSnaps.forEach((snap, idx) => {
      if (!snap.exists()) throw new Error("Mahsulot topilmadi");
      if (snap.data().qty < order.items[idx].qty) {
        throw new Error(`"${order.items[idx].name}" uchun yetarli zaxira yo'q`);
      }
    });

    productSnaps.forEach((snap, idx) => {
      tx.update(productRefs[idx], { qty: snap.data().qty - order.items[idx].qty });
    });

    tx.update(orderRef, {
      status: "fulfilled",
      fulfilledAt: serverTimestamp(),
      fulfilledBy: sellerEmail || null,
    });
  });
}

// Do'kon ichida sotuvchi o'zi tanlab, darhol yakunlaydigan sotuv (POS)
export async function createDirectSale({ sellerEmail, sellerName, items, discount = 0, bonus = 0 }) {
  await runTransaction(db, async (tx) => {
    const productRefs = items.map((it) => doc(db, "products", it.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

    productSnaps.forEach((snap, idx) => {
      if (!snap.exists()) throw new Error("Mahsulot topilmadi");
      if (snap.data().qty < items[idx].qty) {
        throw new Error(`"${items[idx].name}" uchun yetarli zaxira yo'q`);
      }
    });

    productSnaps.forEach((snap, idx) => {
      tx.update(productRefs[idx], { qty: snap.data().qty - items[idx].qty });
    });

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const total = Math.max(0, subtotal - Number(discount || 0) - Number(bonus || 0));

    const orderRef = doc(collection(db, "orders"));
    tx.set(orderRef, {
      source: "pos",
      sellerEmail,
      sellerName,
      fulfilledBy: sellerEmail,
      buyerName: "Do'kondagi mijoz",
      buyerEmail: "",
      buyerUid: "",
      items,
      subtotal,
      discount: Number(discount || 0),
      bonus: Number(bonus || 0),
      total,
      status: "fulfilled",
      createdAt: serverTimestamp(),
      fulfilledAt: serverTimestamp(),
    });
  });
}

export async function cancelOrder(orderId) {
  await updateDoc(doc(db, "orders", orderId), {
    status: "cancelled",
    cancelledAt: serverTimestamp(),
  });
}

export function subscribeUserOrders(uid, callback) {
  const q = query(
    collection(db, "orders"),
    where("buyerUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeAllOrders(callback) {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribePendingOrders(callback) {
  const q = query(
    collection(db, "orders"),
    where("status", "==", "pending"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ---------- Reklama karuseli ----------

export function subscribeAds(callback) {
  const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addAd({ image, description, startDate, endDate }) {
  await addDoc(collection(db, "ads"), {
    image,
    description: description || "",
    startDate: startDate || null, // "YYYY-MM-DD" yoki null
    endDate: endDate || null, // "YYYY-MM-DD" yoki null (null = muddatsiz)
    createdAt: serverTimestamp(),
  });
}

export async function deleteAd(id) {
  await deleteDoc(doc(db, "ads", id));
}

export function subscribeCarouselSettings(callback) {
  return onSnapshot(doc(db, "settings", "carousel"), (snap) => {
    callback(snap.exists() ? snap.data() : { intervalSeconds: 5 });
  });
}

export async function setCarouselInterval(seconds) {
  await setDoc(doc(db, "settings", "carousel"), { intervalSeconds: Number(seconds) }, { merge: true });
}

// ---------- Announcements (bildirishnomalar) ----------

export function subscribeAnnouncements(callback) {
  const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addAnnouncement(message) {
  await addDoc(collection(db, "announcements"), {
    message,
    active: true,
    createdAt: serverTimestamp(),
  });
}

export async function toggleAnnouncement(id, active) {
  await updateDoc(doc(db, "announcements", id), { active });
}

export async function deleteAnnouncement(id) {
  await deleteDoc(doc(db, "announcements", id));
}

// ---------- Sharhlar va baholash ----------

export function subscribeReviews(productId, callback) {
  const q = query(
    collection(db, "reviews"),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addReview({ productId, buyerUid, buyerName, rating, comment }) {
  await runTransaction(db, async (tx) => {
    const productRef = doc(db, "products", productId);
    const productSnap = await tx.get(productRef);
    if (!productSnap.exists()) throw new Error("Mahsulot topilmadi");

    const reviewRef = doc(collection(db, "reviews"));
    tx.set(reviewRef, {
      productId,
      buyerUid,
      buyerName,
      rating: Number(rating),
      comment: comment || "",
      createdAt: serverTimestamp(),
    });

    const current = productSnap.data();
    tx.update(productRef, {
      ratingSum: (current.ratingSum || 0) + Number(rating),
      ratingCount: (current.ratingCount || 0) + 1,
    });
  });
}

// ---------- Admins ----------
// Admin ekanligi "admins" collectionida hujjat mavjudligi orqali tekshiriladi.
// Hujjat ID'si foydalanuvchi emaili bo'lishi kerak (masalan: admins/siz@gmail.com)

export async function checkIsAdmin(email) {
  if (!email) return false;
  const snap = await getDoc(doc(db, "admins", email));
  return snap.exists();
}

export function subscribeAdmins(callback) {
  return onSnapshot(collection(db, "admins"), (snap) => {
    callback(snap.docs.map((d) => ({ email: d.id, ...d.data() })));
  });
}

export async function addAdmin(email, addedByEmail) {
  await setDoc(doc(db, "admins", email.trim()), {
    addedBy: addedByEmail || "",
    addedAt: serverTimestamp(),
  });
}

export async function removeAdmin(email) {
  await deleteDoc(doc(db, "admins", email));
}

// ---------- Sellers ----------
// Sotuvchi ekanligi "sellers" collectionida hujjat mavjudligi orqali tekshiriladi.
// Adminlar avtomatik ravishda sotuvchi huquqiga ham ega (checkIsSeller admin
// bo'lsa ham true qaytaradi).

export async function checkIsSeller(email) {
  if (!email) return false;
  const snap = await getDoc(doc(db, "sellers", email));
  return snap.exists();
}

export function subscribeSellers(callback) {
  return onSnapshot(collection(db, "sellers"), (snap) => {
    callback(snap.docs.map((d) => ({ email: d.id, ...d.data() })));
  });
}

export async function addSeller(email, addedByEmail) {
  await setDoc(doc(db, "sellers", email.trim()), {
    addedBy: addedByEmail || "",
    addedAt: serverTimestamp(),
  });
}

export async function removeSeller(email) {
  await deleteDoc(doc(db, "sellers", email));
}
