"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props { userId: string; firstName: string; }

export default function DashboardChoix({ userId, firstName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  // Auto-redirect if parcours stored in localStorage (post-signup flow)
  useEffect(() => {
    const stored = localStorage.getItem("cf_parcours");
    if (stored) handleChoix(stored);
  }, []);  // eslint-disable-line

  const handleChoix = async (parcours: string) => {
    setLoading(parcours);
    const supabase = createClient();
    await supabase.from("profiles").update({ parcours_defaut: parcours }).eq("id", userId);
    localStorage.removeItem("cf_parcours");
    router.push(parcours === "examen-civique" ? "/dashboard/examen-civique" : "/dashboard");
    router.refresh();
  };

  const cards = [
    {
      key: "examen-civique",
      icon: "quiz",
      title: "Examen civique",
      badge: "QCM",
      desc: "40 questions en 45 minutes sur l'histoire, les institutions et les valeurs de la République.",
      tags: ["Titre de séjour", "Carte de résident", "Naturalisation"],
      bg: "bg-white",
      border: "border-black/[0.08]",
      titleColor: "text-gray-900",
      descColor: "text-gray-500",
    },
    {
      key: "entretien-naturalisation",
      icon: "record_voice_over",
      title: "Entretien de naturalisation",
      badge: "ORAL",
      desc: "555 questions civiques et personnelles pour préparer l'entretien oral avec l'agent préfectoral.",
      tags: ["Questions orales", "Valeurs françaises", "Histoire"],
      bg: "bg-gray-900",
      border: "border-gray-800",
      titleColor: "text-white",
      descColor: "text-white/60",
    },
  ];

  return (
    <div className="px-4 md:px-10 pt-8 pb-10 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider mb-1">Bienvenue</p>
        <h1 className="text-gray-900 text-[28px] md:text-[36px] font-black leading-tight">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-gray-500 text-[15px] mt-2">Quel parcours souhaitez-vous préparer ?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <button
            key={c.key}
            onClick={() => handleChoix(c.key)}
            disabled={loading !== null}
            className={`${c.bg} border ${c.border} rounded-3xl p-6 text-left transition-all duration-200
              hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] cursor-pointer
              disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="size-11 rounded-2xl bg-[#FF4D1C]/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "22px" }}>{c.icon}</span>
              </div>
              <span className="text-[11px] font-bold tracking-widest bg-[#FF4D1C]/10 text-[#FF4D1C] px-2.5 py-1 rounded-full">
                {c.key === loading ? "…" : c.badge}
              </span>
            </div>

            <p className={`${c.titleColor} text-[17px] font-bold mb-2`}>{c.title}</p>
            <p className={`${c.descColor} text-[13px] leading-relaxed mb-4`}>{c.desc}</p>

            <div className="flex flex-wrap gap-1.5">
              {c.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-semibold bg-[#FF4D1C]/10 text-[#FF4D1C] px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-[#FF4D1C] font-bold text-[14px]">
              Choisir ce parcours
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-gray-400 text-[12px] mt-6">
        Vous pourrez changer de parcours depuis votre profil à tout moment.
      </p>
    </div>
  );
}
