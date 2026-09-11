"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { checkIsAdmin, getSellerDoc } from "../lib/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [sellerDoc, setSellerDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        // Ikkala tekshiruvni ALOHIDA-ALOHIDA bajaramiz — biri "ruxsat yo'q"
        // xatosi bilan tugasa ham (masalan admin bo'lmagan odam uchun
        // /admins/{email} o'qish taqiqlangan), ikkinchisi baribir ishlashi
        // kerak.
        const admin = await checkIsAdmin(firebaseUser.email).catch(() => false);
        const seller = await getSellerDoc(firebaseUser.email).catch(() => null);

        setIsAdmin(admin);
        setIsSeller(admin || !!seller);
        setIsVendor(!!seller && seller.sellerType === "vendor");
        setSellerDoc(seller);
      } else {
        setIsAdmin(false);
        setIsSeller(false);
        setIsVendor(false);
        setSellerDoc(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSeller, isVendor, sellerDoc, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
