"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  ShieldCheck,
  Search,
  Sparkles,
  Heart,
  Send,
  Moon,
  Sun,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { signInWithGoogle, signOutUser } from "../lib/auth";
import InstallButton from "./InstallButton";
import NotificationBell from "./NotificationBell";

export default function Header({
  onCartOpen,
  onFavoritesOpen,
  search,
  onSearchChange,
  suggestionsSource,
}) {
  const { user, isAdmin, isSeller } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { lang, setLang, t } = useLanguage();
  const { dark, toggleDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const suggestions =
    suggestionsSource && search.trim()
      ? suggestionsSource
          .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
          .slice(0, 5)
      : [];

  async function handleLogin() {
    try {
      await signInWithGoogle();
    } catch (e) {
      alert("Kirishda xatolik: " + e.message);
    }
  }

  return (
    <div className="bg-primary text-white px-3 sm:px-5 py-3 flex items-center justify-between gap-2 sm:gap-3 sticky top-0 z-30">
      <Link
        href="/"
        className="flex items-center gap-1.5 sm:gap-2 font-display text-lg sm:text-2xl font-bold shrink-0"
      >
        <Sparkles size={18} className="text-accent shrink-0" />
        <span className="inline">ZiyoMarket</span>
      </Link>

      <div className="flex-1 min-w-0 max-w-md flex items-center gap-2 bg-white/10 rounded-full px-3 sm:px-4 py-2 relative">
        <Search size={15} className="text-white/60 shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setSuggestOpen(true)}
          onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
          placeholder={t("search_placeholder")}
          className="bg-transparent outline-none text-sm placeholder-white/50 w-full min-w-0"
        />

        {suggestOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-11 bg-white text-ink rounded-xl shadow-xl overflow-hidden z-40">
            {suggestions.map((p) => (
              <button
                key={p.id}
                onMouseDown={() => {
                  onSearchChange(p.name);
                  setSuggestOpen(false);
                }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm hover:bg-bg"
              >
                <Search size={13} className="text-muted shrink-0" />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button onClick={onFavoritesOpen} className="relative w-8 h-8 flex items-center justify-center">
          <Heart size={19} />
          {favorites.length > 0 && (
            <span className="absolute top-0 right-0 bg-accent text-primaryDark text-[10px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5">
              {favorites.length}
            </span>
          )}
        </button>

        <button onClick={onCartOpen} className="relative w-8 h-8 flex items-center justify-center">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-accent text-primaryDark text-[10px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5">
              {cartCount}
            </span>
          )}
        </button>

        <NotificationBell />

        {/* Kompyuterda hammasi ko'rinadi */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "uz" ? "ru" : lang === "ru" ? "en" : "uz")}
            className="bg-white/10 rounded-full px-2.5 py-1 text-xs font-bold"
          >
            {lang.toUpperCase()}
          </button>
          <a
            href="https://t.me/ziyomarket_oltinsoy"
            target="_blank"
            rel="noopener noreferrer"
            title="Telegram kanalimiz"
            className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-xs font-semibold"
          >
            <Send size={13} />
            Telegram
          </a>
          <button
            onClick={toggleDark}
            title={dark ? "Yorug' rejim" : "Qorong'i rejim"}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <InstallButton />
        </div>

        {/* Telefonda "..." ichiga yig'ilgan */}
        <div className="relative md:hidden">
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <MoreVertical size={19} />
          </button>
          {moreOpen && (
            <div className="absolute right-0 top-9 bg-white text-ink rounded-xl shadow-xl min-w-[180px] overflow-hidden z-40">
              <button
                onClick={() => {
                  setLang(lang === "uz" ? "ru" : lang === "ru" ? "en" : "uz");
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-bg"
              >
                Til / Язык / Lang
                <span className="font-bold">{lang.toUpperCase()}</span>
              </button>
              <a
                href="https://t.me/ziyomarket_oltinsoy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-bg"
              >
                <Send size={14} /> Telegram
              </a>
              <button
                onClick={toggleDark}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-bg text-left"
              >
                {dark ? <Sun size={14} /> : <Moon size={14} />}
                {dark ? "Yorug' rejim" : "Qorong'i rejim"}
              </button>
              <div className="px-4 py-2.5">
                <InstallButton />
              </div>
            </div>
          )}
        </div>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="bg-white/10 rounded-full pl-1.5 pr-2 sm:px-3 py-1.5 flex items-center gap-1.5 text-sm max-w-[110px] sm:max-w-none"
            >
              <User size={15} className="shrink-0" />
              <span className="hidden sm:inline truncate">
                {user.displayName?.split(" ")[0] || "Foydalanuvchi"}
              </span>
              {isAdmin && <ShieldCheck size={13} className="text-accent shrink-0" />}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 bg-white text-ink rounded-lg shadow-xl min-w-[180px] overflow-hidden z-40">
                <Link
                  href="/profile"
                  className="block px-4 py-2.5 text-sm hover:bg-bg"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("profile")}
                </Link>
                {isSeller && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2.5 text-sm hover:bg-bg"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("admin_panel")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOutUser();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-bg"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-accent text-primaryDark rounded-full px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap"
          >
            <span className="sm:hidden">Kirish</span>
            <span className="hidden sm:inline">{t("login_google")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
