const steps = [
  { n: "1", title: "Indique ta date d'examen ou d'entretien", desc: "CitoyenFacile crée ton plan de révision personnalisé selon le temps qu'il te reste. Le countdown démarre immédiatement." },
  { n: "2", title: "Révise 20 min par jour",                  desc: "Des flashcards sur les 555 questions civiques et d'entretien. L'algorithme adapte les révisions selon ce que tu maîtrises." },
  { n: "3", title: "Simule les deux épreuves",                desc: "QCM examen civique + simulation d'entretien oral. Entraîne-toi dans les conditions réelles pour ne pas être pris au dépourvu." },
  { n: "4", title: "Tu passes. Tu réussis.",                  desc: "Tu vois ton niveau en % par thème. Tu arrives le jour J confiant, sans surprise ni stress." },
];

export default function HowItWorks() {
  return (
    <section id="comment" className="bg-white px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="inline-block bg-[#FF4D1C]/8 border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            Comment ça marche
          </span>
          <h2 className="text-[32px] lg:text-[42px] font-bold text-gray-900 leading-tight tracking-tight">
            Simple. Quotidien. Efficace.
          </h2>
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative stagger">
          <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-black/[0.08] z-0" />
          {steps.map((s) => (
            <div key={s.n} className="relative z-10 flex flex-col items-center text-center gap-5">
              <div className="size-11 bg-[#FF4D1C] text-white rounded-full flex items-center justify-center font-black text-[17px] shadow-md shadow-[#FF4D1C]/30">
                {s.n}
              </div>
              <div>
                <p className="font-bold text-[15px] text-gray-900 mb-2">{s.title}</p>
                <p className="text-[13px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden flex flex-col gap-0">
          {steps.map((s, i) => (
            <div key={s.n} className="flex gap-5 pb-8 last:pb-0">
              <div className="flex flex-col items-center shrink-0">
                <div className="size-10 bg-[#FF4D1C] text-white rounded-full flex items-center justify-center font-black text-[15px]">{s.n}</div>
                {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-black/[0.08] mt-2" />}
              </div>
              <div className="pt-1.5">
                <p className="font-bold text-[15px] text-gray-900 mb-1.5">{s.title}</p>
                <p className="text-[14px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
