"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, ShieldCheck, Search, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { signInWithGoogle, signOutUser } from "../lib/auth";
import InstallButton from "./InstallButton";
import NotificationBell from "./NotificationBell";

export default function Header({ onCartOpen, search, onSearchChange }) {
  const { user, isAdmin, isSeller } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  async function handleLogin() {
    try {
      await signInWithGoogle();
    } catch (e) {
      alert("Kirishda xatolik: " + e.message);
    }
  }

  return (
    <div className="bg-primary text-white px-5 py-3 flex items-center justify-between gap-3 flex-wrap sticky top-0 z-30">
      <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold shrink-0">
        <Sparkles size={20} className="text-accent" />
        ZiyoMarket
      </Link>

      <div className="flex-1 min-w-[220px] max-w-md flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <Search size={16} className="text-white/60" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Mahsulot qidirish..."
          className="bg-transparent outline-none text-sm placeholder-white/50 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onCartOpen} className="relative">
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-accent text-primaryDark text-[11px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </button>

        <InstallButton />
        <NotificationBell />

        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm"
            >
              <User size={16} />
              {user.displayName?.split(" ")[0] || "Foydalanuvchi"}
              {isAdmin && <ShieldCheck size={14} className="text-accent" />}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 bg-white text-ink rounded-lg shadow-xl min-w-[180px] overflow-hidden z-40">
                <Link
                  href="/profile"
                  className="block px-4 py-2.5 text-sm hover:bg-bg"
                  onClick={() => setMenuOpen(false)}
                >
                  Profil
                </Link>
                {isSeller && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2.5 text-sm hover:bg-bg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Boshqaruv paneli
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOutUser();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-bg"
                >
                  Chiqish
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-accent text-primaryDark rounded-full px-4 py-2 text-sm font-semibold"
          >
            Google bilan kirish
          </button>
        )}
      </div>
    </div>
  );
}
