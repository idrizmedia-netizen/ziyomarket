# ZiyoMarket

Next.js + Firebase (Firestore + Google Auth) asosidagi marketpleys.

Bu loyihada:
- Google orqali haqiqiy kirish (Firebase Authentication)
- Mahsulotlar/bo'limlar Firestore'da saqlanadi va real vaqtda yangilanadi
- Savatcha va "Oldim" tugmasi orqali xarid — zaxira avtomatik kamayadi
- Profilda xaridlar tarixi
- Admin panelda: bo'lim/mahsulot qo'shish, tahrirlash, o'chirish va sotuvlar statistikasi
- Qidiruv (mahsulot nomi bo'yicha)
- `public/logo-icon.svg`, `public/logo-full.svg`, `public/favicon.svg` — tayyor logotiplar

> Eslatma: bu kodni men (Claude) sizga tayyorlab berdim, lekin ishlayotgan muhitimda internetga chiqish imkoni yo'q — shuning uchun Firebase loyihasini yaratish, GitHub'ga yuklash va Vercel'ga deploy qilishni **quyidagi buyruqlar bilan o'zingiz bajarishingiz** kerak. Har bir qadam aniq yozilgan, ~15-20 daqiqa vaqt ketadi.

---

## 1-qadam: Firebase loyihasini yaratish

1. https://console.firebase.google.com ga kiring va **Add project** tugmasini bosing, nomini `ziyomarket` deb qo'ying.
2. Chap menyudan **Build > Authentication** ga o'ting, **Get started** bosing, **Sign-in method** bo'limidan **Google**ni yoqing.
3. Chap menyudan **Build > Firestore Database** ga o'ting, **Create database** bosing, **Production mode**ni tanlang, yaqin regionni tanlang.
4. Loyiha sozlamalariga o'ting: ⚙️ (Project settings) > **General** > pastga tushib **Your apps** bo'limida **</>** (Web) belgisini bosib yangi web-ilova qo'shing, nomini `ziyomarket-web` deb qo'ying.
5. Sizga ko'rsatilgan `firebaseConfig` obyektidagi qiymatlarni nusxalab oling — ular quyidagi qadamda kerak bo'ladi.

## 2-qadam: Loyihani kompyuteringizga tayyorlash

Terminalda loyiha papkasiga kiring va:

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` faylini oching va Firebase konsolidan olgan qiymatlarni joylashtiring:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Lokal ishga tushirish:

```bash
npm run dev
```

Brauzerda http://localhost:3000 oching.

## 3-qadam: O'zingizni admin qilib qo'yish

1. Saytda **"Google bilan kirish"** tugmasi orqali bir marta kiring (o'z Google akkountingiz bilan).
2. Firebase konsolida **Firestore Database** ga o'ting, **Start collection** bosing, nomini `admins` deb yozing.
3. Document ID sifatida **aynan o'zingiz kirgan Google emailingizni** yozing (masalan `sizniki@gmail.com`), ichida istalgan bitta maydon qo'shing (masalan `role: "admin"`).
4. Saqlang. Endi saytga qaytadan kirganingizda (yoki sahifani yangilaganingizda) yon menyuda **"Boshqaruv paneli"** ko'rinadi.

Keyinchalik yana kimnidir admin qilmoqchi bo'lsangiz, xuddi shu `admins` to'plamiga uning emailini qo'shsangiz bo'ldi.

## 4-qadam: Firestore xavfsizlik qoidalarini joylash

Loyihada tayyor `firestore.rules` fayli bor (hammaga o'qishga ochiq bo'limlar/mahsulotlar, faqat adminlar yoza oladi; buyurtmalarni faqat egasi va admin o'qiy oladi). Buni Firebase konsolida qo'lda joylashtirish eng oson yo'l:

1. Firebase konsolida **Firestore Database > Rules** bo'limiga o'ting.
2. `firestore.rules` faylining butun mazmunini nusxalab, konsoldagi qoidalar oynasiga joylashtiring.
3. **Publish** tugmasini bosing.

(Agar Firebase CLI o'rnatgan bo'lsangiz, buni `firebase deploy --only firestore:rules` bilan ham qilsa bo'ladi.)

## 5-qadam: GitHub'ga yuklash

```bash
git init
git add .
git commit -m "ZiyoMarket: boshlang'ich versiya"
```

GitHub'da yangi bo'sh repository yarating (masalan `ziyomarket`), so'ng:

```bash
git remote add origin https://github.com/FOYDALANUVCHI_NOMI/ziyomarket.git
git branch -M main
git push -u origin main
```

`.env.local` fayli `.gitignore`da bor — u GitHub'ga yuklanmaydi (bu to'g'ri, chunki u maxfiy kalitlar).

## 6-qadam: Vercel'ga deploy qilish

1. https://vercel.com ga GitHub akkountingiz bilan kiring.
2. **Add New > Project** tugmasini bosing, endigina yuklagan `ziyomarket` repositoryni tanlang.
3. **Environment Variables** bo'limida `.env.local`dagi barcha 6 ta qiymatni bir xil nomlar bilan qo'shing.
4. **Deploy** tugmasini bosing — bir necha daqiqada sayt jonli bo'ladi (masalan `ziyomarket.vercel.app`).
5. Firebase konsolida **Authentication > Settings > Authorized domains** bo'limiga Vercel bergan domenni (masalan `ziyomarket.vercel.app`) qo'shishni unutmang — aks holda Google kirish xato beradi.

Shundan keyin har safar GitHub'ga `git push` qilganingizda, Vercel avtomatik qayta deploy qiladi.

---

## Keyingi yangiliklar uchun g'oyalar

- Buyurtma holati (yangi / tayyorlanmoqda / yetkazildi) va admin uni o'zgartirishi
- Mahsulot uchun bir nechta rasm va batafsil tavsif
- Kategoriya bo'yicha filtr va narx oralig'i bo'yicha saralash
- SMS/email orqali xarid tasdiqlash xabarnomasi
- Sharh va reyting tizimi
