const testimonials = [
  { avatar: "👨🏾", text: "J'avais 3 semaines. J'ai révisé 20 min par jour dans le RER. Le jour J, je connaissais toutes les questions posées. Je suis French maintenant !", name: "Mamadou K.", info: "Guinée · Naturalisé en janvier 2026" },
  { avatar: "👩🏾", text: "Les autres outils que j'avais testés étaient trop compliqués. CitoyenFacile c'est simple, direct, adapté au téléphone. J'ai révisé partout.", name: "Aminata D.", info: "Côte d'Ivoire · Naturalisée en février 2026" },
  { avatar: "👨🏿", text: "Le mode simulation m'a appris à répondre calmement même sous pression. J'ai réussi du premier coup.", name: "Ibrahim S.", info: "Sénégal · Naturalisé en mars 2026" },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="inline-block bg-[#FF4D1C]/8 border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            Témoignages
          </span>
          <h2 className="text-[32px] lg:text-[42px] font-bold text-gray-900 leading-tight tracking-tight">
            Ils ont réussi leur entretien
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] transition-all duration-300 flex flex-col">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#FF4D1C] text-[14px]">★</span>
                ))}
              </div>
              <p className="text-[14px] lg:text-[15px] text-gray-700 leading-relaxed mb-6 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-black/[0.06]">
                <div className="size-10 rounded-full bg-[#FAF4EC] flex items-center justify-center text-lg shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-gray-900">{t.name}</p>
                  <p className="text-[12px] text-gray-400">{t.info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
