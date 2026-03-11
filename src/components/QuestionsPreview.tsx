const questions = [
  { text: "Qu'est-ce que la laïcité à la française ?",            badge: "Valeurs",      color: "bg-amber-100 text-amber-700 border-amber-200" },
  { text: "Qui élit le Président de la République ?",             badge: "Institutions", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { text: "En quelle année a eu lieu la Révolution française ?",  badge: "Histoire",     color: "bg-blue-100 text-blue-700 border-blue-200" },
  { text: "Quels sont vos droits en tant que futur citoyen ?",    badge: "Droits",       color: "bg-purple-100 text-purple-700 border-purple-200" },
  { text: "Quelle est la devise de la France ?",                  badge: "Valeurs",      color: "bg-amber-100 text-amber-700 border-amber-200" },
  { text: "Quel fleuve traverse Paris ?",                         badge: "Géographie",   color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export default function QuestionsPreview() {
  return (
    <section id="questions" className="px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-12">
          <div>
            <span className="inline-block bg-[#FF4D1C]/8 border border-[#FF4D1C]/20 text-[#FF4D1C] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
              Les vraies questions
            </span>
            <h2 className="text-[32px] lg:text-[42px] font-bold text-gray-900 leading-tight tracking-tight">
              555 questions issues<br />des vrais entretiens
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {questions.map((q, i) => (
            <div
              key={q.text}
              className={`bg-white rounded-2xl px-5 py-4 flex items-center justify-between gap-4 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-200 ${i === questions.length - 1 ? "opacity-40" : ""}`}
            >
              <span className={`text-[14px] font-medium leading-snug ${i === questions.length - 1 ? "text-gray-500" : "text-gray-900"}`}>
                {i === questions.length - 1 ? "🔒 Accès réservé aux membres" : q.text}
              </span>
              <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide whitespace-nowrap border ${q.color}`}>
                {i === questions.length - 1 ? "+549" : q.badge}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center mt-7 text-[13px] text-gray-500">
          <strong className="text-[#FF4D1C]">555 questions</strong> réparties sur 5 thèmes · Mises à jour régulièrement
        </p>
      </div>
    </section>
  );
}
