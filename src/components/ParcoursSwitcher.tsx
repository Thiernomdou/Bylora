"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  current: "examen-civique" | "entretien";
  userId: string;
}

const OPTIONS = [
  { key: "examen-civique" as const, label: "Examen civique",    icon: "quiz",                href: "/dashboard/examen-civique", dbValue: "examen-civique"           },
  { key: "entretien"      as const, label: "Entretien oral",     icon: "record_voice_over",   href: "/dashboard",                dbValue: "entretien-naturalisation" },
];

export default function ParcoursSwitcher({ current, userId }: Props) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const switchTo = async (opt: typeof OPTIONS[number]) => {
    if (opt.key === current || loading) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ parcours_defaut: opt.dbValue }).eq("id", userId);
    router.push(opt.href);
  };

  return (
    <div className="flex bg-black/[0.04] border border-black/[0.07] rounded-2xl p-1 gap-1">
      {OPTIONS.map((opt) => {
        const active = opt.key === current;
        return (
          <button
            key={opt.key}
            onClick={() => switchTo(opt)}
            disabled={active || loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[13px] font-bold transition-all ${
              active
                ? "bg-white text-gray-900 shadow-sm cursor-default"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            <span
              className="material-symbols-outlined shrink-0"
              style={{ fontSize: "16px", fontVariationSettings: active ? `'FILL' 1` : `'FILL' 0` }}
            >
              {opt.icon}
            </span>
            <span className="hidden sm:block">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
