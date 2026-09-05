"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, Upload, Download, Loader2, Image as ImageIcon } from "lucide-react";
import { addProduct } from "../lib/firestore";
import { uploadImage } from "../lib/imgbb";

const TEMPLATE_ROWS = [
  ["Bo'lim", "Nomi", "Narxi", "Chegirmali narx", "Soni", "Tavsif", "Rasm fayli", "Rasm URL"],
  ["Ruchkalar", "Gel ruchka ko'k", "5000", "", "50", "Yozadi silliq", "ruchka1.jpg", ""],
];

function fileKey(name) {
  return name.replace(/\.[^/.]+$/, "").trim().toLowerCase();
}

export default function BulkImportBlock({ categories }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet(TEMPLATE_ROWS);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mahsulotlar");
    XLSX.writeFile(wb, "ziyomarket-namuna.xlsx");
  }

  function handleImagesSelected(e) {
    setImageFiles(Array.from(e.target.files || []));
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const imageMap = new Map(imageFiles.map((f) => [fileKey(f.name), f]));

      let success = 0;
      let failed = 0;
      const categoryCache = new Map(categories.map((c) => [c.name.toLowerCase(), c]));

      for (const row of rows) {
        try {
          const catName = String(row["Bo'lim"] || "").trim();
          const name = String(row["Nomi"] || "").trim();
          const price = Number(row["Narxi"]);
          const qty = Number(row["Soni"]);
          if (!catName || !name || !price || Number.isNaN(qty)) {
            failed++;
            continue;
          }

          const cat = categoryCache.get(catName.toLowerCase());
          if (!cat) {
            failed++;
            continue;
          }

          const discountPrice = Number(row["Chegirmali narx"]) || null;
          const description = String(row["Tavsif"] || "");
          const imageFileName = String(row["Rasm fayli"] || "").trim();
          const imageUrlColumn = String(row["Rasm URL"] || "").trim();

          let images = [];
          if (imageFileName && imageMap.has(fileKey(imageFileName))) {
            const url = await uploadImage(imageMap.get(fileKey(imageFileName)));
            images = [url];
          } else if (imageUrlColumn) {
            images = [imageUrlColumn];
          }

          await addProduct(cat.id, cat.name, {
            name,
            price,
            qty,
            discountPrice,
            description,
            images,
          });
          success++;
        } catch (rowErr) {
          failed++;
        }
      }

      setResult({ success, failed, total: rows.length });
    } catch (err) {
      setError(err.message || "Faylni o'qishda xatolik");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-border mb-6.5">
      <div className="flex items-center gap-2 font-bold mb-2">
        <FileSpreadsheet size={18} className="text-primary" />
        Excel orqali ommaviy qo&apos;shish
      </div>
      <div className="text-xs text-muted mb-3">
        Ustunlar: <b>Bo&apos;lim, Nomi, Narxi, Chegirmali narx, Soni, Tavsif, Rasm fayli, Rasm URL</b>.
        Bo&apos;lim nomi mavjud bo&apos;lgan bo&apos;limlardan biriga aynan mos kelishi kerak.
        <br />
        <b>Rasm fayli</b> — pastda tanlagan rasm fayllaringizdan birining nomi (masalan{" "}
        <code>ruchka1.jpg</code>). Fayl nomi bo&apos;lmasa, <b>Rasm URL</b> ustuni ishlatiladi.
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-1.5 border border-primary text-primary rounded-lg px-3.5 py-2 text-sm font-semibold w-fit"
        >
          <Download size={14} />
          Namuna yuklab olish
        </button>

        <label className="flex items-center gap-1.5 border border-dashed border-border rounded-lg px-3.5 py-2 text-sm cursor-pointer w-fit">
          <ImageIcon size={14} />
          Rasm fayllarini tanlash {imageFiles.length > 0 && `(${imageFiles.length} ta tanlandi)`}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesSelected}
            className="hidden"
          />
        </label>

        <label className="flex items-center gap-1.5 bg-primary text-white rounded-lg px-3.5 py-2 text-sm font-semibold cursor-pointer w-fit">
          {busy ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Yuklanmoqda...
            </>
          ) : (
            <>
              <Upload size={14} /> Excel faylni tanlash (.xlsx / .csv)
            </>
          )}
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFile}
            disabled={busy}
            className="hidden"
          />
        </label>
      </div>

      {error && <div className="text-danger text-xs mt-2.5">{error}</div>}

      {result && (
        <div className="text-sm mt-3 bg-bg rounded-lg px-3.5 py-2.5">
          Jami {result.total} qator: <b className="text-success">{result.success} ta qo&apos;shildi</b>
          {result.failed > 0 && (
            <>
              , <b className="text-danger">{result.failed} ta o&apos;tkazib yuborildi</b> (bo&apos;lim
              topilmadi yoki maydon bo&apos;sh)
            </>
          )}
          .
        </div>
      )}
    </div>
  );
}
