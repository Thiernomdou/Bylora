const features = [
  {
    icon: "style",
    title: "Flashcards intelligentes",
    desc: "L'application met en avant les questions que tu connais moins bien, pour que tu progresses plus vite.",
  },
  {
    icon: "timer",
    title: "Compte à rebours jusqu'à l'entretien",
    desc: "Tu vois chaque jour combien de temps il te reste pour te préparer. Ça aide à rester motivé.",
  },
  {
    icon: "assignment",
    title: "Simulation d'entretien",
    desc: "Tu réponds à des questions comme si tu étais face à l'agent — pour ne pas être pris au dépourvu le jour J.",
  },
  {
    icon: "monitoring",
    title: "Suivi de ta progression",
    desc: "Tu vois exactement ce que tu maîtrises et ce qu'il te reste à apprendre, thème par thème.",
  },
  {
    icon: "thumbs_up_down",
    title: "3 boutons simples",
    desc: "Je connais / J'hésite / Je ne sais pas. Rapide à utiliser, même en 10 minutes dans le métro.",
  },
  {
    icon: "devices",
    title: "Téléphone et ordinateur",
    desc: "Tu révises depuis ton téléphone ou ton ordinateur, comme tu veux, où tu veux.",
  },
];

export default function Features() {
  return (
    <section className="px-6 lg:px-10 py-20 lg:py-28 bg-[#FAF4EC]/40">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="inline-block bg-[#FF4D1C]/8 border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            Fonctionnalités
          </span>
          <h2 className="text-[30px] lg:text-[38px] font-bold text-gray-900 leading-tight tracking-tight">
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
