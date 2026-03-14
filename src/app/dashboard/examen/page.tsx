"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { QUESTIONS, THEMES, type Theme } from "@/lib/questions";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const PERSONAL_QUESTIONS = [
  {
    id: "perso_1",
    question: "Présentez-vous",
    tips: ["Dites votre prénom, votre nationalité d'origine", "Depuis combien de temps vous vivez en France", "Votre situation familiale (marié(e), enfants ?)"],
  },
  {
    id: "perso_2",
    question: "Pourquoi souhaitez-vous devenir français(e) ?",
    tips: ["Exprimez votre attachement aux valeurs de la République", "Mentionnez votre intégration (travail, vie sociale, langue)", "Parlez de votre projet de vie en France"],
  },
  {
    id: "perso_3",
    question: "Quelle est votre situation professionnelle et familiale ?",
    tips: ["Votre métier ou activité actuelle", "Si vous avez des enfants, leur scolarité en France", "Vos liens avec la communauté locale"],
  },
  {
    id: "perso_4",
    question: "Combien de fois rentrez-vous dans votre pays d'origine ?",
    tips: ["Soyez honnête et précis (ex : une fois tous les deux ans)", "Montrez que votre vie principale est en France", "Vous pouvez mentionner les raisons (famille, événements)"],
  },
  {
    id: "perso_5",
    question: "Envoyez-vous de l'argent à votre famille restée dans votre pays d'origine ?",
    tips: ["Répondez naturellement et honnêtement", "Si oui, expliquez que c'est pour aider la famille", "Cette question évalue votre situation financière et vos liens familiaux"],
  },
  {
    id: "perso_6",
    question: "Avez-vous de la famille restée dans votre pays d'origine ?",
    tips: ["Précisez les membres de la famille concernés", "Vous pouvez mentionner vos liens avec eux", "Montrez que votre ancrage principal est en France"],
  },
  {
    id: "perso_7",
    question: "Quelles sont vos activités de loisirs ? Que faites-vous avec votre conjoint(e) ?",
    tips: ["Citez des activités concrètes (sport, culture, sorties)", "Montrez votre intégration dans la vie sociale française", "Parlez de vos centres d'intérêt communs en couple"],
  },
  {
    id: "perso_8",
    question: "Pratiquez-vous une religion ? Fréquentez-vous un lieu de culte ?",
    tips: ["Répondez honnêtement", "Précisez si vous pratiquez et comment (mosquée, église, etc.)", "Montrez que votre pratique religieuse reste dans la sphère privée, compatible avec la laïcité"],
  },
  {
    id: "perso_9",
    question: "Quels sont vos projets personnels et professionnels si vous obtenez la nationalité française ?",
    tips: ["Parlez de vos projets de vie en France (famille, logement, carrière)", "Mentionnez les opportunités que la nationalité vous ouvrira", "Montrez votre volonté de contribuer à la société française"],
  },
  {
    id: "perso_10",
    question: "Pourquoi avez-vous choisi la France ?",
    tips: ["Parlez de vos valeurs communes avec la France (liberté, égalité, laïcité)", "Mentionnez votre parcours d'intégration", "Évoquez votre attachement à la culture, la langue et l'histoire françaises"],
  },
];

function pickQuestions(n: number): typeof QUESTIONS {
  const themes: Theme[] = ["histoire", "institutions", "valeurs", "geographie", "droits"];
  const picked: typeof QUESTIONS = [];
  const perTheme = Math.ceil(n / themes.length);
  for (const theme of themes) {
    const shuffled = [...QUESTIONS.filter((q) => q.theme === theme)].sort(() => Math.random() - 0.5);
    picked.push(...shuffled.slice(0, perTheme));
  }
  return picked;
}

type ExamPhase = "intro" | "perso" | "knowledge" | "done";

