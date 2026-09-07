"use client";

import Link from "next/link";
import { Send, Instagram, Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primaryDark text-white/80 mt-auto pt-8 pb-24 sm:pb-8 px-5">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <div className="font-display text-lg text-white mb-1">ZiyoMarket</div>
          <div className="text-xs">Ishonchli sotuvchilar, qulay narxlar.</div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link href="/profile" className="flex items-center gap-1.5 hover:text-white">
            <Briefcase size={14} />
            Vakansiyalar — sotuvchi bo&apos;ling
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs text-white/50">Bizni kuzating</div>
          <div className="flex gap-3">
            <a
              href="https://instagram.com/normurodov_izzzatillo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              title="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://t.me/ziyomarket_oltinsoy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              title="Telegram"
            >
              <Send size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-white/40 mt-8">
        © {new Date().getFullYear()} ZiyoMarket
      </div>
    </footer>
  );
}
