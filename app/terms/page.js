import StaticPageShell from "../../components/StaticPageShell";

export const metadata = {
  title: "Foydalanish shartlari | ZiyoMarket",
};

export default function TermsPage() {
  return (
    <StaticPageShell title="Foydalanish shartlari">
      <p>
        ZiyoMarket saytidan foydalanish orqali siz quyidagi shartlarga rozilik
        bildirasiz. Iltimos, ulardan diqqat bilan tanishib chiqing.
      </p>

      <div>
        <h2 className="font-bold mb-1.5">1. Umumiy qoidalar</h2>
        <p>
          ZiyoMarket — mahalliy do&apos;kon va mustaqil sotuvchilarning
          mahsulotlarini bir joyda taqdim etuvchi platforma. Sotib olish
          uchun Google hisobingiz orqali ro&apos;yxatdan o&apos;tishingiz kerak.
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">2. Buyurtma va olib ketish</h2>
        <p>
          Hozircha yetkazib berish xizmati mavjud emas — barcha buyurtmalar
          belgilangan vaqtda do&apos;kondan shaxsan olib ketiladi. Belgilangan
          vaqtda olib ketilmagan buyurtmalar avtomatik bekor qilinishi mumkin.
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">3. Narxlar va chegirmalar</h2>
        <p>
          Har bir mahsulotning narxi sotuvchi tomonidan belgilanadi va
          oldindan ogohlantirmasdan o&apos;zgarishi mumkin. Chegirmali narxlar
          faqat sahifada ko&apos;rsatilgan muddatgacha amal qiladi.
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">4. Mustaqil sotuvchilar</h2>
        <p>
          Platformada o&apos;z mahsulotini sotadigan mustaqil sotuvchilar
          o&apos;z tovarlarining sifati va tavsifining to&apos;g&apos;riligi
          uchun mas&apos;uldir. ZiyoMarket ariza asosida tasdiqlangan
          sotuvchilarga platformadan foydalanish imkonini beradi, ammo har bir
          bitim uchun to&apos;g&apos;ridan-to&apos;g&apos;ri javobgar emas.
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">5. Sharh va baholash</h2>
        <p>
          Faqat haqiqatan mahsulotni sotib olgan foydalanuvchilar sharh
          qoldira oladi. Haqoratli yoki yolg&apos;on sharhlar o&apos;chirilishi
          mumkin.
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-1.5">6. O&apos;zgarishlar</h2>
        <p>
          Ushbu shartlar vaqti-vaqti bilan yangilanishi mumkin. Saytdan
          foydalanishni davom ettirish yangilangan shartlarga rozilik
          bildirish hisoblanadi.
        </p>
      </div>
    </StaticPageShell>
  );
}
