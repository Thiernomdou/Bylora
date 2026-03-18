import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { THEMES, QUESTIONS } from "@/lib/questions";
import { RefreshOnMount } from "./refresh";

export const dynamic = "force-dynamic";

export default async function StatistiquesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: progressRows }, { data: examRows }] = await Promise.all([
    supabase.from("user_progress").select("question_id, rating, theme, updated_at").eq("user_id", user.id),
    supabase.from("entretien_exam_results").select("score, total, passed, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const rows  = progressRows ?? [];
  const exams = examRows    ?? [];
  const themes = ["valeurs", "histoire", "institutions", "geographie", "droits"] as const;

  const STATS: Record<string, { connais: number; hesite: number; connais_pas: number; total: number }> = {};
  for (const theme of themes) {
    const r     = rows.filter((x) => x.theme === theme);
    const total = QUESTIONS.filter((q) => q.theme === theme).length;
    STATS[theme] = {
      connais:     r.filter((x) => x.rating === "connais").length,
      hesite:      r.filter((x) => x.rating === "hesite").length,
      connais_pas: r.filter((x) => x.rating === "connais_pas").length,
      total,
    };
  }

  const totalConnais  = rows.filter((r) => r.rating === "connais").length;
  const totalQuestions = QUESTIONS.length;
  const overall       = totalQuestions > 0 ? Math.round((totalConnais / totalQuestions) * 100) : 0;

  const uniqueDates   = new Set(rows.map((r) => r.updated_at?.slice(0, 10)).filter(Boolean) as string[]);
  const totalSessions = uniqueDates.size;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (uniqueDates.has(d.toISOString().slice(0, 10))) streak++;
    else if (i === 0) continue;
    else break;
  }

  // SVG ring
  const R    = 50;
  const circ = 2 * Math.PI * R;
  const offset = circ - (overall / 100) * circ;

  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-5xl mx-auto w-full space-y-4 md:space-y-5">
      <RefreshOnMount />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="size-9 flex shrink-0 items-center justify-center rounded-full bg-white border border-black/[0.07] text-gray-500 hover:text-gray-900 transition-colors shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
        </Link>
        <div>
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">Mes résultats</p>
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
              {totalConnais} question{totalConnais !== 1 ? "s" : ""} maîtrisée{totalConnais !== 1 ? "s" : ""} sur {totalQuestions}
            </p>
            <div className="mt-3 md:mt-4 h-1.5 md:h-2 w-full max-w-[180px] md:max-w-[256px] rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#FF4D1C] transition-all" style={{ width: `${overall}%` }} />
            </div>
          </div>

          {/* Ring */}
          <div className="shrink-0 relative flex items-center justify-center size-20 md:size-24">
            <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
              <circle cx="60" cy="60" r={R} fill="none" stroke="#FF4D1C"
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-white font-black text-[18px] leading-none">{overall}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 STATS ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {[
          { label: "Sessions",  value: totalSessions, icon: "calendar_today",       sub: "jours travaillés"    },
          { label: "Série",     value: streak,        icon: "local_fire_department", sub: "jours consécutifs"   },
          { label: "Répondues", value: rows.length,   icon: "quiz",                  sub: "réponses enreg."     },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-black/[0.07] rounded-2xl p-3 md:p-5 shadow-sm">
            <div className="flex items-center gap-1 mb-1.5">
              <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "13px" }}>{s.icon}</span>
              <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
            <p className="text-gray-900 text-[22px] md:text-[32px] font-black leading-none">{s.value}</p>
            <p className="text-gray-400 text-[11px] font-medium mt-1 leading-tight">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── PAR THÈME ── */}
      <div>
        <p className="text-gray-900 text-[15px] font-bold mb-3 px-1">Par thématique</p>
        <div className="space-y-3">
          {themes.map((themeKey) => {
            const t   = THEMES[themeKey];
            const s   = STATS[themeKey];
            const pct = s.total > 0 ? Math.round((s.connais / s.total) * 100) : 0;

            return (
              <div key={themeKey} className="bg-white border border-black/[0.07] rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-9 rounded-xl bg-[#FAF4EC] border border-[#FF4D1C]/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "17px" }}>{t.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900 text-[14px] font-bold">{t.label}</p>
                      <p className="text-[#FF4D1C] text-[14px] font-black">{pct}%</p>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full bg-black/[0.07] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF4D1C] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {[
                    { label: "maîtrisées",  val: s.connais,                                       color: "text-[#FF4D1C]", weight: "font-bold"   },
                    { label: "à revoir",    val: s.hesite,                                         color: "text-gray-500",  weight: "font-medium" },
                    { label: "à travailler",val: s.connais_pas,                                    color: "text-gray-400",  weight: "font-medium" },
                    { label: "non vues",    val: s.total - s.connais - s.hesite - s.connais_pas,   color: "text-gray-300",  weight: "font-medium" },
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

      {/* ── HISTORIQUE SIMULATIONS D'ENTRETIEN ── */}
      {exams.length > 0 && (
        <div>
          <p className="text-gray-900 text-[15px] font-bold mb-3 px-1">Historique des simulations d&apos;entretien</p>
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
                      <p className="text-gray-900 text-[13px] font-bold">{e.score} / {e.total} maîtrisées</p>
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

    </div>
  );
}
