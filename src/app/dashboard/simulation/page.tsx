"use client";

import { useState, useCallback, useEffect } from "react";
import { QUESTIONS, THEMES, type Rating, type Theme } from "@/lib/questions";
import { createClient } from "@/lib/supabase/client";

type SessionState = "picking" | "question" | "answer" | "done";

// Valeurs en premier, puis les autres
const THEME_OPTIONS: { value: Theme | "all"; label: string; description: string; icon: string }[] = [
  { value: "all",          label: "Tous les thèmes",    description: "Un mélange de toutes les thématiques pour une préparation complète et variée.",                                                icon: "layers"          },
  { value: "valeurs",      label: "Valeurs Françaises", description: "Liberté, Égalité, Fraternité, laïcité — les principes que vous devrez maîtriser le jour J.",                                  icon: THEMES.valeurs.icon      },
  { value: "histoire",     label: "Histoire",           description: "De la Révolution à la Ve République — les grandes dates et figures de l'histoire française.",                                 icon: THEMES.histoire.icon     },
  { value: "institutions", label: "Institutions",       description: "La Constitution, les pouvoirs, le gouvernement et le fonctionnement de la République.",                                       icon: THEMES.institutions.icon },
  { value: "geographie",   label: "Géographie",         description: "Les régions, fleuves, reliefs et grandes villes qui composent le territoire français.",                                       icon: THEMES.geographie.icon   },
  { value: "droits",       label: "Droits & Devoirs",   description: "Vos droits et devoirs en tant que futur citoyen, les lois fondamentales et le cadre juridique.",                             icon: THEMES.droits.icon       },
];

const SESSION_SIZE = 10;

