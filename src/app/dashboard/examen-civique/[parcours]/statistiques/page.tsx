import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { THEMES_CIVIQUES, PARCOURS_CIVIQUES, QUESTIONS_CIVIQUES } from "@/lib/questions-civiques";
import { RefreshOnMount } from "./refresh";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ parcours: string }> }

export default async function StatistiquesCiviquePage({ params }: Props) {
  const { parcours } = await params;
  if (!PARCOURS_CIVIQUES[parcours]) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: progressRows }, { data: examRows }] = await Promise.all([
    supabase
      .from("civique_user_progress")
      .select("question_id, theme, rating, updated_at")
      .eq("user_id", user.id)
      .eq("parcours", parcours),
    supabase
      .from("civique_exam_results")
      .select("score, total, passed, created_at")
      .eq("user_id", user.id)
      .eq("parcours", parcours)
      .order("created_at", { ascending: false }),
  ]);

  const progress = progressRows ?? [];
  const exams    = examRows ?? [];
  const p        = PARCOURS_CIVIQUES[parcours];

  const themes = ["republique", "institutions", "droits", "histoire", "societe"] as const;

  // Overall mastery from ratings (proportional to answered questions)
  const totalRated   = progress.length;
  const totalConnais = progress.filter((r) => r.rating === "connais").length;
  const overall      = totalRated > 0 ? Math.round((totalConnais / totalRated) * 100) : 0;

  // Per-theme stats
  const STATS: Record<string, { connais: number; hesite: number; connais_pas: number; total: number; rated: number }> = {};
  for (const theme of themes) {
    const r     = progress.filter((x) => x.theme === theme);
    const total = QUESTIONS_CIVIQUES.filter((q) => q.theme === theme).length;
    const connais     = r.filter((x) => x.rating === "connais").length;
    const hesite      = r.filter((x) => x.rating === "hesite").length;
    const connais_pas = r.filter((x) => x.rating === "connais_pas").length;
    STATS[theme] = { connais, hesite, connais_pas, total, rated: connais + hesite + connais_pas };
  }

  // Sessions count (unique dates from progress)
  const uniqueDates   = new Set(progress.map((r) => r.updated_at?.slice(0, 10)).filter(Boolean) as string[]);
  const totalSessions = uniqueDates.size;

  // Exam stats
  const totalExams  = exams.length;
  const totalPassed = exams.filter((e) => e.passed).length;
  const lastScore   = totalExams > 0 ? Math.round((exams[0].score / exams[0].total) * 100) : null;

  // SVG ring
  const R    = 50;
  const circ = 2 * Math.PI * R;
  const offset = circ - (overall / 100) * circ;

  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-5xl mx-auto w-full space-y-4 md:space-y-5">
      <RefreshOnMount />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/examen-civique/${parcours}`}
          className="size-9 flex shrink-0 items-center justify-center rounded-full bg-white border border-black/[0.07] text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
        </Link>
        <div>
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
            Examen civique · {p.sigle}
          </p>
          <h1 className="text-gray-900 text-[22px] md:text-[28px] font-black leading-tight">Statistiques</h1>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative bg-gray-900 rounded-3xl overflow-hidden p-5 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#FF4D1C]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 size-52 rounded-full bg-[#FF4D1C]/8 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-[11px] md:text-[12px] font-semibold uppercase tracking-wider">Niveau global</p>
            <p className="text-white text-[40px] md:text-[64px] font-black leading-none mt-1">
              {overall}<span className="text-[#FF4D1C]">%</span>
            </p>
            <p className="text-white/50 text-[12px] md:text-[13px] mt-1.5">
              {totalConnais} maîtrisée{totalConnais !== 1 ? "s" : ""} sur {totalRated} répondue{totalRated !== 1 ? "s" : ""}
            </p>
            <div className="mt-3 md:mt-4 h-1.5 md:h-2 w-full max-w-[180px] md:max-w-[256px] rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#FF4D1C] transition-all" style={{ width: `${overall}%` }} />
            </div>
          </div>
          <div className="shrink-0 relative flex items-center justify-center" style={{ width: 76, height: 76 }}>
            <svg width="76" height="76" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
              <circle cx="60" cy="60" r={R} fill="none" stroke="#FF4D1C"
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-white font-black text-[17px] leading-none">{overall}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 STATS ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {[
          { label: "Sessions",  value: totalSessions, icon: "fitness_center",  sub: "d'entraînement"  },
          { label: "Réussis",   value: `${totalPassed}/${totalExams}`, icon: "quiz", sub: "examens QCM" },
          { label: "Dernier",   value: lastScore !== null ? `${lastScore}%` : "—", icon: "schedule",   sub: "score examen"    },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-black/[0.07] rounded-2xl p-3 md:p-5 shadow-sm">
            <div className="flex items-center gap-1 mb-1.5">
              <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "13px" }}>{s.icon}</span>
              <p className="text-gray-400 text-[9px] md:text-[11px] font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
            <p className="text-gray-900 text-[22px] md:text-[32px] font-black leading-none">{s.value}</p>
            <p className="text-gray-400 text-[9px] md:text-[10px] font-medium mt-1 leading-tight">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── PAR THÈME ── */}
      <div>
        <p className="text-gray-900 text-[15px] font-bold mb-3 px-1">Par thématique</p>
        <div className="space-y-3">
          {themes.map((themeKey) => {
            const t   = THEMES_CIVIQUES[themeKey];
            const s   = STATS[themeKey];
            const pct = s.rated > 0 ? Math.round((s.connais / s.rated) * 100) : 0;
            return (
              <div key={themeKey} className="bg-white border border-black/[0.07] rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.accent}15`, border: `1px solid ${t.accent}30` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "17px", color: t.accent }}>{t.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900 text-[14px] font-bold">{t.label}</p>
                      <p className="text-[14px] font-black" style={{ color: t.accent }}>{pct}%</p>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full bg-black/[0.07] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: t.accent }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  {[
                    { label: "maîtrisées",   val: s.connais,                                     color: "text-[#FF4D1C]", weight: "font-bold"   },
                    { label: "à revoir",     val: s.hesite,                                       color: "text-gray-500",  weight: "font-medium" },
                    { label: "à travailler", val: s.connais_pas,                                  color: "text-gray-400",  weight: "font-medium" },
                    { label: "non vues",     val: s.total - s.connais - s.hesite - s.connais_pas, color: "text-gray-300",  weight: "font-medium" },
                  ].map((row) => (
                    <span key={row.label} className={`text-[12px] ${row.weight} ${row.color}`}>
                      {row.val} <span className="opacity-75 font-normal">{row.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── HISTORIQUE EXAMENS ── */}
      {exams.length > 0 && (
        <div>
          <p className="text-gray-900 text-[15px] font-bold mb-3 px-1">Historique des examens QCM</p>
          <div className="space-y-2">
            {exams.slice(0, 10).map((e, i) => {
              const pct  = Math.round((e.score / e.total) * 100);
              const date = new Date(e.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
              return (
                <div key={i} className="bg-white border border-black/[0.07] rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center ${e.passed ? "bg-green-50" : "bg-red-50"}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: e.passed ? "#059669" : "#DC2626", fontVariationSettings: "'FILL' 1" }}>
                        {e.passed ? "check_circle" : "cancel"}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 text-[13px] font-bold">{e.score} / {e.total} bonnes réponses</p>
                      <p className="text-gray-400 text-[11px]">{date}</p>
                    </div>
                  </div>
                  <p className={`text-[16px] font-black ${e.passed ? "text-[#FF4D1C]" : "text-gray-400"}`}>{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-4 md:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-gray-900 text-[15px] font-semibold">Continuez à vous entraîner</p>
          <p className="text-gray-500 text-[12px] font-medium mt-0.5">Chaque session améliore votre maîtrise.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/examen-civique/${parcours}/entrainement`}
            className="inline-flex items-center justify-center border border-[#FF4D1C] text-[#FF4D1C] text-[13px] font-bold px-4 py-2.5 rounded-full hover:bg-[#FF4D1C]/5 transition-colors sm:shrink-0"
          >
            S&apos;entraîner
          </Link>
          <Link
            href={`/dashboard/examen-civique/${parcours}/examen`}
            className="inline-flex items-center justify-center bg-[#FF4D1C] text-white text-[13px] font-bold px-4 py-2.5 rounded-full hover:bg-[#E8421A] transition-colors sm:shrink-0"
          >
            Examen QCM
          </Link>
        </div>
      </div>
    </div>
  );
}
