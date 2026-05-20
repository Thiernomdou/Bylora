import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { THEMES, QUESTIONS } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function EntretienPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, interview_date, onboarding_done")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_done) redirect("/onboarding");

  const { data: progressRows } = await supabase
    .from("user_progress")
    .select("question_id, rating, theme, updated_at")
    .eq("user_id", user.id);

  const rows   = progressRows ?? [];
  const themes = ["valeurs", "histoire", "institutions", "geographie", "droits"] as const;

  const THEME_PROGRESS: Record<string, { pct: number; done: number; total: number }> = {};
  for (const theme of themes) {
    const total = QUESTIONS.filter((q) => q.theme === theme).length;
    const done  = rows.filter((r) => r.theme === theme && r.rating === "connais").length;
    THEME_PROGRESS[theme] = { pct: total > 0 ? Math.round((done / total) * 100) : 0, done, total };
  }

  const totalConnais = rows.filter((r) => r.rating === "connais").length;
  const overall      = QUESTIONS.length > 0 ? Math.round((totalConnais / QUESTIONS.length) * 100) : 0;

  const today      = new Date().toISOString().slice(0, 10);
  const DONE_TODAY = rows.filter((r) => r.updated_at?.slice(0, 10) === today).length;
  const DAILY_GOAL = 15;
  const goalPct    = Math.min(100, Math.round((DONE_TODAY / DAILY_GOAL) * 100));

  const firstName = (profile?.display_name || "vous").split(" ")[0];

  const interviewDate = profile?.interview_date ? new Date(profile.interview_date) : null;
  const daysLeft = interviewDate
    ? Math.max(0, Math.ceil((interviewDate.getTime() - Date.now()) / 86400000))
    : null;

  const R    = 50;
  const circ = 2 * Math.PI * R;
  const offset = circ - (overall / 100) * circ;

  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-5xl mx-auto w-full space-y-4 md:space-y-5">

      {/* ── HERO CARD ── */}
      <div className="relative bg-gray-900 rounded-3xl overflow-hidden p-5 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#FF4D1C]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 size-52 rounded-full bg-[#FF4D1C]/8 blur-3xl" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-[12px] md:text-[13px] font-medium uppercase tracking-wider">Entretien de naturalisation</p>
            <h1 className="text-white text-[24px] md:text-[36px] font-black leading-tight mt-1">
              Bonjour, {firstName}
            </h1>

            <p className="text-white/50 text-[13px] md:text-[14px] mt-1 mb-5">
              {overall === 0
                ? "L'agent préfectoral ne vous laissera pas le temps de chercher. Commencez à vous préparer dès maintenant."
                : overall >= 75
                ? "Excellent niveau. Vous approchez de la ligne d'arrivée, ne relâchez pas."
                : "Chaque session vous rapproche du jour où vous obtiendrez vos papiers. Continuez."}
            </p>

            {daysLeft !== null ? (
              <div className="inline-flex items-center gap-2 bg-[#FF4D1C]/20 border border-[#FF4D1C]/30 rounded-full px-3.5 py-1.5 mb-5">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "14px" }}>event</span>
                <span className="text-[#FF4D1C] text-[12px] font-bold">
                  J-{daysLeft} avant votre entretien
                </span>
              </div>
            ) : (
              <Link
                href="/dashboard/profil"
                className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-3.5 py-1.5 mb-5 hover:bg-white/12 transition-colors"
              >
                <span className="material-symbols-outlined text-white/40" style={{ fontSize: "14px" }}>event</span>
                <span className="text-white/50 text-[12px] font-medium">Ajouter ma date et activer le compte à rebours</span>
              </Link>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/dashboard/simulation"
                className="inline-flex items-center gap-2 bg-[#FF4D1C] text-white font-bold text-[14px] px-5 py-2.5 rounded-full hover:bg-[#E8421A] transition-colors shadow-lg shadow-[#FF4D1C]/25 whitespace-nowrap"
              >
                S&apos;entraîner maintenant
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="shrink-0 relative flex items-center justify-center size-20 md:size-28">
            <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r={R} fill="none"
                stroke="#FF4D1C"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-white font-black text-[18px] md:text-[24px] leading-none">{overall}%</span>
              <span className="text-white/35 text-[10px] font-semibold uppercase tracking-wide mt-0.5">niveau</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS 3 COLS ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="bg-white border border-black/[0.07] rounded-2xl p-3 md:p-5 shadow-sm">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Aujourd&apos;hui</p>
          <p className="text-gray-900 font-black leading-none">
            <span className="text-[20px] md:text-[30px]">{DONE_TODAY}</span>
            <span className="text-gray-300 text-[12px] md:text-[14px] font-medium">/{DAILY_GOAL}</span>
          </p>
          <div className="mt-2 h-1.5 w-full bg-black/[0.07] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF4D1C] rounded-full" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="text-[#FF4D1C] text-[11px] font-semibold mt-1.5 leading-tight">
            {DONE_TODAY >= DAILY_GOAL ? "Objectif ✓" : `/ ${DAILY_GOAL} objectif`}
          </p>
        </div>

        <div className="bg-white border border-black/[0.07] rounded-2xl p-3 md:p-5 shadow-sm">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Maîtrisées</p>
          <p className="text-gray-900 text-[20px] md:text-[30px] font-black leading-none">{totalConnais}</p>
          <p className="text-[#FF4D1C] text-[11px] font-semibold mt-2 leading-tight">sur {QUESTIONS.length}</p>
        </div>

        <div className="bg-white border border-black/[0.07] rounded-2xl p-3 md:p-5 shadow-sm">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Entretien</p>
          <p className="text-gray-900 text-[20px] md:text-[30px] font-black leading-none">
            {daysLeft !== null ? daysLeft : "—"}
          </p>
          <p className="text-[#FF4D1C] text-[11px] font-semibold mt-2 leading-tight">
            {daysLeft !== null ? `jour${daysLeft !== 1 ? "s" : ""}` : "à fixer"}
          </p>
        </div>
      </div>

      {/* ── PROGRESS BY THEME ── */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-900 text-[15px] font-bold">Votre avancement thème par thème</p>
          <Link href="/dashboard/statistiques" className="text-[#FF4D1C] text-[12px] font-bold hover:underline flex items-center gap-0.5">
            Tout voir
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span>
          </Link>
        </div>
        <div className="space-y-4">
          {themes.map((themeKey) => {
            const { pct, done, total } = THEME_PROGRESS[themeKey];
            const theme = THEMES[themeKey];
            return (
              <div key={themeKey} className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[#FAF4EC] border border-[#FF4D1C]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "15px" }}>{theme.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-gray-700 text-[12px] font-semibold truncate">{theme.label}</span>
                    <span className="text-gray-400 text-[11px] font-medium ml-2 shrink-0">{done}/{total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/[0.07] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF4D1C] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-[#FF4D1C] text-[12px] font-bold shrink-0 w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
