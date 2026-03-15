"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QUESTIONS_CIVIQUES, THEMES_CIVIQUES, type ThemeCivique } from "@/lib/questions-civiques";

const THEME_KEYS = Object.keys(THEMES_CIVIQUES) as ThemeCivique[];

export default function RevisionPage() {
  const params   = useParams();
  const parcours = params.parcours as string;

  const [selected, setSelected] = useState<ThemeCivique | null>(null);

  /* ── CHOIX DE THÈME ── */
  if (!selected) {
    return (
      <div className="px-5 md:px-10 pt-6 pb-6 max-w-5xl mx-auto w-full space-y-5 md:space-y-7">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/examen-civique/${parcours}`}
            className="size-9 flex items-center justify-center rounded-full bg-white border border-black/[0.07] text-gray-600 hover:text-gray-900 transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
          </Link>
          <div>
            <p className="text-gray-500 text-[12px] md:text-[13px] font-medium">Mode révision</p>
            <h1 className="text-gray-900 text-[28px] md:text-[36px] font-bold leading-tight">Apprendre</h1>
          </div>
        </div>
        <p className="text-gray-500 text-[13px] md:text-[14px]">
          Choisissez un thème pour lire toutes les questions et réponses officielles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {THEME_KEYS.map((key) => {
            const t     = THEMES_CIVIQUES[key];
            const count = QUESTIONS_CIVIQUES.filter((q) => q.theme === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="flex items-start gap-4 px-5 py-5 rounded-2xl border border-black/[0.07] bg-white transition-all shadow-sm cursor-pointer text-left group hover:shadow-md"
              >
                <div className="size-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border" style={{ background: `${t.accent}15`, borderColor: `${t.accent}30` }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px", color: t.accent }}>{t.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-[16px] font-bold leading-snug mb-1">{t.label}</p>
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

  /* ── LISTE Q+R ── */
  const t         = THEMES_CIVIQUES[selected];
  const questions = QUESTIONS_CIVIQUES.filter((q) => q.theme === selected);

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
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0 border" style={{ background: `${t.accent}15`, borderColor: `${t.accent}30` }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: t.accent }}>{t.icon}</span>
          </div>
          <h1 className="text-gray-900 text-[22px] md:text-[28px] font-bold leading-tight truncate">{t.label}</h1>
        </div>
        <span className="text-gray-500 text-[12px] font-medium shrink-0">{questions.length} questions</span>
      </div>

      {/* Q+R grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white border border-black/[0.07] rounded-2xl p-4 md:p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <span
                className="shrink-0 size-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                style={{ backgroundColor: `${t.accent}18`, color: t.accent, border: `1px solid ${t.accent}30` }}
              >
                {i + 1}
              </span>
              <p className="text-gray-900 text-[14px] md:text-[15px] font-semibold leading-snug">{q.question}</p>
            </div>
            <div className="ml-8 md:ml-9 pl-3 md:pl-4 border-l-2 space-y-1.5" style={{ borderColor: `${t.accent}40` }}>
              <p className="text-gray-600 text-[13px] leading-relaxed font-medium">{q.options[q.correct]}</p>
              {q.explication && (
                <p className="text-gray-400 text-[12px] leading-relaxed">{q.explication}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-4 md:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-gray-900 text-[15px] font-semibold">Tu as bien lu ?</p>
          <p className="text-gray-500 text-[12px] font-medium mt-0.5">Teste-toi avec le simulateur d&apos;examen.</p>
        </div>
        <Link
          href={`/dashboard/examen-civique/${parcours}/examen`}
          className="inline-flex items-center justify-center bg-[#FF4D1C] text-white text-[14px] font-bold px-5 py-3 rounded-full hover:bg-[#E8421A] transition-colors sm:shrink-0"
        >
          Lancer l&apos;examen
        </Link>
      </div>
    </div>
  );
}
