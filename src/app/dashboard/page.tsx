import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_done, parcours_defaut")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_done) redirect("/onboarding");

  const p = profile?.parcours_defaut;

  // Un seul parcours → redirect direct
  if (p === "examen-civique")           redirect("/dashboard/examen-civique");
  if (p === "entretien-naturalisation") redirect("/dashboard/entretien");

  // Pas encore de parcours → onboarding
  if (!p) redirect("/onboarding");

  // "les-deux" → afficher les deux cards
  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-6">

      <div>
        <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Tableau de bord</p>
        <h1 className="text-gray-900 text-[28px] md:text-[36px] font-black leading-tight mt-0.5">
          Par où commencer ?
        </h1>
        <p className="text-gray-500 text-[14px] mt-1.5 max-w-lg">
          Préparez l&apos;examen civique ou l&apos;entretien de naturalisation — ou les deux. Chaque parcours est indépendant, avancez à votre rythme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Examen civique */}
        <Link
          href="/dashboard/examen-civique"
          className="group bg-white border border-black/[0.08] rounded-3xl p-6 hover:shadow-lg hover:border-[#FF4D1C]/30 transition-all"
        >
          <div className="size-12 rounded-2xl bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "22px" }}>quiz</span>
          </div>
          <span className="inline-flex items-center bg-[#FF4D1C]/10 text-[#FF4D1C] text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">QCM</span>
          <p className="text-gray-900 text-[17px] font-bold mb-2">Examen civique</p>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
            40 questions QCM en 45 minutes sur l&apos;histoire, les institutions et les valeurs de la République.
          </p>
          <div className="space-y-1.5 mb-5">
            {["Mode révision par thème", "Simulateur d'examen chronomètré", "Score détaillé par thème"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[12px] text-gray-500">
                <span className="size-4 rounded-full bg-[#FF4D1C]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>check</span>
                </span>
                {t}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[#FF4D1C] font-bold text-[14px]">
            Accéder
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </div>
        </Link>

        {/* Entretien de naturalisation */}
        <Link
          href="/dashboard/entretien"
          className="group bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:shadow-lg transition-all relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#FF4D1C]/20 blur-2xl" />
          <div className="relative z-10">
            <div className="size-12 rounded-2xl bg-[#FF4D1C]/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "22px" }}>record_voice_over</span>
            </div>
            <span className="inline-flex items-center bg-[#FF4D1C]/20 text-[#FF4D1C] text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">ORAL</span>
            <p className="text-white text-[17px] font-bold mb-2">Entretien de naturalisation</p>
            <p className="text-white/60 text-[13px] leading-relaxed mb-4">
              555 questions civiques et personnelles pour préparer l&apos;entretien oral avec l&apos;agent préfectoral.
            </p>
            <div className="space-y-1.5 mb-5">
              {["Révision par thème", "Simulation d'entretien", "Suivi de progression"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-[12px] text-white/50">
                  <span className="size-4 rounded-full bg-[#FF4D1C]/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>check</span>
                  </span>
                  {t}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[#FF4D1C] font-bold text-[14px]">
              Accéder
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
