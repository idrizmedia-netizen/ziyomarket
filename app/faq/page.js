"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import StaticPageShell from "../../components/StaticPageShell";

const FAQS = [
  {
    q: "Buyurtma qanday beriladi?",
    a: "Mahsulotni savatchaga qo'shing, telefon raqamingiz va olib ketish vaqtini kiriting, so'ng \"Buyurtma berish\"ni bosing.",
  },
  {
    q: "Yetkazib berish bormi?",
    a: "Hozircha yo'q. Buyurtmangiz tayyor bo'lgach, belgilagan vaqtda do'kondan o'zingiz olib ketasiz.",
  },
  {
    q: "Belgilangan vaqtda kelolmasam nima bo'ladi?",
    a: "Vaqt o'tib ketsa, buyurtma tizim tomonidan avtomatik bekor qilinadi. Xavotir olmang — istalgan vaqt yangi buyurtma berishingiz mumkin.",
  },
  {
    q: "Buyurtmamni bekor qila olamanmi?",
    a: "Ha, u \"Kutilmoqda\" holatida ekan, profilingizdagi \"Buyurtmalarim\" bo'limidan bekor qilishingiz yoki tahrirlashingiz mumkin.",
  },
  {
    q: "Sotuvchi bo'lish uchun nima qilish kerak?",
    a: "Profilingizdagi \"Sotuvchi bo'lish\" bo'limidan ariza to'ldiring. Admin ko'rib chiqib, tasdiqlaydi.",
  },
  {
    q: "Sharh qanday qoldiriladi?",
    a: "Faqat sotib olgan (buyurtmangiz \"Sotib oldingiz\" holatiga o'tgan) mahsulotga sharh va baho qoldirishingiz mumkin.",
  },
  {
    q: "Savolim bo'lsa kimga murojaat qilaman?",
    a: "Telegram kanalimizga yozing yoki (sotuvchi bo'lsangiz) boshqaruv panelidagi \"Chat\" orqali adminga murojaat qiling.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <StaticPageShell title="Ko'p beriladigan savollar">
      <div className="flex flex-col gap-2.5">
        {FAQS.map((item, idx) => {
          const open = openIdx === idx;
          return (
            <div key={idx} className="bg-white border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(open ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm"
              >
                {item.q}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="px-4 pb-3.5 text-sm text-muted leading-relaxed">{item.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </StaticPageShell>
  );
}
