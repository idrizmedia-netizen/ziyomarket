"use client";

import {
  collection,
  doc,
  addDoc,
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
    price: Number(data.price),
    qty: Number(data.qty),
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

export async function placeOrder({ uid, buyerName, buyerEmail, items }) {
  // items: [{ productId, name, categoryName, price, qty }]
  await runTransaction(db, async (tx) => {
    const productRefs = items.map((it) => doc(db, "products", it.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

    productSnaps.forEach((snap, idx) => {
      if (!snap.exists()) throw new Error("Mahsulot topilmadi");
      const current = snap.data().qty;
      if (current < items[idx].qty) {
        throw new Error(`"${items[idx].name}" uchun yetarli zaxira yo'q`);
      }
    });

    productSnaps.forEach((snap, idx) => {
      tx.update(productRefs[idx], { qty: snap.data().qty - items[idx].qty });
    });

    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    const orderRef = doc(collection(db, "orders"));
    tx.set(orderRef, {
      buyerUid: uid,
      buyerName,
      buyerEmail,
      items,
      total,
      createdAt: serverTimestamp(),
    });
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

// ---------- Admins ----------
// Admin ekanligi "admins" collectionida hujjat mavjudligi orqali tekshiriladi.
// Hujjat ID'si foydalanuvchi emaili bo'lishi kerak (masalan: admins/siz@gmail.com)

export async function checkIsAdmin(email) {
  if (!email) return false;
  const snap = await getDoc(doc(db, "admins", email));
  return snap.exists();
}
