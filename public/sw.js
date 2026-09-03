// Minimal service worker — faqat ilovani "o'rnatish mumkin" qilish uchun.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // hozircha keshlash yo'q, shunchaki brauzerga standart tarzda javob beriladi
});
