"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { checkIsAdmin, checkIsSeller } from "../lib/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        try {
          const [admin, seller] = await Promise.all([
            checkIsAdmin(firebaseUser.email),
            checkIsSeller(firebaseUser.email),
          ]);
          setIsAdmin(admin);
          setIsSeller(admin || seller);
        } catch (e) {
          setIsAdmin(false);
          setIsSeller(false);
        }
      } else {
        setIsAdmin(false);
        setIsSeller(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSeller, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