const RATING_BADGE: Record<Rating, { label: string; icon: string; bg: string; text: string; border: string }> = {
  connais:     { label: "Maîtrisé",     icon: "check_circle", bg: "bg-[#FF4D1C]",      text: "text-white",       border: "border-[#FF4D1C]"    },
  hesite:      { label: "À revoir",     icon: "help",         bg: "bg-[#FAF4EC]",      text: "text-[#FF4D1C]",   border: "border-[#FF4D1C]/30" },
  connais_pas: { label: "À travailler", icon: "cancel",       bg: "bg-white",          text: "text-gray-500",    border: "border-black/[0.12]" },
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SimulationPage() {
  const [supabase] = useState(() => createClient());
  const [userId, setUserId] = useState<string | null>(null);
  const [savedProgress, setSavedProgress] = useState<Record<string, Rating>>({});

  const [state, setState] = useState<SessionState>("picking");
  const [selectedTheme, setSelectedTheme] = useState<Theme | "all">("all");
  const [queue, setQueue] = useState<typeof QUESTIONS>([]);
  const [current, setCurrent] = useState(0);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: rows } = await supabase.from("user_progress").select("question_id, rating").eq("user_id", uid);
        const map: Record<string, Rating> = {};
        for (const r of rows ?? []) map[r.question_id] = r.rating as Rating;
        setSavedProgress(map);
      }
    });
  }, [supabase]);

  const startSession = useCallback((themeOverride?: Theme | "all") => {
    const theme = themeOverride ?? selectedTheme;
    const pool  = theme === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.theme === theme);
    if (themeOverride !== undefined) setSelectedTheme(themeOverride);
    setQueue(shuffle(pool));
    setCurrent(0); setRatings({}); setState("question");
  }, [selectedTheme]);

  const rate = useCallback(async (rating: Rating) => {
    const q = queue[current];
    setRatings((r) => ({ ...r, [q.id]: rating }));
    setSavedProgress((prev) => ({ ...prev, [q.id]: rating }));
    setState("answer");
    if (userId) {
      await supabase.from("user_progress").upsert(
        { user_id: userId, question_id: q.id, theme: q.theme, rating, updated_at: new Date().toISOString() },
        { onConflict: "user_id,question_id" }
      );
    }
  }, [queue, current, supabase, userId]);

  const goNext = useCallback(() => {
    if (current + 1 >= queue.length) setState("done");
    else { setCurrent((c) => c + 1); setState("question"); }
  }, [current, queue.length]);

  const goPrev = useCallback(() => {
    if (current > 0) { setCurrent((c) => c - 1); setState("answer"); }
  }, [current]);

  /* ── PICKING ── */
  if (state === "picking") {
    return (
      <div className="px-5 md:px-10 pt-6 pb-6 max-w-5xl mx-auto w-full space-y-5 md:space-y-7">
        <div>
          <p className="text-gray-500 text-[12px] md:text-[13px] font-medium">Flashcards</p>
          <h1 className="text-gray-900 text-[28px] md:text-[36px] font-bold leading-tight mt-0.5">S&apos;entraîner</h1>
          <p className="text-gray-500 text-[13px] md:text-[14px] mt-1">Choisissez un thème — évaluez-vous question par question et suivez votre progression</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => startSession(t.value)}
              className="flex items-start gap-4 px-5 py-4 rounded-2xl border border-black/[0.07] bg-white transition-all cursor-pointer text-left shadow-sm hover:shadow-md hover:border-[#FF4D1C]/40 group"
            >
              <div className="size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border bg-[#FAF4EC] border-[#FF4D1C]/25 group-hover:bg-[#FF4D1C] group-hover:border-[#FF4D1C] transition-colors">
                <span className="material-symbols-outlined text-[#FF4D1C] group-hover:text-white transition-colors" style={{ fontSize: "20px" }}>{t.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-[14px] font-bold leading-snug group-hover:text-[#FF4D1C] transition-colors">{t.label}</p>
                <p className="text-gray-500 text-[12px] leading-relaxed mt-0.5">{t.description}</p>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-[#FF4D1C] shrink-0 mt-1 transition-colors" style={{ fontSize: "18px" }}>arrow_forward</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── DONE ── */
  if (state === "done") {
    const connais     = Object.values(ratings).filter((r) => r === "connais").length;
    const hesite      = Object.values(ratings).filter((r) => r === "hesite").length;
    const connais_pas = Object.values(ratings).filter((r) => r === "connais_pas").length;
    const total       = connais + hesite + connais_pas;
    const score       = total > 0 ? Math.round((connais / total) * 100) : 0;
    const scoreLabel = score >= 70 ? "Très bon résultat" : score >= 40 ? "Bonne progression" : "À renforcer";
    return (
      <div className="px-5 md:px-10 pt-6 pb-6 max-w-xl mx-auto w-full space-y-4">
        <div className="bg-white border border-black/[0.07] rounded-2xl p-6 md:p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-gray-900 text-[22px] md:text-[26px] font-bold">Session terminée</h2>
          <div className="text-5xl md:text-6xl font-bold text-[#FF4D1C]">{score}%</div>
          <p className="text-[14px] font-semibold text-gray-500">{scoreLabel}</p>
          <p className="text-gray-400 text-[13px]">sur {total} questions</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: connais,     label: "Je connais",    bg: "bg-[#FF4D1C]",   text: "text-white",     border: "border-[#FF4D1C]",    icon: "check_circle" },
            { val: hesite,      label: "J'hésite",       bg: "bg-[#FAF4EC]",   text: "text-[#FF4D1C]", border: "border-[#FF4D1C]/30", icon: "help"         },
            { val: connais_pas, label: "Je ne sais pas", bg: "bg-white",       text: "text-gray-600",  border: "border-black/[0.10]", icon: "cancel"       },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3 md:p-4 text-center`}>
              <span className={`material-symbols-outlined ${s.text} mb-1`} style={{ fontSize: "20px", fontVariationSettings: `'FILL' 1` }}>{s.icon}</span>
              <div className={`text-2xl md:text-3xl font-bold ${s.text}`}>{s.val}</div>
              <div className={`text-[11px] md:text-[12px] font-semibold ${s.text} mt-1`}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={startSession} className="flex-1 bg-[#FF4D1C] text-white py-3.5 rounded-full font-bold hover:bg-[#E8421A] transition-colors cursor-pointer text-[15px]">
            Nouvelle session
          </button>
          <button onClick={() => setState("picking")} className="flex-1 bg-white border border-black/[0.07] text-gray-700 py-3.5 rounded-2xl font-semibold hover:shadow-md transition-all cursor-pointer text-[15px] shadow-sm">
            Changer thème
          </button>
        </div>
      </div>
    );
  }

  if (!queue[current]) return null;
  const q               = queue[current];
  const theme           = THEMES[q.theme];
  const sessionProgress = queue.length > 0 ? ((current + (state === "answer" ? 1 : 0)) / queue.length) * 100 : 0;
  const currentRating   = ratings[q.id];

  /* ── QUESTION ── */
  if (state === "question") {
    return (
      <div className="px-4 md:px-10 pt-4 md:pt-6 pb-4 md:pb-6 max-w-3xl mx-auto w-full flex flex-col gap-3 md:gap-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => setState("picking")} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "20px" }}>arrow_back</span>
            <span className="text-[13px] md:text-[14px] font-medium">Quitter</span>
          </button>
          <p className="text-gray-500 text-[13px] md:text-[14px] font-semibold">{current + 1} / {queue.length}</p>
        </div>

        {/* Progress */}
        <div className="rounded-full bg-black/[0.08] h-1.5 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${sessionProgress}%`, backgroundColor: theme.accent }} />
        </div>

        {/* Flashcard */}
        <div className="flex flex-col items-stretch rounded-2xl border border-black/[0.07] bg-white shadow-sm overflow-hidden min-h-[240px] md:min-h-[400px]">
          <div className="h-[3px] w-full" style={{ backgroundColor: theme.accent }} />
          <div className="px-4 md:px-5 pt-3 md:pt-4 pb-0">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${theme.bg} ${theme.border} border`}>
              <span className={`material-symbols-outlined ${theme.color}`} style={{ fontSize: "13px" }}>{theme.icon}</span>
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme.color}`}>{theme.label}</span>
            </div>
          </div>
          <div className="flex w-full grow flex-col items-center justify-center gap-4 py-6 md:py-10 px-5 md:px-10 text-center">
            <div className="space-y-2">
              <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Question</p>
              <h1 className="text-gray-900 text-[18px] md:text-[24px] font-bold leading-snug">{q.question}</h1>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-black/[0.07] w-full justify-center">
              <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "18px" }}>help_outline</span>
              <p className="text-gray-400 text-[12px] font-medium">Tu connais la réponse ?</p>
            </div>
          </div>
        </div>

        {/* Answer buttons */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-3">
          <button onClick={() => rate("connais")} className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 rounded-2xl h-14 md:h-14 px-2 md:px-5 bg-[#FF4D1C] text-white hover:bg-[#E8421A] transition-colors font-bold text-[13px] md:text-[16px] cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: `'FILL' 1` }}>check_circle</span>
            <span>Je connais</span>
          </button>
          <button onClick={() => rate("hesite")} className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 rounded-2xl h-14 md:h-14 px-2 md:px-5 border-2 border-[#FF4D1C] text-[#FF4D1C] bg-[#FAF4EC] hover:bg-[#FF4D1C]/10 transition-colors font-bold text-[13px] md:text-[16px] cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>help</span>
            <span>J&apos;hésite</span>
          </button>
          <button onClick={() => rate("connais_pas")} className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 rounded-2xl h-14 md:h-14 px-2 md:px-5 border border-black/[0.12] text-gray-600 bg-white hover:bg-black/[0.04] transition-colors font-bold text-[13px] md:text-[16px] cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>cancel</span>
            <span>Je ne sais pas</span>
          </button>
        </div>
      </div>
    );
  }

  /* ── ANSWER ── */
  const badge = currentRating ? RATING_BADGE[currentRating] : null;
  return (
    <div className="px-4 md:px-10 pt-4 md:pt-6 pb-4 md:pb-6 max-w-3xl mx-auto w-full flex flex-col gap-3 md:gap-5">
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 md:pb-4">
        <button onClick={() => setState("question")} className="size-9 flex items-center justify-center cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
        </button>
        <p className="text-gray-500 text-[13px] md:text-[14px] font-semibold">{current + 1} / {queue.length}</p>
        <div className="w-9" />
      </div>

      <div className="h-1.5 w-full bg-black/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${sessionProgress}%`, backgroundColor: theme.accent }} />
      </div>

      {/* Answer card */}
      <div className="flex flex-col items-stretch rounded-2xl overflow-hidden border border-black/[0.07] bg-white shadow-sm">
        <div className="h-[3px] w-full" style={{ backgroundColor: theme.accent }} />
        <div className="px-4 md:px-5 pt-3 md:pt-4 pb-0 flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${theme.bg} ${theme.border} border`}>
            <span className={`material-symbols-outlined ${theme.color}`} style={{ fontSize: "13px" }}>{theme.icon}</span>
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme.color}`}>{theme.label}</span>
          </div>
          {badge && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${badge.bg} ${badge.text} border ${badge.border}`}>
              <span className="material-symbols-outlined" style={{ fontSize: "13px", fontVariationSettings: `'FILL' 1` }}>{badge.icon}</span>
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">{badge.label}</span>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-3 md:gap-4 p-4 md:p-7">
          <div>
            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-1.5">Question</p>
            <h3 className="text-gray-900 text-[15px] md:text-[19px] font-bold leading-snug">{q.question}</h3>
          </div>
          <div className="w-full h-px bg-black/[0.07]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: theme.accent }}>Réponse</p>
            <p className="text-gray-600 text-[13px] md:text-[15px] leading-relaxed">{q.answer}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={goPrev} disabled={current === 0}
            className="flex items-center justify-center gap-2 rounded-2xl h-12 md:h-14 border border-black/[0.1] bg-white text-gray-700 hover:shadow-md transition-all font-bold text-[14px] md:text-[15px] cursor-pointer disabled:opacity-40 shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
            Précédent
          </button>
          <button onClick={goNext}
            className="flex items-center justify-center gap-2 rounded-2xl h-12 md:h-14 bg-[#FF4D1C] text-white hover:bg-[#E8421A] transition-colors font-bold text-[14px] md:text-[15px] cursor-pointer">
            {current + 1 >= queue.length ? "Terminer" : "Suivant"}
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </button>
        </div>
        {queue.length <= 30 && (
          <div className="flex justify-center gap-1.5 flex-wrap">
            {queue.map((_, i) => (
              <div key={i} className="size-1.5 rounded-full transition-all" style={{ backgroundColor: i <= current ? theme.accent : "rgba(0,0,0,0.15)" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
