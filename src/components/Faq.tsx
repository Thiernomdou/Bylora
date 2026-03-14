"use client";

import { useState } from "react";

const faqs = [
  { q: "Est-ce que les 555 questions sont vraiment celles posées à l'entretien ?", a: "Oui. Elles ont été collectées et vérifiées par le fondateur lui-même, qui a passé son entretien en novembre 2025, et complétées par des retours d'autres candidats. Elles couvrent tous les thèmes officiels." },
  { q: "Est-ce que ça fonctionne sur téléphone sans installer d'application ?", a: "Oui. CitoyenFacile est une PWA (Progressive Web App). Tu l'ouvres dans ton navigateur et tu peux l'ajouter sur ton écran d'accueil en un tap. Aucune installation App Store nécessaire. Fonctionne aussi parfaitement sur ordinateur." },
  { q: "Comment fonctionne la répétition espacée ?", a: "Quand tu réponds à une question, tu choisis entre Je connais / J'hésite / Je ne sais pas. L'algorithme fait revenir les questions difficiles plus souvent, et espace celles que tu maîtrises. Tu mémorises mieux, plus vite." },
  { q: "Mon entretien est dans 2 semaines. C'est suffisant ?", a: "Oui. 20 minutes par jour pendant 2 semaines couvrent l'essentiel. L'algorithme priorisera automatiquement les questions les plus importantes selon le temps qu'il te reste." },
  { q: "Et si mon entretien est reporté ou annulé ?", a: "Tu peux mettre à jour ta date d'entretien à tout moment. Si tu as choisi l'accès à vie, pas de problème — tu y as accès aussi longtemps que nécessaire." },
  { q: "Comment CitoyenFacile se différencie des autres outils ?", a: "CitoyenFacile est fondé par quelqu'un qui a réellement passé l'entretien. Les questions viennent de vrais entretiens, pas de manuels scolaires. Et l'interface est pensée pour le téléphone — révise dans le métro, au travail, chez toi." },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="inline-block bg-[#FF4D1C]/8 border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
            Questions fréquentes
          </span>
          <h2 className="text-[32px] lg:text-[42px] font-black text-gray-900 leading-tight tracking-tight">
            Tu as des questions ?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start max-w-5xl">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#FAF4EC] border border-black/[0.07] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 text-left text-[14px] lg:text-[15px] font-semibold text-gray-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.02] transition-colors"
              >
                <span>{f.q}</span>
                <span className={`shrink-0 size-7 bg-white border border-black/[0.08] text-gray-500 rounded-full flex items-center justify-center font-bold text-[16px] transition-transform shadow-sm ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-[14px] text-gray-500 leading-relaxed border-t border-black/[0.07] pt-4">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
