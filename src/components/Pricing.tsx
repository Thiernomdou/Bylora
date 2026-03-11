const plans = [
  {
    name: "Essentiel",
    price: "9",
    cents: ",99 €",
    duration: "Accès 1 mois",
    per: "Idéal si ton entretien est dans moins d'un mois",
    popular: false,
    features: [
      "555 questions complètes",
      "Flashcards par thème",
      "Statistiques de progression",
      "Simulation d'entretien",
    ],
    cta: "Commencer — 9,99 €",
    variant: "secondary" as const,
  },
  {
    name: "Sérieux",
    price: "24",
    cents: ",99 €",
    duration: "Accès 3 mois",
    per: "Idéal si ton entretien est dans 2 à 3 mois",
    popular: true,
    features: [
      "555 questions complètes",
      "Flashcards par thème",
      "Statistiques de progression",
      "Simulation d'entretien",
      "Rappels de révision",
    ],
    cta: "Commencer — 24,99 €",
    variant: "primary" as const,
  },
  {
    name: "À vie",
    price: "39",
    cents: ",99 €",
    duration: "Accès illimité",
    per: "Révise à ton rythme, sans limite de temps",
    popular: false,
    features: [
      "Tout inclus, sans expiration",
      "Mises à jour incluses",
      "Accès aux futurs contenus",
      "Parfait à offrir à un proche",
    ],
    cta: "Accès à vie — 39,99 €",
    variant: "secondary" as const,
  },
];

interface PricingProps { onOpenAuth: () => void; }

export default function Pricing({ onOpenAuth }: PricingProps) {
  return (
    <section id="pricing" className="px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#FF4D1C]/8 border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            Tarifs
          </span>
          <h2 className="text-[32px] lg:text-[42px] font-bold text-gray-900 leading-tight tracking-tight mb-3">
            Choisis ton accès
          </h2>
          <p className="text-gray-500 text-[15px]">Un seul paiement. Pas d&apos;abonnement caché. Accès immédiat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start stagger">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-7 flex flex-col transition-all duration-300
                ${p.popular
                  ? "bg-[#111827] shadow-[0_24px_64px_rgba(0,0,0,0.18)] scale-[1.02]"
                  : "bg-white border border-black/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
                }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF4D1C] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide whitespace-nowrap shadow-md shadow-[#FF4D1C]/30">
                  Le plus choisi
                </div>
              )}

              <div className="mb-7">
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-[11px] font-bold uppercase tracking-widest ${p.popular ? "text-white/40" : "text-gray-400"}`}>{p.name}</p>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${p.popular ? "bg-white/10 text-white/70" : "bg-[#FF4D1C]/8 text-[#FF4D1C]"}`}>{p.duration}</span>
                </div>
                <div className="flex items-baseline gap-0.5 mb-2">
                  <span className={`text-[48px] font-black leading-none ${p.popular ? "text-white" : "text-gray-900"}`}>{p.price}</span>
                  <span className={`text-[18px] font-semibold ${p.popular ? "text-white/40" : "text-gray-400"}`}>{p.cents}</span>
                </div>
                <p className={`text-[13px] leading-snug ${p.popular ? "text-white/50" : "text-gray-400"}`}>{p.per}</p>
              </div>

              <div className={`w-full h-px mb-6 ${p.popular ? "bg-white/10" : "bg-black/[0.06]"}`} />

              <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className={`text-[14px] flex items-start gap-3 ${p.popular ? "text-white/80" : "text-gray-600"}`}>
                    <span className={`shrink-0 mt-0.5 rounded-full flex items-center justify-center size-4 ${p.popular ? "bg-[#FF4D1C]/20" : "bg-[#FF4D1C]/10"}`}>
                      <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>check</span>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenAuth}
                className={`w-full py-3.5 rounded-2xl text-[15px] font-bold transition-all cursor-pointer
                  ${p.popular
                    ? "bg-[#FF4D1C] text-white shadow-lg shadow-[#FF4D1C]/30 hover:bg-[#E8421A]"
                    : "bg-gray-50 text-gray-900 border border-black/[0.08] hover:bg-gray-100"
                  }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-[13px] text-gray-400 leading-relaxed">
          Paiement sécurisé via Stripe · CB, Apple Pay, Google Pay<br />
          Satisfait ou remboursé sous 7 jours si tu n&apos;as pas commencé
        </p>
      </div>
    </section>
  );
}
