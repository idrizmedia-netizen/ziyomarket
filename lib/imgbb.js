"use client";

const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

/**
 * Rasm faylini ImgBB'ga yuklaydi va doimiy URL qaytaradi.
 * Bepul, kartasiz — Cloudinary o'rniga (geografik cheklovga uchramaydi).
 */
export async function uploadImage(file) {
  if (!API_KEY) {
    throw new Error(
      "ImgBB sozlanmagan. .env.local faylida NEXT_PUBLIC_IMGBB_API_KEY to'ldirilganini tekshiring."
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.error?.message || "Rasm yuklashda xatolik");
  }

  return data.data.url;
}
