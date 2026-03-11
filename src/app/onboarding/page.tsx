"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3 | 4;

const PARCOURS = [
  {
    id: "naturalisation",
    icon: "👤",
    iconBg: "bg-violet-100",
    title: "Naturalisation",
    sub: "Niveau B2 · Citoyenneté française",
    available: true,
  },
  {
    id: "titre_sejour",
    icon: "🎓",
    iconBg: "bg-blue-100",
    title: "Titre de séjour",
    sub: "Niveau A2 · Résidence temporaire",
    available: false,
  },
  {
    id: "carte_residence",
    icon: "📅",
    iconBg: "bg-green-100",
    title: "Carte de résidence",
    sub: "Niveau B1 · Résidence longue durée",
    available: false,
  },
];

const DEPOT_OPTIONS = [
  {
    id: "avant_2026",
    icon: "📅",
    iconBg: "bg-blue-100",
    title: "Avant le 1er janvier 2026",
    sub: "Entretien de naturalisation uniquement",
  },
  {
    id: "apres_2026",
    icon: "🎯",
    iconBg: "bg-green-100",
    title: "Après le 1er janvier 2026",
    sub: "Examen civique + entretien",
  },
  {
    id: "pas_encore",
    icon: "👤",
    iconBg: "bg-slate-100",
    title: "Pas encore déposé",
    sub: "",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>(1);
  const [userName, setUserName] = useState("toi");
  const [parcours, setParcours] = useState("");
  const [depotType, setDepotType] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/"); return; }
      supabase.from("profiles").select("display_name").eq("id", user.id).single()
        .then(({ data }) => {
          if (data?.display_name) setUserName(data.display_name.split(" ")[0]);
        });
    });
  }, []);

  const pct = Math.round(((step - 1) / 4) * 100);

  const handleFinish = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/"); return; }

    await supabase.from("profiles").upsert({
      id: user.id,
      parcours,
      depot_type: depotType,
      interview_date: interviewDate || null,
      onboarding_done: true,
    });

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-4">
      <div className="w-full max-w-lg">

        {/* Back button */}
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="mb-6 flex items-center gap-2 text-sm font-semibold border border-white/20 text-white/70 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl cursor-pointer transition-colors"
          >
            ← Retour
          </button>
        )}

        {/* Progress */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white/60">Étape {step} sur 3</span>
              <span className="text-sm font-bold text-[#b5f23a]">{pct}%</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-2">
              <div
                className="bg-[#b5f23a] h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((step / 3) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 1 : Parcours ─────────────────────────────── */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              Bonjour <span className="text-[#b5f23a]">{userName}</span>,
            </h1>
            <p className="text-white/65 mb-8">Quel titre préparez-vous ?</p>

            <div className="space-y-3">
              {PARCOURS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (!p.available) return;
                    setParcours(p.id);
                    setStep(2);
                  }}
                  className={`w-full rounded-2xl px-5 py-4 flex items-center gap-4 text-left transition-all
                    ${p.available
                      ? "bg-white/[0.07] border border-white/10 hover:border-[#b5f23a]/50 hover:bg-white/10 cursor-pointer"
                      : "border border-white/5 bg-white/[0.03] opacity-50 cursor-not-allowed"
                    }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{p.title}</div>
                    <div className="text-sm text-white/55">{p.sub}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!p.available && (
                      <span className="text-[10px] font-bold bg-white/10 text-white/50 px-2 py-1 rounded-full">
                        Bientôt
                      </span>
                    )}
                    <span className="text-white/30 text-lg">›</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2 : Dépôt ────────────────────────────────── */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              Quand avez-vous déposé votre demande ?
            </h1>
            <p className="text-sm text-white/65 mb-8">
              Cette information nous permet de vous proposer le contenu le plus adapté à votre situation.
            </p>

            <div className="space-y-3">
              {DEPOT_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setDepotType(d.id); setStep(3); }}
                  className="w-full bg-white/[0.07] border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 text-left hover:border-[#b5f23a]/50 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {d.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{d.title}</div>
                    {d.sub && <div className="text-sm text-white/55">{d.sub}</div>}
                  </div>
                  <span className="text-white/30 text-lg">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3 : Date entretien ────────────────────────── */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              Date de votre entretien
            </h1>
            <p className="text-sm text-white/65 mb-8">
              Quand prévoyez-vous de passer votre entretien de naturalisation ?{" "}
              <span className="text-white/40">(Optionnel)</span>
            </p>

            <div className="relative mb-6">
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#b5f23a] focus:border-[#b5f23a] appearance-none"
                placeholder="Sélectionner la date de l'entretien"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none">📅</span>
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full bg-[#b5f23a] text-[#0a1f0e] py-4 rounded-full font-extrabold hover:bg-[#c8f856] cursor-pointer mb-4"
            >
              Continuer
            </button>

            <button
              onClick={() => setStep(4)}
              className="w-full text-sm text-white/40 underline hover:text-white/70 cursor-pointer"
            >
              Je n&apos;ai pas encore de date
            </button>
          </div>
        )}

        {/* ── STEP 4 : Welcome ──────────────────────────────── */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-black text-white mb-3">
              Tout est prêt, <span className="text-[#b5f23a]">{userName}</span> !
            </h1>
            <p className="text-white/65 mb-2 leading-relaxed">
              Ton profil est configuré. Tu peux commencer à réviser dès maintenant.
            </p>

            <div className="bg-[#b5f23a]/10 border border-[#b5f23a]/20 rounded-2xl p-4 mb-8 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="text-[#b5f23a]">✅</span>
                <span><strong>555 questions</strong> disponibles immédiatement</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="text-[#b5f23a]">✅</span>
                <span><strong>3 boutons</strong> Je connais / J&apos;hésite / Je ne sais pas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="text-[#b5f23a]">✅</span>
                <span><strong>Suivi</strong> de ta progression par thème</span>
              </div>
              {interviewDate && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>📅</span>
                  <span>Entretien le <strong>{new Date(interviewDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong></span>
                </div>
              )}
            </div>

            <button
              onClick={handleFinish}
              disabled={saving}
              className="w-full bg-[#b5f23a] text-[#0a1f0e] py-4 rounded-full font-extrabold hover:bg-[#c8f856] disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Chargement…" : "Accéder à mon tableau de bord →"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
