import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PARCOURS_CIVIQUES } from "@/lib/questions-civiques";

const PARCOURS_INFO: Record<string, {
  who: string;
  why: string;
  level: string;
  levelColor: string;
  icon: string;
  tags: string[];
}> = {
  csp: {
    level: "Accessible",
    levelColor: "#059669",
    icon: "info",
    who: "Vous renouvelez votre titre de séjour pour une carte pluriannuelle (2 à 4 ans). Sans cet examen, votre dossier est bloqué.",
    why: "Depuis la loi du 26 janvier 2024, l'examen civique est obligatoire. 80% minimum. Pas 79%. CitoyenFacile vous donne toutes les questions du programme officiel, classées et expliquées, pour que vous arriviez préparé et confiant.",
    tags: ["Obligatoire depuis jan. 2024", "Score min. 80%", "40 questions · 45 min"],
  },
  cr: {
    level: "Intermédiaire",
    levelColor: "#D97706",
    icon: "info",
    who: "Vous demandez la carte de résident valable 10 ans, après 5 ans de résidence régulière. Une étape clé pour votre stabilité en France.",
    why: "Un score insuffisant reporte tout votre dossier. Les questions couvrent des sujets précis que la plupart des candidats découvrent le jour J. Trop tard. Révisez maintenant, chaque thème, chaque réponse officielle.",
    tags: ["Obligatoire", "5 ans de résidence requis", "Score min. 80%"],
  },
  nat: {
    level: "Rigoureux",
    levelColor: "#DC2626",
    icon: "info",
    who: "Vous demandez la nationalité française. Des années de démarches aboutissent à ce moment. Ne laissez pas un examen mal préparé tout compromettre.",
    why: "C'est le niveau le plus exigeant. L'examen civique s'accompagne de l'entretien de naturalisation : deux épreuves, un seul objectif. CitoyenFacile couvre les deux, avec le programme officiel, des simulations et un suivi de votre progression.",
    tags: ["Obligatoire", "Niveau le plus exigeant", "Score min. 80%"],
  },
};

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ parcours: string }> }

export default async function ParcoursPage({ params }: Props) {
  const { parcours } = await params;
  if (!PARCOURS_CIVIQUES[parcours]) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const p    = PARCOURS_CIVIQUES[parcours];
  const info = PARCOURS_INFO[parcours];

  return (
    <div className="px-4 md:px-10 pt-6 pb-10 max-w-3xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/examen-civique" className="size-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-colors">
          <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>arrow_back</span>
        </Link>
        <div>
          <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Examen civique · {p.sigle}</p>
          <h1 className="text-gray-900 text-[22px] md:text-[28px] font-black leading-tight">{p.label}</h1>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-gray-900 text-[14px] font-bold">Ce que vous devez savoir avant qu&apos;il soit trop tard</p>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border" style={{ color: info.levelColor, background: `${info.levelColor}12`, borderColor: `${info.levelColor}30` }}>
            {info.level}
          </span>
        </div>
        <div className="space-y-2 text-[13px] text-gray-600 leading-relaxed">
          <p>{info.who}</p>
          <p>{info.why}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {info.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-semibold bg-black/[0.04] text-gray-500 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Two main actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Révision */}
        <Link
          href={`/dashboard/examen-civique/${parcours}/revision`}
          className="group bg-white border border-black/[0.08] rounded-3xl p-6 hover:shadow-lg hover:border-[#FF4D1C]/30 transition-all"
        >
          <div className="size-12 rounded-2xl bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "22px" }}>style</span>
          </div>
          <p className="text-gray-900 text-[17px] font-bold mb-1.5">Mode révision</p>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
            Toutes les réponses officielles, classées par thème. Apprenez ce que l&apos;examen attend exactement. Pas plus, pas moins.
          </p>
          <div className="space-y-1.5">
            {["Principes et valeurs", "Institutions", "Droits et devoirs", "Histoire & géographie", "Société française"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[12px] text-gray-500">
                <span className="size-4 rounded-full bg-[#FF4D1C]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>check</span>
                </span>
                {t}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-[#FF4D1C] font-bold text-[14px]">
            Commencer la révision
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </div>
        </Link>

        {/* Simulateur d'examen */}
        <Link
          href={`/dashboard/examen-civique/${parcours}/examen`}
          className="group bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:shadow-lg transition-all relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#FF4D1C]/20 blur-2xl" />
          <div className="relative z-10">
            <div className="size-12 rounded-2xl bg-[#FF4D1C]/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "22px" }}>quiz</span>
            </div>
            <p className="text-white text-[17px] font-bold mb-1.5">Simulateur d&apos;examen</p>
            <p className="text-white/60 text-[13px] leading-relaxed mb-4">
              Reproduisez les conditions exactes du vrai examen. Chronomètre, 40 questions, score immédiat. Sachez si vous êtes prêt avant le jour J.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[["40", "questions"], ["45", "minutes"], ["80%", "requis"]].map(([v, l]) => (
                <div key={l} className="bg-white/10 rounded-xl p-2 text-center">
                  <p className="text-white font-black text-[16px] leading-none">{v}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[#FF4D1C] font-bold text-[14px]">
              Lancer l&apos;examen
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
