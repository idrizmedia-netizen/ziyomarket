"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { subscribeAds, subscribeCarouselSettings } from "../lib/firestore";

function isAdActive(ad) {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  if (ad.startDate && today < ad.startDate) return false;
  if (ad.endDate && today > ad.endDate) return false;
  return true;
}

export default function AdCarousel() {
  const [ads, setAds] = useState([]);
  const [intervalSeconds, setIntervalSeconds] = useState(5);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsub1 = subscribeAds(setAds);
    const unsub2 = subscribeCarouselSettings((s) => setIntervalSeconds(s.intervalSeconds || 5));
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const activeAds = useMemo(() => ads.filter(isAdActive), [ads]);

  useEffect(() => {
    if (activeAds.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % activeAds.length);
    }, Math.max(2, intervalSeconds) * 1000);
    return () => clearInterval(timer);
  }, [activeAds.length, intervalSeconds]);

  useEffect(() => {
    if (index >= activeAds.length) setIndex(0);
  }, [activeAds.length, index]);

  if (activeAds.length === 0) return null;

  const current = activeAds[index];

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 bg-[#F0EBE0]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.image}
        alt={current.description || "Reklama"}
        className="w-full h-[180px] sm:h-[260px] object-cover block"
      />
      {current.description && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white px-5 py-4 text-sm sm:text-base font-medium">
          {current.description}
        </div>
      )}

      {activeAds.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + activeAds.length) % activeAds.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % activeAds.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 right-3 flex gap-1.5">
            {activeAds.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