export default function ExamenPage() {
  const [supabase]        = useState(() => createClient());
  const [userId, setUserId] = useState<string | null>(null);
  const [phase, setPhase]   = useState<ExamPhase>("intro");
  const [persoIndex, setPersoIndex] = useState(0);
  const [knowledgeQueue]  = useState(() => pickQuestions(15));
  const [kIndex, setKIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers]   = useState<Record<string, "connais" | "connais_pas">>({});
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase]);

  useEffect(() => {
    if (phase !== "done" || saved || !userId) return;
    setSaved(true);
    const rows = knowledgeQueue.filter((q) => answers[q.id] !== undefined).map((q) => ({
      user_id: userId, question_id: q.id, theme: q.theme, rating: answers[q.id], updated_at: new Date().toISOString(),
    }));
    if (rows.length === 0) return;
    supabase.from("user_progress").upsert(rows, { onConflict: "user_id,question_id" })
      .then(({ error }) => { if (error) console.error(error); });
  }, [phase, saved, userId, knowledgeQueue, answers, supabase]);

  const answerKnowledge = (val: "connais" | "connais_pas") => {
    const q = knowledgeQueue[kIndex];
    setAnswers((a) => ({ ...a, [q.id]: val }));
    setRevealed(false);
    if (kIndex + 1 >= knowledgeQueue.length) setPhase("done");
    else setKIndex((i) => i + 1);
  };

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <div className="px-5 md:px-10 pt-6 pb-6 max-w-3xl mx-auto w-full space-y-5 md:space-y-7">
        <div>
          <p className="text-gray-500 text-[12px] md:text-[13px] font-medium">Mise en situation</p>
          <h1 className="text-gray-900 text-[28px] md:text-[36px] font-bold leading-tight mt-0.5">Simulation d&apos;entretien</h1>
          <p className="text-gray-500 text-[13px] md:text-[14px] mt-1">Reproduisez les conditions réelles de votre entretien de naturalisation</p>
        </div>

        {/* Message rassurant */}
        <div className="bg-gray-900 rounded-2xl p-5 md:p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[#FF4D1C]/20 blur-3xl" />
          <div className="relative z-10">
            <p className="text-white text-[15px] md:text-[16px] font-bold mb-2">
              L&apos;entretien, c&apos;est avant tout une discussion.
            </p>
            <p className="text-white/60 text-[13px] md:text-[14px] leading-relaxed">
              Si vous avez bien travaillé les questions, soyez serein — l&apos;agent ne cherche pas à vous piéger.
              Il veut comprendre qui vous êtes, votre attachement à la France et aux valeurs de la République.
              Répondez naturellement, avec vos mots. La sincérité compte autant que la précision.
            </p>
          </div>
        </div>

        <div className="bg-white border border-black/[0.07] rounded-2xl p-5 md:p-7 shadow-sm space-y-3">
          <p className="text-gray-900 text-[15px] md:text-[16px] font-bold mb-1">Déroulement</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: "person",    text: "Questions personnelles — présentez-vous comme lors d'un vrai entretien"          },
              { icon: "school",    text: "Questions de culture civique — histoire, valeurs, institutions et plus"               },
              { icon: "timer_off", text: "Pas de chrono — prends le temps de bien répondre"                                      },
              { icon: "save",      text: "Tes réponses sont enregistrées dans tes statistiques"                                   },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 text-[13px] md:text-[14px] text-gray-600 bg-[#FAF4EC] rounded-xl px-3 py-3">
                <div className="size-8 rounded-full flex items-center justify-center shrink-0 bg-[#FF4D1C]/10 border border-[#FF4D1C]/20">
                  <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "16px" }}>{icon}</span>
                </div>
                <span className="pt-0.5">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:max-w-xs">
          <button onClick={() => setPhase("perso")}
            className="w-full bg-[#FF4D1C] text-white py-4 rounded-full text-[17px] font-bold hover:bg-[#E8421A] transition-colors cursor-pointer">
            Commencer l&apos;entretien
          </button>
        </div>
      </div>
    );
  }

  /* ── PHASE PERSONNELLE ── */
  if (phase === "perso") {
    const pq     = PERSONAL_QUESTIONS[persoIndex];
    const isLast = persoIndex === PERSONAL_QUESTIONS.length - 1;
    return (
      <div className="px-5 md:px-10 pt-6 pb-6 max-w-3xl mx-auto w-full space-y-4 md:space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-[12px] font-semibold uppercase tracking-wide">Questions personnelles</span>
          <span className="text-gray-700 text-[13px] font-bold">{persoIndex + 1} / {PERSONAL_QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-black/[0.08] rounded-full h-2">
          <div className="bg-[#FF4D1C] h-2 rounded-full transition-all duration-300" style={{ width: `${((persoIndex + 1) / PERSONAL_QUESTIONS.length) * 100}%` }} />
        </div>
        <div className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full bg-[#FAF4EC] border border-[#FF4D1C]/25 text-[#FF4D1C]">
          <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "14px" }}>person</span>
          Partie personnelle
        </div>
        <div className="bg-white border border-black/[0.07] rounded-2xl p-5 md:p-7 shadow-sm space-y-4">
          <div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-3">Question</p>
            <p className="text-gray-900 text-[18px] md:text-[20px] font-bold leading-snug">{pq.question}</p>
          </div>
          <div className="pt-4 border-t border-black/[0.07] space-y-2">
            <p className="text-[11px] font-bold text-[#FF4D1C] uppercase tracking-widest">Points à aborder</p>
            {pq.tips.map((tip) => (
              <div key={tip} className="flex items-start gap-2 text-[13px] md:text-[14px] text-gray-600">
                <span className="text-[#FF4D1C] shrink-0 mt-0.5">–</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-400 text-[12px] text-center">Réponds à voix haute, comme lors d&apos;un vrai entretien</p>
        <div className="md:max-w-xs mx-auto">
          <button onClick={() => { if (isLast) setPhase("knowledge"); else setPersoIndex((i) => i + 1); }}
            className="w-full bg-[#FF4D1C] text-white py-4 rounded-full text-[17px] font-bold hover:bg-[#E8421A] transition-colors cursor-pointer">
            {isLast ? "Passer aux questions de culture" : "Question suivante"}
          </button>
        </div>
      </div>
    );
  }

  /* ── PHASE CONNAISSANCES ── */
  if (phase === "knowledge") {
    const q              = knowledgeQueue[kIndex];
    const theme          = THEMES[q.theme];
    const totalDone      = PERSONAL_QUESTIONS.length + kIndex + 1;
    const totalQuestions = PERSONAL_QUESTIONS.length + knowledgeQueue.length;
    return (
      <div className="px-5 md:px-10 pt-6 pb-6 max-w-3xl mx-auto w-full space-y-4 md:space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-[12px] font-semibold uppercase tracking-wide">Culture civique</span>
          <span className="text-gray-700 text-[13px] font-bold">{totalDone} / {totalQuestions}</span>
        </div>
        <div className="w-full bg-black/[0.08] rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${(totalDone / totalQuestions) * 100}%`, backgroundColor: theme.accent }} />
        </div>
        <div className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full ${theme.bg} ${theme.border} border ${theme.color}`}>
          <span className={`material-symbols-outlined ${theme.color}`} style={{ fontSize: "14px" }}>{theme.icon}</span>
          {theme.label}
        </div>
        <div className="bg-white border border-black/[0.07] rounded-2xl p-5 md:p-7 min-h-[180px] shadow-sm">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-4">Question</p>
          <p className="text-gray-900 text-[18px] md:text-[20px] font-bold leading-snug">{q.question}</p>
          {revealed && (
            <div className="mt-5 pt-5 border-t border-black/[0.07]">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.accent }}>Réponse</p>
              <p className="text-gray-600 text-[13px] md:text-[14px] leading-relaxed">{q.answer}</p>
            </div>
          )}
        </div>
        {!revealed ? (
          <div className="md:max-w-xs mx-auto">
            <button onClick={() => setRevealed(true)}
              className="w-full bg-white border border-black/[0.1] text-gray-900 py-4 rounded-full text-[17px] font-bold hover:shadow-md transition-all cursor-pointer shadow-sm">
              Voir la réponse
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-400 text-[12px] text-center font-semibold uppercase tracking-wide">Tu connaissais ?</p>
            <div className="grid grid-cols-2 gap-3 md:max-w-md mx-auto">
              <button onClick={() => answerKnowledge("connais")}
                className="flex items-center justify-center gap-2 bg-[#FF4D1C] text-white py-4 rounded-2xl font-bold hover:bg-[#E8421A] transition-colors cursor-pointer text-[15px]">
                <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: `'FILL' 1` }}>check_circle</span>
                Je savais
              </button>
              <button onClick={() => answerKnowledge("connais_pas")}
                className="flex items-center justify-center gap-2 border border-black/[0.12] text-gray-600 bg-white py-4 rounded-2xl font-bold hover:bg-black/[0.04] transition-colors cursor-pointer text-[15px]">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>cancel</span>
                Je ne savais pas
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── RESULTATS ── */
  const correct = Object.values(answers).filter((a) => a === "connais").length;
  const total   = Object.keys(answers).length;
  const score   = total > 0 ? Math.round((correct / total) * 100) : 0;
  const scoreLabel = score >= 70 ? "Très bon résultat" : score >= 50 ? "Bonne base" : "À renforcer";

  const byTheme: Record<string, { ok: number; total: number }> = {};
  knowledgeQueue.forEach((q) => {
    if (!byTheme[q.theme]) byTheme[q.theme] = { ok: 0, total: 0 };
    byTheme[q.theme].total++;
    if (answers[q.id] === "connais") byTheme[q.theme].ok++;
  });

  return (
    <div className="px-5 md:px-10 pt-6 pb-6 max-w-3xl mx-auto w-full space-y-4 md:space-y-5">
      <div className="bg-white border border-black/[0.07] rounded-2xl p-6 md:p-8 text-center space-y-3 shadow-sm">
        <h2 className="text-gray-900 text-[22px] md:text-[26px] font-bold">Examen terminé</h2>
        <div className="text-5xl md:text-6xl font-bold text-[#FF4D1C]">{score}%</div>
        <p className="text-[14px] font-semibold text-gray-500">{scoreLabel}</p>
        <p className="text-gray-400 text-[13px]">{correct} / {total} bonnes réponses · questions de culture</p>
      </div>

      <div className="bg-white border border-black/[0.07] rounded-2xl p-5 md:p-6 shadow-sm">
        <p className="text-gray-900 text-[15px] font-bold mb-4">Résultats par thème</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(byTheme).map(([k, v]) => {
            const t = THEMES[k as Theme];
            const p = Math.round((v.ok / v.total) * 100);
            return (
              <div key={k}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "14px" }}>{t.icon}</span>
                    <span className="text-gray-700 text-[13px]">{t.label}</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#FF4D1C]">{v.ok}/{v.total}</span>
                </div>
                <div className="w-full bg-black/[0.08] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#FF4D1C]" style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4 text-[13px] md:text-[14px] font-medium bg-[#FAF4EC] border border-[#FF4D1C]/20 text-gray-600">
        {score >= 70 ? "Très bon résultat — tu es bien préparé(e) pour ton entretien." : score >= 50 ? "Bonne base — continue à revoir les thèmes moins maîtrisés." : "Continue à réviser régulièrement. Retourne dans S'entraîner pour renforcer tes connaissances."}
      </div>

      <div className="flex gap-3 md:max-w-md">
        <Link href="/dashboard" className="flex-1 bg-white border border-black/[0.1] text-gray-700 py-3.5 rounded-2xl text-center font-semibold hover:shadow-md transition-all shadow-sm text-[15px]">
          Tableau de bord
        </Link>
        <Link href="/dashboard/simulation" className="flex-1 bg-[#FF4D1C] text-white py-3.5 rounded-full font-bold text-center hover:bg-[#E8421A] transition-colors text-[15px]">
          S&apos;entraîner
        </Link>
      </div>
    </div>
  );
}
