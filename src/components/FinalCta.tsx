interface FinalCtaProps { onOpenAuth: () => void; }

export default function FinalCta({ onOpenAuth }: FinalCtaProps) {
  return (
    <section className="px-6 py-20 lg:py-28">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-3xl px-8 lg:px-16 py-14 lg:py-20 text-center relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 size-64 bg-[#FF4D1C]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 size-48 bg-[#FF4D1C]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10">
            <h2 className="text-[32px] lg:text-[48px] font-bold text-white leading-tight tracking-tight mb-5">
              Ton entretien approche.<br />Commence aujourd&apos;hui.
            </h2>
            <p className="text-[15px] lg:text-[17px] text-white/60 mb-10 leading-relaxed">
              20 minutes par jour. Les vraies questions. Arriver confiant le jour J.
            </p>
            <button
              onClick={onOpenAuth}
              className="bg-[#FF4D1C] text-white py-4 px-10 rounded-full text-[17px] font-bold shadow-xl hover:bg-[#E8421A] transition-colors cursor-pointer"
            >
              Commencer ma préparation →
            </button>
            <p className="mt-6 text-[13px] text-white/40">Accès immédiat · Sans engagement</p>
          </div>
        </div>
      </div>
    </section>
  );
}
