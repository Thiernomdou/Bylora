"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QUESTIONS_CIVIQUES, THEMES_CIVIQUES, type ThemeCivique } from "@/lib/questions-civiques";
import { createClient } from "@/lib/supabase/client";

const TOTAL    = 40;
const DURATION = 45 * 60; // seconds
const PASS_PCT = 80;

/* Pick 40 questions balanced across themes (8 per theme) */
function buildExam(): typeof QUESTIONS_CIVIQUES {
  const themes: ThemeCivique[] = ["republique", "institutions", "droits", "histoire", "societe"];
  const picked: typeof QUESTIONS_CIVIQUES = [];
  for (const t of themes) {
    const pool = QUESTIONS_CIVIQUES.filter((q) => q.theme === t);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    picked.push(...shuffled.slice(0, 8));
  }
  return picked.sort(() => Math.random() - 0.5);
}

type Phase = "intro" | "exam" | "done";

export default function ExamenPage() {
  const params  = useParams();
  const parcours = params.parcours as string;

  const [phase,     setPhase]     = useState<Phase>("intro");
  const [questions, setQuestions] = useState<typeof QUESTIONS_CIVIQUES>([]);
  const [index,     setIndex]     = useState(0);
  const [answers,   setAnswers]   = useState<Record<string, number>>({}); // id → chosen option
  const [selected,  setSelected]  = useState<number | null>(null);
  const [timeLeft,  setTimeLeft]  = useState(DURATION);

  /* Countdown */
  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) {
      saveResults(answers, questions);
      setPhase("done");
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  const startExam = () => {
    setQuestions(buildExam());
    setIndex(0);
    setAnswers({});
    setSelected(null);
    setTimeLeft(DURATION);
    setPhase("exam");
  };

  async function saveResults(finalAnswers: Record<string, number>, qs: typeof QUESTIONS_CIVIQUES) {
    const themes: ThemeCivique[] = ["republique", "institutions", "droits", "histoire", "societe"];
    const themeResults: Record<string, { correct: number; count: number }> = {};
    let total = 0;
    for (const t of themes) {
      const tqs = qs.filter((q) => q.theme === t);
      const correct = tqs.filter((q) => finalAnswers[q.id] === q.correct).length;
      total += correct;
      themeResults[t] = { correct, count: tqs.length };
    }
    const pct = Math.round((total / TOTAL) * 100);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("civique_exam_results").insert({
      user_id:       user.id,
      parcours,
      score:         total,
      total:         TOTAL,
      passed:        pct >= PASS_PCT,
      theme_results: themeResults,
    });
  }

  const handleNext = useCallback(() => {
    if (selected === null) return;
    const q = questions[index];
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    if (index + 1 >= questions.length) {
      saveResults(newAnswers, questions);
      setPhase("done");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, questions, index, answers]);

  /* Format mm:ss */
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const timerPct = (timeLeft / DURATION) * 100;
  const timerColor = timeLeft < 300 ? "#EF4444" : timeLeft < 600 ? "#F59E0B" : "#22C55E";

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-5">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/examen-civique/${parcours}`} className="size-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-colors">
            <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>arrow_back</span>
          </Link>
          <div>
            <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Simulateur d&apos;examen</p>
            <h1 className="text-gray-900 text-[22px] font-black">Êtes-vous prêt ?</h1>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#FF4D1C]/20 blur-2xl" />
          <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
            {[["40", "questions"], ["45", "minutes"], ["80%", "requis"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-white font-black text-[28px] leading-none">{v}</p>
                <p className="text-white/40 text-[11px] mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/[0.07] rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-gray-900 text-[14px] font-bold">Conditions de l&apos;examen</p>
          {[
            "40 questions QCM — 4 choix, 1 seule bonne réponse",
            "45 minutes chronomètre décompte",
            "Score minimum requis : 32/40 (80%)",
            "Résultats détaillés par thème à la fin",
          ].map((t) => (
            <div key={t} className="flex items-start gap-2.5 text-[13px] text-gray-600">
              <span className="size-4 rounded-full bg-[#FF4D1C]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>check</span>
              </span>
              {t}
            </div>
          ))}
        </div>

        <button
          onClick={startExam}
          className="w-full bg-[#FF4D1C] text-white font-bold text-[16px] py-4 rounded-full hover:bg-[#E8421A] transition-colors shadow-lg shadow-[#FF4D1C]/25 cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>play_arrow</span>
          Lancer l&apos;examen
        </button>
      </div>
    );
  }

  /* ── RESULTS ── */
  if (phase === "done") {
    const themes: ThemeCivique[] = ["republique", "institutions", "droits", "histoire", "societe"];
    let total = 0;
    const themeResults = themes.map((t) => {
      const qs = questions.filter((q) => q.theme === t);
      const correct = qs.filter((q) => answers[q.id] === q.correct).length;
      total += correct;
      return { theme: t, correct, count: qs.length, pct: Math.round((correct / qs.length) * 100) };
    });
    const pct  = Math.round((total / TOTAL) * 100);
    const pass = pct >= PASS_PCT;

    return (
      <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-5">
        {/* Score header */}
        <div className={`rounded-3xl p-7 text-center space-y-3 ${pass ? "bg-gray-900" : "bg-white border border-black/[0.07]"} shadow-sm relative overflow-hidden`}>
          {pass && <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#FF4D1C]/20 blur-2xl" />}
          <div className="relative z-10">
            <p className={`text-[12px] font-semibold uppercase tracking-wider ${pass ? "text-white/40" : "text-gray-400"}`}>Résultat final</p>
            <div className={`text-[64px] font-black leading-none mt-2 ${pass ? "text-[#FF4D1C]" : "text-gray-300"}`}>{pct}%</div>
            <p className={`font-bold text-[18px] mt-2 ${pass ? "text-white" : "text-gray-900"}`}>{total} / {TOTAL} bonnes réponses</p>
            <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-[13px] font-bold ${pass ? "bg-green-500/20 text-green-400" : "bg-red-500/10 text-red-500"}`}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
                {pass ? "check_circle" : "cancel"}
              </span>
              {pass ? "Examen réussi" : "Examen non réussi — continuez à réviser"}
            </div>
          </div>
        </div>

        {/* Theme breakdown */}
        <div className="bg-white border border-black/[0.07] rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-gray-900 text-[14px] font-bold mb-4">Résultats par thème</p>
          {themeResults.map(({ theme, correct, count, pct: tPct }) => {
            const t = THEMES_CIVIQUES[theme];
            return (
              <div key={theme}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: "15px", color: t.accent }}>{t.icon}</span>
                    <span className="text-gray-700 text-[12px] font-semibold">{t.label}</span>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: t.accent }}>{correct}/{count}</span>
                </div>
                <div className="h-1.5 w-full bg-black/[0.07] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${tPct}%`, backgroundColor: t.accent }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startExam}
            className="bg-white border border-black/[0.08] rounded-2xl py-3.5 text-[14px] font-bold text-gray-700 hover:bg-black/[0.04] transition-colors cursor-pointer"
          >
            Recommencer
          </button>
          <Link
            href={`/dashboard/examen-civique/${parcours}/revision`}
            className="bg-[#FF4D1C] rounded-2xl py-3.5 text-[14px] font-bold text-white hover:bg-[#E8421A] transition-colors text-center"
          >
            Réviser
          </Link>
        </div>
      </div>
    );
  }

  /* ── EXAM ── */
  const current = questions[index];
  const t = THEMES_CIVIQUES[current.theme];

  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-4">
      {/* Timer + progress */}
      <div className="flex items-center justify-between">
        <button onClick={() => setPhase("intro")} className="size-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>arrow_back</span>
        </button>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: `${timerColor}40`, background: `${timerColor}10` }}>
          <span className="material-symbols-outlined" style={{ fontSize: "15px", color: timerColor }}>timer</span>
          <span className="font-black text-[14px]" style={{ color: timerColor }}>{mm}:{ss}</span>
        </div>

        <span className="text-gray-700 text-[13px] font-bold">{index + 1} / {questions.length}</span>
      </div>

      {/* Overall progress bar */}
      <div className="w-full bg-black/[0.07] rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${((index + 1) / questions.length) * 100}%`, backgroundColor: timerColor }} />
      </div>

      {/* Timer bar */}
      <div className="w-full bg-black/[0.07] rounded-full h-1">
        <div className="h-1 rounded-full transition-all duration-1000" style={{ width: `${timerPct}%`, backgroundColor: timerColor }} />
      </div>

      {/* Theme badge */}
      <div className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full border" style={{ background: `${t.accent}12`, borderColor: `${t.accent}30`, color: t.accent }}>
        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>{t.icon}</span>
        {t.label}
      </div>

      {/* Question card */}
      <div className="bg-white border border-black/[0.07] rounded-3xl p-5 md:p-7 shadow-sm">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Question {index + 1}</p>
        <p className="text-gray-900 text-[17px] md:text-[19px] font-bold leading-snug">{current.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {current.options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-5 py-4 rounded-2xl border text-[14px] font-semibold transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? "border-[#FF4D1C] bg-[#FF4D1C]/8 text-gray-900"
                  : "border-black/[0.08] bg-white text-gray-700 hover:border-black/[0.2] hover:bg-black/[0.02]"
              }`}
            >
              <span
                className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-black transition-all ${
                  isSelected ? "border-[#FF4D1C] bg-[#FF4D1C] text-white" : "border-black/[0.15] text-gray-400"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={selected === null}
        className="w-full bg-[#FF4D1C] text-white font-bold text-[16px] py-4 rounded-full hover:bg-[#E8421A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {index + 1 >= questions.length ? "Terminer l'examen" : "Question suivante"}
      </button>
    </div>
  );
}
