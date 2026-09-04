"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
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

  const content = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.image}
        alt={current.description || "Reklama"}
        className="w-full h-[210px] sm:h-[340px] md:h-[400px] object-cover block"
      />

      <span className="absolute top-3 right-3 bg-white/90 text-ink text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
        <Megaphone size={11} />
        Reklama
      </span>

      {current.description && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent text-white px-6 py-6 sm:py-8">
          <div className="text-lg sm:text-2xl md:text-3xl font-display font-bold max-w-lg leading-snug">
            {current.description}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 bg-[#F0EBE0] shadow-sm">
      {current.link ? (
        <a
          href={current.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative"
        >
          {content}
        </a>
      ) : (
        <div className="relative">{content}</div>
      )}

      {activeAds.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + activeAds.length) % activeAds.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full p-2 shadow"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % activeAds.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full p-2 shadow"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {activeAds.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
