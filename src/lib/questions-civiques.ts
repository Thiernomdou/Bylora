export type ThemeCivique = "republique" | "institutions" | "droits" | "histoire" | "societe";

export interface QuestionCivique {
  id: string;
  theme: ThemeCivique;
  question: string;
  options: string[];
  correct: number;
  explication?: string;
}

export const THEMES_CIVIQUES: Record<ThemeCivique, { label: string; icon: string; color: string; bg: string; accent: string }> = {
  republique:   { label: "Principes et valeurs de la République", icon: "flag",            color: "text-blue-700",   bg: "bg-blue-50",   accent: "#002395" },
  institutions: { label: "Système institutionnel et politique",   icon: "account_balance",  color: "text-purple-700", bg: "bg-purple-50", accent: "#7C3AED" },
  droits:       { label: "Droits et devoirs",                     icon: "gavel",            color: "text-green-700",  bg: "bg-green-50",  accent: "#059669" },
  histoire:     { label: "Histoire, géographie et culture",       icon: "history_edu",      color: "text-amber-700",  bg: "bg-amber-50",  accent: "#D97706" },
  societe:      { label: "Vivre dans la société française",       icon: "people",           color: "text-rose-700",   bg: "bg-rose-50",   accent: "#E11D48" },
};

export const QUESTIONS_CIVIQUES: QuestionCivique[] = [
  // ── REPUBLIQUE ──────────────────────────────────────────────────────────────
  { id: "r01", theme: "republique", question: "Quelle est la devise de la République française ?", options: ["Liberté, Égalité, Fraternité", "Foi, Espérance, Charité", "Travail, Famille, Patrie", "Honneur, Patrie, Valeur"], correct: 0 },
  { id: "r02", theme: "republique", question: "En quelle année la Première République française a-t-elle été proclamée ?", options: ["1789", "1792", "1799", "1804"], correct: 1 },
  { id: "r03", theme: "republique", question: "Quelle loi a établi la séparation de l'Église et de l'État ?", options: ["Loi du 21 mars 1884", "Loi du 1er juillet 1901", "Loi du 9 décembre 1905", "Loi du 16 juillet 1889"], correct: 2 },
  { id: "r04", theme: "republique", question: "Qu'est-ce que la laïcité en France ?", options: ["L'interdiction de toute religion", "La religion d'État catholique", "L'obligation de pratiquer une religion", "La séparation de l'État et des religions garantissant la liberté de conscience"], correct: 3 },
  { id: "r05", theme: "republique", question: "Quel est l'hymne national de la France ?", options: ["Le Chant du Départ", "L'Internationale", "La Marseillaise", "Le Chant des Partisans"], correct: 2 },
  { id: "r06", theme: "republique", question: "Quelle est la fête nationale française ?", options: ["1er mai", "8 mai", "11 novembre", "14 juillet"], correct: 3 },
  { id: "r07", theme: "republique", question: "Quel article de la Constitution définit la France comme 'République indivisible, laïque, démocratique et sociale' ?", options: ["Article 1", "Article 2", "Article 3", "Article 4"], correct: 0 },
  { id: "r08", theme: "republique", question: "De gauche à droite depuis la hampe, quelles sont les couleurs du drapeau français ?", options: ["Rouge, blanc, bleu", "Blanc, rouge, bleu", "Bleu, blanc, rouge", "Rouge, bleu, blanc"], correct: 2 },
  { id: "r09", theme: "republique", question: "Que représente la Marianne ?", options: ["La monarchie française", "Le catholicisme en France", "La République française et ses valeurs", "L'armée nationale"], correct: 2 },
  { id: "r10", theme: "republique", question: "La Déclaration des Droits de l'Homme et du Citoyen a été adoptée en :", options: ["1776", "1789", "1793", "1795"], correct: 1 },
  { id: "r11", theme: "republique", question: "Quel est le régime politique actuel de la France ?", options: ["Monarchie constitutionnelle", "République parlementaire", "République fédérale", "République semi-présidentielle"], correct: 3 },
  { id: "r12", theme: "republique", question: "La liberté d'expression en France est encadrée par :", options: ["Aucune limite", "Le respect de la loi et des droits d'autrui", "Le seul avis du gouvernement", "Les décisions de l'Église"], correct: 1 },

  // ── INSTITUTIONS ────────────────────────────────────────────────────────────
  { id: "i01", theme: "institutions", question: "Qui est le chef de l'État en France ?", options: ["Le Premier ministre", "Le Président du Sénat", "Le Président de la République", "Le Président de l'Assemblée nationale"], correct: 2 },
  { id: "i02", theme: "institutions", question: "Quelle est la durée du mandat présidentiel depuis 2002 ?", options: ["4 ans", "5 ans", "6 ans", "7 ans"], correct: 1 },
  { id: "i03", theme: "institutions", question: "Combien de chambres compose le Parlement français ?", options: ["Une", "Deux", "Trois", "Quatre"], correct: 1, explication: "L'Assemblée nationale et le Sénat." },
  { id: "i04", theme: "institutions", question: "Quel est le rôle du Premier ministre ?", options: ["Représenter la France à l'étranger", "Présider l'Assemblée nationale", "Diriger le gouvernement et conduire la politique de la nation", "Nommer les ministres sans accord du Président"], correct: 2 },
  { id: "i05", theme: "institutions", question: "À quel âge peut-on voter en France ?", options: ["16 ans", "17 ans", "18 ans", "21 ans"], correct: 2 },
  { id: "i06", theme: "institutions", question: "Combien de membres compte l'Assemblée nationale ?", options: ["348", "400", "500", "577"], correct: 3 },
  { id: "i07", theme: "institutions", question: "Quel est le rôle du Conseil constitutionnel ?", options: ["Juger les crimes contre l'État", "Gérer les finances publiques", "Veiller à la conformité des lois avec la Constitution", "Nommer les ministres"], correct: 2 },
  { id: "i08", theme: "institutions", question: "Combien de régions compte la France métropolitaine depuis 2016 ?", options: ["9", "13", "18", "22"], correct: 1 },
  { id: "i09", theme: "institutions", question: "Quelle institution contrôle les comptes publics de l'État ?", options: ["Le Sénat", "La Cour de cassation", "Le Conseil d'État", "La Cour des comptes"], correct: 3 },
  { id: "i10", theme: "institutions", question: "Qui nomme le Premier ministre ?", options: ["L'Assemblée nationale", "Le Sénat", "Le Président de la République", "Le Conseil constitutionnel"], correct: 2 },
  { id: "i11", theme: "institutions", question: "Quel est le mode de scrutin pour l'élection présidentielle ?", options: ["Scrutin à un tour", "Scrutin proportionnel", "Scrutin majoritaire à deux tours", "Scrutin indirect"], correct: 2 },
  { id: "i12", theme: "institutions", question: "La Constitution actuelle (Cinquième République) date de :", options: ["1944", "1946", "1958", "1962"], correct: 2 },

  // ── DROITS ──────────────────────────────────────────────────────────────────
  { id: "d01", theme: "droits", question: "Quel organisme défend les droits des citoyens face à l'administration ?", options: ["Le Conseil d'État", "La Cour de cassation", "Le Défenseur des droits", "Le Conseil constitutionnel"], correct: 2 },
  { id: "d02", theme: "droits", question: "Qu'est-ce que la présomption d'innocence ?", options: ["L'accusé est présumé coupable", "La police peut détenir sans limite", "Tout accusé est considéré innocent jusqu'à preuve de sa culpabilité", "Le juge peut condamner sans preuve"], correct: 2 },
  { id: "d03", theme: "droits", question: "La scolarité est obligatoire en France de :", options: ["6 à 14 ans", "3 à 16 ans", "6 à 18 ans", "6 à 16 ans"], correct: 1 },
  { id: "d04", theme: "droits", question: "Qu'est-ce que le droit d'asile ?", options: ["Le droit de refuser l'expulsion", "La protection accordée aux personnes fuyant des persécutions", "Le droit au logement social", "L'autorisation de travailler sans visa"], correct: 1 },
  { id: "d05", theme: "droits", question: "Le droit de grève en France est reconnu :", options: ["Uniquement dans le secteur privé", "Uniquement dans la fonction publique", "Pour tous les travailleurs sauf exceptions légales", "Il est interdit en France"], correct: 2 },
  { id: "d06", theme: "droits", question: "Qu'est-ce que la liberté de la presse ?", options: ["Le droit de l'État de contrôler les médias", "L'obligation de publier les informations officielles", "Le droit des journalistes de publier sans censure préalable de l'État", "Réservée aux journaux agréés par le gouvernement"], correct: 2 },
  { id: "d07", theme: "droits", question: "Quel est le nombre légal de jours de congés payés par an en France ?", options: ["20 jours", "25 jours", "30 jours", "35 jours"], correct: 1 },
  { id: "d08", theme: "droits", question: "L'autorité chargée de protéger les données personnelles en France est :", options: ["L'ARCOM", "La CNIL", "L'AMF", "Le CSA"], correct: 1 },
  { id: "d09", theme: "droits", question: "La Journée Défense et Citoyenneté (JDC) est :", options: ["Un jour férié national", "Une fête patriotique annuelle", "Une journée réservée aux militaires", "Une journée obligatoire pour les jeunes Français de 16-18 ans"], correct: 3 },
  { id: "d10", theme: "droits", question: "Le droit à l'éducation en France est :", options: ["Réservé aux citoyens français", "Payant et accessible à tous", "Un droit universel garanti par la Constitution", "Réservé aux mineurs français"], correct: 2 },
  { id: "d11", theme: "droits", question: "En France, l'égalité entre les femmes et les hommes est :", options: ["Un objectif non contraignant", "Un principe constitutionnel depuis 1999", "Réservée au domaine professionnel", "Une recommandation européenne"], correct: 1 },
  { id: "d12", theme: "droits", question: "La liberté d'association en France est encadrée par :", options: ["Le Code civil", "La loi du 1er juillet 1901", "La Constitution de 1958", "Un décret présidentiel"], correct: 1 },

  // ── HISTOIRE ────────────────────────────────────────────────────────────────
  { id: "h01", theme: "histoire", question: "En quelle année la Révolution française a-t-elle débuté ?", options: ["1776", "1789", "1799", "1815"], correct: 1 },
  { id: "h02", theme: "histoire", question: "Quel est le plus long fleuve de France ?", options: ["La Seine", "Le Rhône", "La Garonne", "La Loire"], correct: 3 },
  { id: "h03", theme: "histoire", question: "Qui était le général de Gaulle ?", options: ["Un maréchal de 14-18", "Le fondateur de la Ve République, président de 1959 à 1969", "Un président de la IVe République", "Un Premier ministre de la IIIe République"], correct: 1 },
  { id: "h04", theme: "histoire", question: "La Seconde Guerre mondiale s'est terminée en :", options: ["1943", "1944", "1945", "1946"], correct: 2 },
  { id: "h05", theme: "histoire", question: "Quelle est la plus haute montagne de France (et d'Europe occidentale) ?", options: ["Les Écrins", "Le Mont Rose", "Le Ventoux", "Le Mont Blanc"], correct: 3 },
  { id: "h06", theme: "histoire", question: "En quelle année la France a-t-elle aboli la peine de mort ?", options: ["1970", "1975", "1981", "1990"], correct: 2 },
  { id: "h07", theme: "histoire", question: "L'Appel du 18 juin 1940 a été lancé depuis :", options: ["Paris", "Alger", "Londres", "Vichy"], correct: 2 },
  { id: "h08", theme: "histoire", question: "Le Traité de Maastricht, fondateur de l'Union européenne, a été signé en :", options: ["1957", "1986", "1992", "2004"], correct: 2 },
  { id: "h09", theme: "histoire", question: "Quelle est la superficie approximative de la France métropolitaine ?", options: ["350 000 km²", "450 000 km²", "551 000 km²", "650 000 km²"], correct: 2 },
  { id: "h10", theme: "histoire", question: "Napoléon Bonaparte est devenu Empereur des Français en :", options: ["1799", "1802", "1804", "1810"], correct: 2 },
  { id: "h11", theme: "histoire", question: "La construction européenne a débuté avec le Traité de Rome en :", options: ["1945", "1950", "1957", "1963"], correct: 2 },
  { id: "h12", theme: "histoire", question: "Le débarquement allié en Normandie a eu lieu le :", options: ["6 juin 1944", "8 mai 1945", "11 novembre 1918", "18 juin 1940"], correct: 0 },

  // ── SOCIETE ─────────────────────────────────────────────────────────────────
  { id: "s01", theme: "societe", question: "Que signifie le SMIC ?", options: ["Salaire Minimum Interprofessionnel de Croissance", "Sécurité Minimale des Individus au Chômage", "Salaire Moyen des Industries et du Commerce", "Service Minimum d'Insertion et de Compétence"], correct: 0 },
  { id: "s02", theme: "societe", question: "Quelle est la durée légale du travail hebdomadaire en France ?", options: ["32 heures", "35 heures", "37 heures", "40 heures"], correct: 1 },
  { id: "s03", theme: "societe", question: "La Sécurité sociale couvre notamment :", options: ["Uniquement les accidents du travail", "Les risques maladie, accident, vieillesse et famille", "Uniquement les chômeurs", "Uniquement les fonctionnaires"], correct: 1 },
  { id: "s04", theme: "societe", question: "Que signifie CAF ?", options: ["Caisse d'Assurance Famille", "Caisse d'Allocations Familiales", "Centre d'Aide aux Familles", "Comité d'Action Familiale"], correct: 1 },
  { id: "s05", theme: "societe", question: "L'enseignement public en France est :", options: ["Payant pour tous", "Gratuit et religieux", "Payant uniquement à l'université", "Gratuit et laïque"], correct: 3 },
  { id: "s06", theme: "societe", question: "France Travail (ex-Pôle Emploi) est :", options: ["Une agence d'intérim privée", "Un syndicat de travailleurs", "Le service public accompagnant les demandeurs d'emploi", "Une caisse de retraite"], correct: 2 },
  { id: "s07", theme: "societe", question: "Depuis la réforme de 2023, l'âge légal minimum de départ à la retraite en France est :", options: ["60 ans", "62 ans", "64 ans", "67 ans"], correct: 2 },
  { id: "s08", theme: "societe", question: "La Protection universelle maladie (PUMa) est :", options: ["Une taxe sur les revenus", "Une assurance habitation", "Une couverture maladie pour toute personne résidant en France", "Un régime de retraite complémentaire"], correct: 2 },
  { id: "s09", theme: "societe", question: "Quel est le rôle des syndicats en France ?", options: ["Gérer les entreprises", "Recruter des salariés", "Contrôler les salaires pour le gouvernement", "Défendre les intérêts des travailleurs et négocier avec les employeurs"], correct: 3 },
  { id: "s10", theme: "societe", question: "Comment appelle-t-on le représentant de l'État dans un département ?", options: ["Le maire", "Le Président du Conseil départemental", "Le Préfet", "Le Sous-préfet"], correct: 2 },
  { id: "s11", theme: "societe", question: "La commune est :", options: ["Le plus grand échelon administratif", "La plus petite division administrative de la France", "Un regroupement de départements", "Une subdivision de la région"], correct: 1 },
  { id: "s12", theme: "societe", question: "Le droit à la santé en France implique notamment :", options: ["Un remboursement total de tous les soins sans exception", "La gratuité de tous les médicaments", "Une couverture par l'Assurance maladie avec remboursements partiels", "L'accès aux soins réservé aux cotisants"], correct: 2 },
];

export const PARCOURS_CIVIQUES: Record<string, { label: string; sigle: string; icon: string; desc: string }> = {
  csp: { label: "Titre de séjour pluriannuel", sigle: "CSP",  icon: "badge",        desc: "Carte de séjour pluriannuelle — renouvellement de titre de séjour" },
  cr:  { label: "Carte de résident",           sigle: "CR",   icon: "credit_card",  desc: "Carte de résident 10 ans — résidence longue durée en France" },
  nat: { label: "Naturalisation",              sigle: "NAT",  icon: "star",         desc: "Acquisition de la nationalité française par décret" },
};
