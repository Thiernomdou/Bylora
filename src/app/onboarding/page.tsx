"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2;

export default function OnboardingPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [step,          setStep]          = useState<Step>(1);
  const [userName,      setUserName]      = useState("");
  const [initial,       setInitial]       = useState("");
  const [email,         setEmail]         = useState("");
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [selected,      setSelected]      = useState<Set<string>>(new Set());
  const [examDate,      setExamDate]      = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/"); return; }
      setEmail(user.email ?? "");
      setInitial((user.email ?? "?").charAt(0).toUpperCase());
      supabase.from("profiles").select("display_name").eq("id", user.id).single()
        .then(({ data }) => {
          if (data?.display_name) {
            setUserName(data.display_name.split(" ")[0]);
            setInitial(data.display_name.charAt(0).toUpperCase());
          }
        });
    });
  }, []); // eslint-disable-line

  const hasCivique   = selected.has("civique");
  const hasEntretien = selected.has("entretien");

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/"); return; }

    const both = hasCivique && hasEntretien;
    const parcoursDefaut = both ? "les-deux" : hasCivique ? "examen-civique" : "entretien-naturalisation";

    try {
      await supabase.from("profiles").update({
        onboarding_done: true,
        parcours_defaut: parcoursDefaut,
        interview_date:  hasEntretien ? (interviewDate || null) : null,
        exam_date:       hasCivique   ? (examDate      || null) : null,
      }).eq("id", user.id);
    } catch {
      // Si exam_date n'existe pas encore en base, on réessaie sans
      await supabase.from("profiles").update({
        onboarding_done: true,
        parcours_defaut: parcoursDefaut,
        interview_date:  hasEntretien ? (interviewDate || null) : null,
      }).eq("id", user.id);
    }

    setSaving(false);
    if (both)            router.push("/dashboard");
    else if (hasCivique) router.push("/dashboard/examen-civique");
    else                 router.push("/dashboard/entretien");
    router.refresh();
  };

  const today = new Date().toISOString().split("T")[0];

  const Topbar = () => (
    <header className="bg-white/80 backdrop-blur-md border-b border-black/[0.06] flex items-center justify-between px-4 md:px-8 py-3 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <img src="/icon.svg" alt="" className="h-7 w-7" />
        <span className="text-[17px] font-black tracking-tight text-gray-900">
          Citoyen<span className="text-[#FF4D1C]">Facile</span>
        </span>
      </div>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/[0.04] border border-black/[0.07] hover:bg-black/[0.07] transition-colors cursor-pointer"
        >
          <div className="size-7 rounded-full bg-[#FF4D1C] flex items-center justify-center text-white font-bold text-[12px] shrink-0">
            {initial}
          </div>
          <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "16px" }}>expand_more</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-black/[0.08] rounded-2xl shadow-xl z-[200] overflow-hidden">
            <div className="px-4 py-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Connecté avec</p>
              <p className="text-[13px] font-bold text-gray-900 truncate">{email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  /* ── STEP 1 ──────────────────────────────────────────── */
  if (step === 1) return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      <Topbar />
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-lg space-y-6">

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Étape 1 sur 2</span>
            <span className="text-[12px] font-bold text-[#FF4D1C]">50%</span>
          </div>
          <div className="w-full bg-black/[0.07] rounded-full h-1.5">
            <div className="bg-[#FF4D1C] h-1.5 rounded-full w-1/2 transition-all duration-500" />
          </div>
        </div>

        <div>
          <h1 className="text-gray-900 text-[26px] md:text-[30px] font-black leading-tight">
            Quel examen préparez-vous ?
          </h1>
          <p className="text-gray-500 text-[15px] mt-1.5">Sélectionnez un examen ou les deux si vous souhaitez préparer les deux parcours.</p>
        </div>

        <div className="space-y-3">

          {/* Examen civique */}
          {(() => {
            const active = selected.has("civique");
            return (
              <button
                onClick={() => toggle("civique")}
                className={`w-full text-left rounded-3xl p-5 border-2 transition-all cursor-pointer ${
                  active ? "border-[#FF4D1C] bg-[#FF4D1C]/5" : "border-black/[0.08] bg-white hover:border-[#FF4D1C]/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${active ? "bg-[#FF4D1C]/15" : "bg-black/[0.05]"}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: active ? "#FF4D1C" : "#9CA3AF" }}>quiz</span>
                    </div>
                    <div>
                      <p className="text-gray-900 text-[15px] font-bold">Examen civique</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-[#FF4D1C]/15 text-[#FF4D1C]" : "bg-black/[0.06] text-gray-400"}`}>QCM</span>
                    </div>
                  </div>
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${active ? "border-[#FF4D1C] bg-[#FF4D1C]" : "border-black/[0.2]"}`}>
                    {active && <span className="material-symbols-outlined text-white" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>check</span>}
                  </div>
                </div>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-3">
                  40 questions QCM en 45 minutes sur l&apos;histoire, les institutions et les valeurs de la République.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Titre de séjour", "Carte de résident", "Naturalisation"].map((tag) => (
                    <span key={tag} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${active ? "bg-[#FF4D1C]/10 text-[#FF4D1C]" : "bg-black/[0.05] text-gray-400"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })()}

          {/* Entretien de naturalisation */}
          {(() => {
            const active = selected.has("entretien");
            return (
              <button
                onClick={() => toggle("entretien")}
                className={`w-full text-left rounded-3xl p-5 border-2 transition-all cursor-pointer ${
                  active ? "border-[#FF4D1C] bg-[#FF4D1C]/5" : "border-black/[0.08] bg-white hover:border-[#FF4D1C]/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${active ? "bg-[#FF4D1C]/15" : "bg-black/[0.05]"}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: active ? "#FF4D1C" : "#9CA3AF" }}>record_voice_over</span>
                    </div>
                    <div>
                      <p className="text-gray-900 text-[15px] font-bold">Entretien de naturalisation</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-[#FF4D1C]/15 text-[#FF4D1C]" : "bg-black/[0.06] text-gray-400"}`}>ORAL</span>
                    </div>
                  </div>
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${active ? "border-[#FF4D1C] bg-[#FF4D1C]" : "border-black/[0.2]"}`}>
                    {active && <span className="material-symbols-outlined text-white" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>check</span>}
                  </div>
                </div>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-3">
                  555 questions pour préparer l&apos;entretien oral avec l&apos;agent préfectoral, réparties en 4 thèmes : Valeurs de la République, Histoire de France, Institutions politiques, et Vie en société.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Naturalisation"].map((tag) => (
                    <span key={tag} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${active ? "bg-[#FF4D1C]/10 text-[#FF4D1C]" : "bg-black/[0.05] text-gray-400"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })()}
        </div>

        <button
          onClick={() => selected.size > 0 && setStep(2)}
          disabled={selected.size === 0}
          className="w-full bg-[#FF4D1C] text-white py-4 rounded-full font-bold text-[15px] hover:bg-[#E8421A] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Continuer
        </button>
      </div>
      </div>
    </div>
  );

  /* ── STEP 2 : Dates ───────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      <Topbar />
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-lg space-y-6">

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Étape 2 sur 2</span>
            <span className="text-[12px] font-bold text-[#FF4D1C]">100%</span>
          </div>
          <div className="w-full bg-black/[0.07] rounded-full h-1.5">
            <div className="bg-[#FF4D1C] h-1.5 rounded-full w-full transition-all duration-500" />
          </div>
        </div>

        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-[13px] font-semibold cursor-pointer -mb-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
          Retour
        </button>

        <div>
          <h1 className="text-gray-900 text-[24px] font-black leading-tight">
            {hasCivique && hasEntretien ? "Vos dates d'examens" : hasCivique ? "Date de votre examen" : "Date de votre entretien"}
          </h1>
          <p className="text-gray-500 text-[14px] mt-1.5">
            Optionnel — permet d&apos;afficher un compte à rebours sur votre tableau de bord.
          </p>
        </div>

        <div className="space-y-4">

          {/* Examen civique date */}
          {hasCivique && (
            <div className="bg-white border border-black/[0.08] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "16px" }}>quiz</span>
                <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                  {hasEntretien ? "Date de l'examen civique" : "Date de votre examen civique"}
                </label>
              </div>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={today}
                className="w-full bg-[#FAF4EC] border border-black/[0.08] rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/30 focus:border-[#FF4D1C] text-[14px]"
              />
            </div>
          )}

          {/* Entretien date */}
          {hasEntretien && (
            <div className="bg-white border border-black/[0.08] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "16px" }}>record_voice_over</span>
                <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                  {hasCivique ? "Date de l'entretien de naturalisation" : "Date de votre entretien"}
                </label>
              </div>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={today}
                className="w-full bg-[#FAF4EC] border border-black/[0.08] rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/30 focus:border-[#FF4D1C] text-[14px]"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleFinish}
          disabled={saving}
          className="w-full bg-[#FF4D1C] text-white py-4 rounded-full font-bold text-[15px] hover:bg-[#E8421A] disabled:opacity-50 cursor-pointer transition-colors"
        >
          {saving ? "Chargement…" : "Accéder à mon tableau de bord"}
        </button>

        <button
          onClick={handleFinish}
          disabled={saving}
          className="w-full text-[13px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          Passer cette étape
        </button>

      </div>
      </div>
    </div>
  );
}
