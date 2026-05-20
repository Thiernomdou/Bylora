"use client";

import { useState } from "react";
import { QUESTIONS, THEMES, type Theme } from "@/lib/questions";

// Valeurs en premier — le plus important à l'entretien
const THEME_ORDER: Theme[] = ["valeurs", "histoire", "institutions", "geographie", "droits"];

// Questions prioritaires par thème — les questions de l'entretien réel en tête
const THEME_PRIORITIES: Partial<Record<Theme, string[]>> = {
  valeurs:      ["v67", "v68", "v24", "v73", "v23", "v03", "v07", "v08", "v112", "v76", "v05", "v20", "v21", "v22"],
  histoire:     ["h15", "h100", "h17", "h115", "h24", "h86", "h74", "h112", "h113", "h114", "h63", "v113", "h10", "h11", "h07"],
  institutions: ["i26", "i27", "i28", "i23", "i34", "i43", "i42", "i56", "i14", "i85", "i81", "i52", "i51", "i31", "i39"],
  geographie:   ["g49", "g50", "g56", "g51", "g15", "g57", "g67", "g40", "g42"],
  droits:       ["d05", "d06", "d02", "d03", "d12", "d20", "d21", "d25", "d16", "d23"],
};

const THEME_DESCRIPTIONS: Record<Theme, string> = {
  valeurs:      "Liberté, Égalité, Fraternité : l'agent vous demandera d'expliquer ces valeurs avec vos propres mots. C'est souvent ici que les candidats décrochent.",
  histoire:     "Les grandes dates, les figures, les événements fondateurs. L'entretien teste si vous comprenez l'histoire du pays que vous demandez à rejoindre.",
  institutions: "Comment fonctionne la République ? Qui décide quoi ? Ces questions reviennent systématiquement et piègent la majorité des candidats.",
  geographie:   "Régions, fleuves, reliefs, frontières. Des questions qui semblent simples, mais qui font trébucher ceux qui n'ont pas révisé.",
  droits:       "Ce que la France vous garantit. Ce qu'elle attend de vous. Connaître vos droits et devoirs, c'est montrer que vous méritez vos papiers.",
};

export default function ApprendrePage() {
  const [selected, setSelected] = useState<Theme | null>(null);

  if (!selected) {
    return (
      <div className="px-5 md:px-10 pt-6 pb-6 max-w-5xl mx-auto w-full space-y-5 md:space-y-7">
        <div>
          <p className="text-gray-500 text-[12px] md:text-[13px] font-medium">Contenu du cours</p>
          <h1 className="text-gray-900 text-[28px] md:text-[36px] font-bold leading-tight mt-0.5">Apprenez les bonnes réponses</h1>
          <p className="text-gray-500 text-[13px] md:text-[14px] mt-1">
            Ce sont les réponses que l&apos;agent préfectoral attend. Pas des approximations. Les réponses officielles, thème par thème.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {THEME_ORDER.map((key) => {
            const t     = THEMES[key];
            const count = QUESTIONS.filter((q) => q.theme === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="flex items-start gap-4 px-5 py-5 rounded-2xl border border-black/[0.07] bg-white transition-all shadow-sm cursor-pointer text-left group hover:shadow-md"
              >
                <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${t.bg} ${t.border} border`}>
                  <span className={`material-symbols-outlined ${t.color}`} style={{ fontSize: "22px" }}>{t.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-[16px] font-bold leading-snug mb-1">{t.label}</p>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{THEME_DESCRIPTIONS[key]}</p>
                  <p className="text-gray-400 text-[11px] font-semibold mt-2">{count} questions · réponses incluses</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-gray-500 shrink-0 mt-1 transition-colors" style={{ fontSize: "20px" }}>
                  chevron_right
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const theme             = THEMES[selected];
  const allThemeQuestions = QUESTIONS.filter((q) => q.theme === selected);
  const priority          = THEME_PRIORITIES[selected] ?? [];
  const questions = priority.length > 0
    ? [
        ...priority.map(id => allThemeQuestions.find(q => q.id === id)).filter((q): q is typeof allThemeQuestions[0] => Boolean(q)),
        ...allThemeQuestions.filter(q => !priority.includes(q.id)),
      ]
    : allThemeQuestions;

  return (
    <div className="px-5 md:px-10 pt-6 pb-6 max-w-5xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelected(null)}
          className="size-9 flex items-center justify-center rounded-full bg-white border border-black/[0.07] text-gray-600 hover:text-gray-900 transition-colors cursor-pointer shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.border} border`}>
            <span className={`material-symbols-outlined ${theme.color}`} style={{ fontSize: "20px" }}>{theme.icon}</span>
          </div>
          <h1 className="text-gray-900 text-[22px] md:text-[28px] font-bold leading-tight truncate">{theme.label}</h1>
        </div>
        <span className="text-gray-500 text-[12px] font-medium shrink-0">{questions.length} questions</span>
      </div>

      {/* Q+R — desktop : 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white border border-black/[0.07] rounded-2xl p-4 md:p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 size-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                style={{ backgroundColor: theme.accent + "18", color: theme.accent, border: `1px solid ${theme.accent}30` }}>
                {i + 1}
              </span>
              <p className="text-gray-900 text-[14px] md:text-[15px] font-semibold leading-snug">{q.question}</p>
            </div>
            <div className="ml-8 md:ml-9 pl-3 md:pl-4 border-l-2 space-y-2" style={{ borderColor: theme.accent + "40" }}>
              <p className="text-gray-600 text-[13px] leading-relaxed">{q.answer}</p>
              {(q.date || q.president) && (
                <div className="flex items-center gap-1.5 bg-[#FAF4EC] border border-[#FF4D1C]/20 rounded-xl px-2.5 py-1.5 mt-1 w-fit max-w-full flex-wrap">
                  <span className="material-symbols-outlined text-[#FF4D1C] shrink-0" style={{ fontSize: 12 }}>event</span>
                  <span className="text-[11px] md:text-[12px] font-semibold text-[#FF4D1C]">
                    {[q.date && `Le ${q.date}`, q.president && `sous ${q.president}`].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-4 md:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-gray-900 text-[15px] font-semibold">Lire, c&apos;est bien. Retenir, c&apos;est mieux.</p>
          <p className="text-gray-500 text-[12px] font-medium mt-0.5">Entraînez-vous avec les flashcards et voyez ce qui reste vraiment en mémoire.</p>
        </div>
        <a
          href="/dashboard/simulation"
          className="inline-flex items-center justify-center bg-[#FF4D1C] text-white text-[14px] font-bold px-5 py-3 rounded-full hover:bg-[#E8421A] transition-colors sm:shrink-0"
        >
          S&apos;entraîner
        </a>
      </div>
    </div>
  );
}
