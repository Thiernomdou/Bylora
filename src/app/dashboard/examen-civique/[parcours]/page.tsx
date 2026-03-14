import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PARCOURS_CIVIQUES } from "@/lib/questions-civiques";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ parcours: string }> }

export default async function ParcoursPage({ params }: Props) {
  const { parcours } = await params;
  if (!PARCOURS_CIVIQUES[parcours]) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const p = PARCOURS_CIVIQUES[parcours];

  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/examen-civique" className="size-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-colors">
          <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>arrow_back</span>
        </Link>
        <div>
          <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Examen civique · {p.sigle}</p>
          <h1 className="text-gray-900 text-[22px] md:text-[28px] font-black leading-tight">{p.label}</h1>
        </div>
      </div>

      {/* Two main actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Révision */}
        <Link
          href={`/dashboard/examen-civique/${parcours}/revision`}
          className="group bg-white border border-black/[0.08] rounded-3xl p-6 hover:shadow-lg hover:border-[#FF4D1C]/30 transition-all"
        >
          <div className="size-12 rounded-2xl bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "22px" }}>style</span>
          </div>
          <p className="text-gray-900 text-[17px] font-bold mb-1.5">Mode révision</p>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
            Révisez thème par thème à votre rythme. Apprenez et mémorisez les réponses officielles.
          </p>
          <div className="space-y-1.5">
            {["Principes et valeurs", "Institutions", "Droits et devoirs", "Histoire & géographie", "Société française"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[12px] text-gray-500">
                <span className="size-4 rounded-full bg-[#FF4D1C]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>check</span>
                </span>
                {t}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-[#FF4D1C] font-bold text-[14px]">
            Commencer la révision
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </div>
        </Link>

        {/* Simulateur d'examen */}
        <Link
          href={`/dashboard/examen-civique/${parcours}/examen`}
          className="group bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:shadow-lg transition-all relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#FF4D1C]/20 blur-2xl" />
          <div className="relative z-10">
            <div className="size-12 rounded-2xl bg-[#FF4D1C]/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "22px" }}>quiz</span>
            </div>
            <p className="text-white text-[17px] font-bold mb-1.5">Simulateur d&apos;examen</p>
            <p className="text-white/60 text-[13px] leading-relaxed mb-4">
              40 questions QCM en conditions réelles. Chronomètre de 45 minutes. Score final avec résultats par thème.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[["40", "questions"], ["45", "minutes"], ["80%", "requis"]].map(([v, l]) => (
                <div key={l} className="bg-white/10 rounded-xl p-2 text-center">
                  <p className="text-white font-black text-[16px] leading-none">{v}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[#FF4D1C] font-bold text-[14px]">
              Lancer l&apos;examen
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
