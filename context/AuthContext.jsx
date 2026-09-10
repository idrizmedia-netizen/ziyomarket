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
        try {
          const [admin, seller] = await Promise.all([
            checkIsAdmin(firebaseUser.email),
            getSellerDoc(firebaseUser.email),
          ]);
          setIsAdmin(admin);
          setIsSeller(admin || !!seller);
          setIsVendor(!!seller && seller.sellerType === "vendor");
          setSellerDoc(seller);
        } catch (e) {
          setIsAdmin(false);
          setIsSeller(false);
          setIsVendor(false);
          setSellerDoc(null);
        }
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
