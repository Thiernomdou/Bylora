"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QUESTIONS_CIVIQUES, THEMES_CIVIQUES, type ThemeCivique } from "@/lib/questions-civiques";

const THEME_KEYS = Object.keys(THEMES_CIVIQUES) as ThemeCivique[];

type Phase = "themes" | "cards" | "done";

export default function RevisionPage() {
  const params = useParams();
  const parcours = params.parcours as string;

  const [phase, setPhase]       = useState<Phase>("themes");
  const [activeTheme, setActiveTheme] = useState<ThemeCivique>("republique");
  const [index, setIndex]       = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown]       = useState<Record<string, boolean>>({});

  const themeQuestions = QUESTIONS_CIVIQUES.filter((q) => q.theme === activeTheme);
  const current = themeQuestions[index];

  const startTheme = (t: ThemeCivique) => {
    setActiveTheme(t);
    setIndex(0);
    setRevealed(false);
    setPhase("cards");
  };

  const handleAnswer = (isKnown: boolean) => {
    setKnown((k) => ({ ...k, [current.id]: isKnown }));
    if (index + 1 >= themeQuestions.length) {
      setPhase("done");
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  };

  /* ── CHOIX DE THÈME ── */
  if (phase === "themes") {
    return (
      <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-5">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/examen-civique/${parcours}`} className="size-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-colors">
            <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>arrow_back</span>
          </Link>
          <div>
            <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Mode révision</p>
            <h1 className="text-gray-900 text-[22px] font-black">Choisissez un thème</h1>
          </div>
        </div>
        <div className="space-y-3">
          {THEME_KEYS.map((key) => {
            const t = THEMES_CIVIQUES[key];
            const qs = QUESTIONS_CIVIQUES.filter((q) => q.theme === key);
            return (
              <button
                key={key}
                onClick={() => startTheme(key)}
                className="w-full flex items-center gap-4 bg-white border border-black/[0.07] rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#FF4D1C]/30 transition-all text-left cursor-pointer group"
              >
                <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.accent}18` }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: t.accent }}>{t.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-[14px] font-bold">{t.label}</p>
                  <p className="text-gray-400 text-[12px]">{qs.length} questions</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-[#FF4D1C] transition-colors shrink-0" style={{ fontSize: "18px" }}>chevron_right</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── RÉSULTATS THÈME ── */
  if (phase === "done") {
    const total = themeQuestions.length;
    const correct = themeQuestions.filter((q) => known[q.id]).length;
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-5">
        <div className="bg-white border border-black/[0.07] rounded-3xl p-7 text-center shadow-sm space-y-3">
          <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">{THEMES_CIVIQUES[activeTheme].label}</p>
          <div className="text-[56px] font-black text-[#FF4D1C]">{pct}%</div>
          <p className="text-gray-900 font-bold text-[16px]">{correct} / {total} questions connues</p>
          <p className="text-gray-400 text-[13px]">{pct >= 80 ? "Excellent ! Vous maîtrisez ce thème." : "Continuez à réviser pour atteindre 80%."}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { setPhase("themes"); setKnown({}); }} className="bg-white border border-black/[0.08] rounded-2xl py-3.5 text-[14px] font-bold text-gray-700 hover:bg-black/[0.04] transition-colors cursor-pointer">
            Autre thème
          </button>
          <button onClick={() => startTheme(activeTheme)} className="bg-[#FF4D1C] rounded-2xl py-3.5 text-[14px] font-bold text-white hover:bg-[#E8421A] transition-colors cursor-pointer">
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  /* ── FLASHCARD ── */
  const t = THEMES_CIVIQUES[activeTheme];
  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <button onClick={() => setPhase("themes")} className="size-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>arrow_back</span>
        </button>
        <span className="text-gray-700 text-[13px] font-bold">{index + 1} / {themeQuestions.length}</span>
      </div>
      <div className="w-full bg-black/[0.07] rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${((index + 1) / themeQuestions.length) * 100}%`, backgroundColor: t.accent }} />
      </div>

      <div className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full border" style={{ background: `${t.accent}12`, borderColor: `${t.accent}30`, color: t.accent }}>
        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>{t.icon}</span>
        {t.label}
      </div>

      {/* Card */}
      <div className="bg-white border border-black/[0.07] rounded-3xl p-5 md:p-7 shadow-sm space-y-4 min-h-[200px]">
        <div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Question</p>
          <p className="text-gray-900 text-[17px] md:text-[19px] font-bold leading-snug">{current.question}</p>
        </div>
        {revealed && (
          <div className="pt-4 border-t border-black/[0.07]">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Bonne réponse</p>
            <p className="text-gray-700 text-[15px] font-semibold">{current.options[current.correct]}</p>
            {current.explication && <p className="text-gray-400 text-[13px] mt-2 leading-relaxed">{current.explication}</p>}
          </div>
        )}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="w-full bg-white border border-black/[0.1] text-gray-900 py-4 rounded-full text-[16px] font-bold hover:shadow-md transition-all cursor-pointer shadow-sm">
          Voir la réponse
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleAnswer(false)} className="flex items-center justify-center gap-2 border border-black/[0.12] text-gray-600 bg-white py-4 rounded-2xl font-bold hover:bg-black/[0.04] transition-colors cursor-pointer text-[14px]">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>cancel</span>
            Je ne savais pas
          </button>
          <button onClick={() => handleAnswer(true)} className="flex items-center justify-center gap-2 text-white py-4 rounded-2xl font-bold transition-colors cursor-pointer text-[14px]" style={{ background: t.accent }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Je savais
          </button>
        </div>
      )}
    </div>
  );
}
