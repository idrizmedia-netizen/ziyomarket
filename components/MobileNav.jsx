"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { isSeller } = useAuth();

  const items = [
    { href: "/", label: "Bosh sahifa", icon: Home },
    { href: "/profile", label: "Profil", icon: User },
    ...(isSeller ? [{ href: "/admin", label: "Boshqaruv", icon: ShieldCheck }] : []),
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-30 pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              active ? "text-primary" : "text-muted"
            }`}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
