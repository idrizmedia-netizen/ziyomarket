"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Trash2, Upload, Loader2, Clock } from "lucide-react";
import { uploadImage } from "../lib/imgbb";
import {
  subscribeAds,
  addAd,
  deleteAd,
  subscribeCarouselSettings,
  setCarouselInterval,
} from "../lib/firestore";

export default function AdsManageBlock() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ image: "", description: "", link: "", startDate: "", endDate: "" });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [interval, setIntervalValue] = useState(5);

  useEffect(() => {
    const unsub1 = subscribeAds(setAds);
    const unsub2 = subscribeCarouselSettings((s) => setIntervalValue(s.intervalSeconds || 5));
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message || "Rasm yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.image) {
      setError("Avval rasm yuklang");
      return;
    }
    await addAd(form);
    setForm({ image: "", description: "", link: "", startDate: "", endDate: "" });
  }

  async function handleIntervalSave() {
    await setCarouselInterval(interval);
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-8">
      <div className="flex items-center gap-2 font-bold mb-3">
        <ImageIcon size={18} className="text-primary" />
        Reklama karuseli
      </div>

      <div className="bg-bg rounded-lg p-3.5 mb-4">
        <div className="text-xs font-semibold mb-2">Yangi reklama qo&apos;shish</div>

        <label className="flex items-center justify-center gap-1.5 border border-dashed border-border rounded-lg px-3 py-2.5 text-xs cursor-pointer bg-white mb-2.5">
          {uploading ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Yuklanmoqda...
            </>
          ) : form.image ? (
            <>Rasm tanlandi ✓</>
          ) : (
            <>
              <Upload size={13} /> Reklama rasmini tanlash
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {form.image && (
          <div className="mb-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image} alt="" className="h-24 rounded-lg object-cover" />
          </div>
        )}

        <textarea
          placeholder="Tavsif (ixtiyoriy) — masalan: Yangi mahsulotlar keldi!"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm mb-2.5"
          rows={2}
        />

        <input
          type="url"
          placeholder="Havola (ixtiyoriy) — masalan: https://t.me/ziyomarket"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm mb-2.5"
        />

        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          <div>
            <label className="text-[11px] text-muted">Boshlanish sanasi (ixtiyoriy)</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted">Tugash sanasi (bo&apos;sh = muddatsiz)</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
        </div>

        {error && <div className="text-danger text-xs mb-2">{error}</div>}

        <button
          onClick={handleSave}
          disabled={uploading}
          className="w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
        >
          Qo&apos;shish
        </button>
      </div>

      <div className="flex items-center gap-2.5 mb-4">
        <Clock size={15} className="text-muted shrink-0" />
        <span className="text-xs text-muted shrink-0">Almashish oralig&apos;i (soniya):</span>
        <input
          type="number"
          min={2}
          value={interval}
          onChange={(e) => setIntervalValue(e.target.value)}
          className="border border-border rounded-lg px-2 py-1.5 text-sm w-20"
        />
        <button
          onClick={handleIntervalSave}
          className="text-xs font-semibold text-primary border border-primary rounded-lg px-3 py-1.5"
        >
          Saqlash
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {ads.length === 0 && <div className="text-xs text-muted">Hali reklama yo&apos;q.</div>}
        {ads.map((ad) => (
          <div key={ad.id} className="flex items-center gap-3 bg-bg rounded-lg p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ad.image} alt="" className="w-16 h-12 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{ad.description || "(tavsifsiz)"}</div>
              <div className="text-[11px] text-muted">
                {ad.startDate || "boshidan"} — {ad.endDate || "muddatsiz"}
                {ad.link && " · havola bor"}
              </div>
            </div>
            <button onClick={() => deleteAd(ad.id)}>
              <Trash2 size={15} className="text-danger" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
