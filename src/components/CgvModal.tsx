"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CgvModal({ open, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-900">
            Conditions Générales d'Utilisation et de Vente
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-5 text-sm text-slate-600 leading-relaxed space-y-5">
          <p className="text-xs text-slate-400">
            Date d'entrée en vigueur : 21 juin 2025 · Dernière mise à jour : 15 février 2026
          </p>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 1 : Objet</h3>
            <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre CitoyenFacile et toute personne physique non commerçante (ci-après "le Client") souhaitant acquérir un accès aux services proposés sur citoyenfacile.fr. L'acquisition d'un service implique une acceptation sans réserve par le Client des présentes CGV.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 2 – Exploitant du Site</h3>
            <p>Le Site est édité par CitoyenFacile, plateforme de préparation à l'entretien de naturalisation française. Pour toute question : <strong>contact@citoyenfacile.fr</strong></p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 3 – Accès au Service</h3>
            <p>Le Site est destiné aux personnes majeures disposant de la pleine capacité juridique. L'accès au contenu complet est réservé aux membres ayant souscrit à l'un des plans payants.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 4 – Inscription</h3>
            <p>Pour accéder aux services, l'utilisateur doit créer un compte avec son email et un mot de passe. Il est responsable de la confidentialité de ses identifiants.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 5 – Offres disponibles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-3 py-2 text-left font-bold">Offre</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-bold">Prix TTC</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-bold">Pour qui</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2">Starter</td>
                    <td className="border border-slate-200 px-3 py-2">9,99 €</td>
                    <td className="border border-slate-200 px-3 py-2">Entretien dans moins d'1 mois</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-slate-200 px-3 py-2 font-semibold">Sérieux</td>
                    <td className="border border-slate-200 px-3 py-2 font-semibold">24,99 €</td>
                    <td className="border border-slate-200 px-3 py-2">Entretien dans 2 à 3 mois</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2">À vie</td>
                    <td className="border border-slate-200 px-3 py-2">39,99 €</td>
                    <td className="border border-slate-200 px-3 py-2">Réviser sans stress</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 6 – Paiement</h3>
            <p>Le paiement s'effectue exclusivement via Stripe (CB, Visa, MasterCard, Apple Pay, Google Pay). CitoyenFacile ne conserve aucune donnée bancaire. En cas d'échec de paiement, l'accès est suspendu.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 7 – Durée d'accès</h3>
            <p>Les plans Starter (1 mois) et Sérieux (3 mois) expirent automatiquement. Aucun renouvellement automatique. L'offre "À vie" donne accès pour une durée de 99 ans ou pour toute la durée d'exploitation du service, la plus courte étant retenue.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 8 – Droit de rétractation</h3>
            <p>Conformément à l'article L221-28 du Code de la consommation, l'accès au contenu étant immédiat après paiement, l'utilisateur renonce expressément à son droit de rétractation de 14 jours dès la validation du paiement. Aucun remboursement ne sera effectué.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 9 – Propriété intellectuelle</h3>
            <p>Tous les contenus (questions, réponses, fiches, statistiques, code source) sont la propriété exclusive de CitoyenFacile. Usage strictement personnel. Toute reproduction ou distribution sans autorisation écrite est interdite.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 10 – Données personnelles</h3>
            <p>Vos données sont traitées conformément au RGPD. Vous pouvez exercer vos droits (accès, rectification, effacement) en contactant contact@citoyenfacile.fr.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 11 – Médiation</h3>
            <p>En cas de litige : CM2C – Centre de Médiation et de la Consommation, 14 rue Saint-Jean, 75017 Paris — <strong>cm2c.net</strong></p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Article 12 – Loi applicable</h3>
            <p>Les présentes CGV sont régies par le droit français. Tout litige relève de la compétence des tribunaux français.</p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors cursor-pointer"
          >
            J'ai lu et compris
          </button>
        </div>
      </div>
    </div>
  );
}
