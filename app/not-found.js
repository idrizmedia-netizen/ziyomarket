import Link from "next/link";
import { Sparkles, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center bg-bg">
      <Sparkles size={40} className="text-accent mb-4" />
      <div className="font-display text-5xl font-bold text-primary mb-2">404</div>
      <div className="text-lg font-semibold mb-1.5">Sahifa topilmadi</div>
      <p className="text-muted text-sm max-w-sm mb-6">
        Kechirasiz, siz qidirgan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi
        mumkin.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-primary text-white rounded-full px-5 py-2.5 font-semibold text-sm"
      >
        <Home size={15} />
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
