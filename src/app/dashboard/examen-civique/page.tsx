import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PARCOURS_CIVIQUES } from "@/lib/questions-civiques";

export const dynamic = "force-dynamic";

export default async function ExamenCiviquePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="size-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-colors">
          <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>arrow_back</span>
        </Link>
        <div>
          <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Examen civique</p>
          <h1 className="text-gray-900 text-[22px] md:text-[28px] font-black leading-tight">
            Choisissez votre parcours
          </h1>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-gray-900 rounded-2xl p-5 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[#FF4D1C]/20 blur-3xl" />
        <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
          {[
            { val: "40", label: "questions QCM" },
            { val: "45", label: "minutes max" },
            { val: "80%", label: "score requis" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white font-black text-[22px] leading-none">{s.val}</p>
              <p className="text-white/40 text-[11px] font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 thèmes */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-5 shadow-sm">
        <p className="text-gray-900 text-[14px] font-bold mb-3">Les 5 thèmes du programme officiel</p>
        <div className="space-y-2">
          {[
            { icon: "flag",            label: "Principes et valeurs de la République" },
            { icon: "account_balance", label: "Système institutionnel et politique" },
            { icon: "gavel",           label: "Droits et devoirs" },
            { icon: "history_edu",     label: "Histoire, géographie et culture françaises" },
            { icon: "people",          label: "Vivre dans la société française" },
          ].map((t, i) => (
            <div key={t.label} className="flex items-center gap-3 text-[13px] text-gray-600">
              <div className="size-7 rounded-lg bg-[#FAF4EC] border border-[#FF4D1C]/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "14px" }}>{t.icon}</span>
              </div>
              <span>{i + 1}. {t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 parcours cards */}
      <div className="space-y-3">
        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider px-1">Je prépare :</p>
        {Object.entries(PARCOURS_CIVIQUES).map(([key, p]) => (
          <Link
            key={key}
            href={`/dashboard/examen-civique/${key}`}
            className="group flex items-center gap-4 bg-white border border-black/[0.08] rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#FF4D1C]/30 transition-all"
          >
            <div className="size-11 rounded-xl bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "20px" }}>{p.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-gray-900 text-[15px] font-bold">{p.label}</span>
                <span className="text-[10px] font-bold bg-[#FF4D1C]/10 text-[#FF4D1C] px-2 py-0.5 rounded-full">{p.sigle}</span>
              </div>
              <p className="text-gray-400 text-[12px] truncate">{p.desc}</p>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-[#FF4D1C] transition-colors shrink-0" style={{ fontSize: "20px" }}>
              chevron_right
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
