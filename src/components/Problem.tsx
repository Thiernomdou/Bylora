const pains = [
  {
    icon: "description",
    title: "Des ressources qu'on lit et qu'on oublie",
    desc: "Tu lis, tu oublies. Pas de quiz, pas de suivi. Tu ne sais pas ce que tu retiens vraiment.",
  },
  {
    icon: "forum",
    title: "Des groupes et forums éparpillés",
    desc: "Les informations sont partout, pas toujours à jour, et tu perds un temps précieux à trier le vrai du faux.",
  },
  {
    icon: "sentiment_stressed",
    title: "Aucune vraie mise en situation",
    desc: "Le jour de l'entretien, le stress peut tout bloquer — même ce que tu connais bien. S'entraîner à l'oral change tout.",
  },
];

export default function Problem() {
  return (
    <section className="px-6 lg:px-10 py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-2 bg-[#FAF4EC] border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>warning</span>
            Ce qui ne fonctionne pas
          </span>
          <h2 className="text-[32px] lg:text-[42px] font-bold text-gray-900 leading-tight tracking-tight">
            Pourquoi beaucoup de gens arrivent à l&apos;entretien sans être vraiment prêts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          {pains.map((p) => (
            <div key={p.title} className="group bg-white rounded-3xl p-8 border border-black/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition-all duration-300">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-[#FF4D1C]/10 to-[#FF4D1C]/3 flex items-center justify-center mb-6 border border-[#FF4D1C]/12">
                <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: 22 }}>{p.icon}</span>
              </div>
              <p className="font-bold text-[16px] text-gray-900 mb-3 leading-snug">{p.title}</p>
              <p className="text-[14px] text-gray-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
