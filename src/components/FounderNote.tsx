export default function FounderNote() {
  return (
    <section className="bg-[#FAF4EC] border-y border-black/[0.07] px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="size-16 rounded-full bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: 28 }}>person</span>
          </div>

          <blockquote className="text-[26px] lg:text-[34px] font-bold text-gray-900 leading-snug mb-6 tracking-tight">
            &ldquo;Je cherchais partout comment réviser vite et aller à l&apos;essentiel — mais tout ce que je trouvais en ligne était éparpillé.
            Alors j&apos;ai <span className="text-[#FF4D1C]">décidé de construire cet outil moi-même.</span>&rdquo;
          </blockquote>

          <p className="text-[15px] lg:text-[16px] text-gray-500 leading-relaxed mb-8 max-w-2xl">
            Quand j&apos;ai préparé mon propre entretien de naturalisation, je ne trouvais rien de vraiment utile.
            Des listes de questions sans réponses, des forums contradictoires, des documents trop longs à lire.
            Impossible de savoir ce qui était à jour, ce qui était important, et comment s&apos;entraîner concrètement.
            <br /><br />
            J&apos;ai décidé de créer CitoyenFacile — l&apos;application que j&apos;aurais voulu trouver à ce moment-là.
            Parce que la naturalisation, ça change tout dans la vie d&apos;un étranger. Et personne ne devrait rater
            son entretien par manque de préparation alors que les questions existent et peuvent s&apos;apprendre.
          </p>

          <p className="text-[13px] text-gray-400 font-medium">
            — Le fondateur de CitoyenFacile · Naturalisé français
          </p>
        </div>
      </div>
    </section>
  );
}
