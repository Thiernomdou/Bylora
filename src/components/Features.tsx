const features = [
  {
    icon: "quiz",
    title: "Simulateur d'examen civique",
    desc: "40 questions QCM en 45 minutes dans les conditions réelles. Titre de séjour, carte de résident, naturalisation. Une seule préparation.",
  },
  {
    icon: "record_voice_over",
    title: "Simulation d'entretien oral",
    desc: "Tu réponds aux questions comme face à l'agent : valeurs françaises, histoire, situation personnelle. Pour ne pas être pris au dépourvu le jour J.",
  },
  {
    icon: "style",
    title: "Flashcards intelligentes",
    desc: "L'algorithme met en avant les questions que tu maîtrises moins, pour que tu progresses vite sur les 555 questions.",
  },
  {
    icon: "timer",
    title: "Compte à rebours personnalisé",
    desc: "Tu indiques ta date d'examen ou d'entretien. Le plan de révision s'adapte au temps qu'il te reste.",
  },
  {
    icon: "monitoring",
    title: "Suivi de ta progression",
    desc: "Tu vois exactement ce que tu maîtrises et ce qu'il te reste, thème par thème : histoire, institutions, valeurs, géographie.",
  },
  {
    icon: "devices",
    title: "Téléphone et ordinateur",
    desc: "Tu révises depuis ton téléphone ou ton ordinateur, où tu veux. 20 minutes dans le métro suffisent.",
  },
];

export default function Features() {
  return (
    <section className="px-4 md:px-6 lg:px-10 py-16 md:py-20 lg:py-28 bg-[#FAF4EC]/40">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="inline-block bg-[#FF4D1C]/8 border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            Fonctionnalités
          </span>
          <h2 className="text-[24px] md:text-[30px] lg:text-[38px] font-bold text-gray-900 leading-tight tracking-tight">
            Simple à utiliser.<br className="hidden lg:block" /> Efficace pour réussir.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] transition-all duration-300">
              <div className="size-11 rounded-2xl bg-gradient-to-br from-[#FF4D1C]/10 to-[#FF4D1C]/3 flex items-center justify-center mb-5 border border-[#FF4D1C]/12">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: 20 }}>{f.icon}</span>
              </div>
              <p className="font-semibold text-[15px] text-gray-900 mb-2">{f.title}</p>
              <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
