// Minimal service worker — faqat ilovani "o'rnatish mumkin" qilish uchun.
// Fetch handler qo'shilmagan — bo'sh (no-op) handler brauzerda ortiqcha
// yuk va ogohlantirish beradi, shuning uchun kerak emas.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
