"use client";

import { useEffect, useState } from "react";

interface Props { onOpenAuth: () => void; }

export default function StickyCta({ onOpenAuth }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pricing = document.getElementById("pricing");
    if (!pricing) return;
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(false); }, { threshold: 0.1 });
    observer.observe(pricing);
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-black/[0.07] px-5 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden shadow-lg">
      <button
        onClick={onOpenAuth}
        className="w-full bg-[#FF4D1C] text-white py-3.5 rounded-full text-[15px] font-bold cursor-pointer hover:bg-[#E8421A] transition-colors shadow-md"
      >
        Commencer · dès 9,99 €
      </button>
    </div>
  );
}
