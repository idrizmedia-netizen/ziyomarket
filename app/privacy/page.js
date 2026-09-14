import StaticPageShell from "../../components/StaticPageShell";

export const metadata = {
  title: "Maxfiylik siyosati | ZiyoMarket",
};

export default function PrivacyPage() {
  return (
    <StaticPageShell title="Maxfiylik siyosati">
      <p>
        Sizning shaxsiy ma&apos;lumotlaringiz xavfsizligi biz uchun muhim.
        Ushbu sahifada qanday ma&apos;lumot to&apos;planishi va ulardan qanday
        foydalanilishi tushuntiriladi.
      </p>

      <div>
        <h2 className="font-bold mb-1.5">Qanday ma&apos;lumot to&apos;planadi</h2>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Google hisobingizdan ism va email manzil (kirish uchun)</li>
          <li>Buyurtma berishda kiritgan telefon raqamingiz</li>
          <li>Sotuvchi bo&apos;lish uchun ariza berilsa — do&apos;kon nomi, manzil, telefon</li>
          <li>Xarid tarixi va yozgan sharhlaringiz</li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">Ma&apos;lumotlardan qanday foydalanamiz</h2>
        <p>
          Ma&apos;lumotlaringiz faqat buyurtmangizni tayyorlash, siz bilan
          bog&apos;lanish va xizmat sifatini yaxshilash uchun ishlatiladi.
          Ular hech qachon uchinchi tomonlarga sotilmaydi yoki reklama
          maqsadida ulashilmaydi.
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">Ma&apos;lumotlar qayerda saqlanadi</h2>
        <p>
          Barcha ma&apos;lumotlar Google Firebase infratuzilmasida xavfsiz
          saqlanadi va faqat tegishli ruxsatga ega shaxslar (siz, tegishli
          sotuvchi va administratorlar) tomonidan ko&apos;rilishi mumkin.
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">O&apos;chirish huquqi</h2>
        <p>
          Agar hisobingiz va unga bog&apos;liq ma&apos;lumotlarni
          o&apos;chirtirmoqchi bo&apos;lsangiz, Telegram kanalimiz orqali
          murojaat qiling.
        </p>
      </div>
    </StaticPageShell>
  );
}
