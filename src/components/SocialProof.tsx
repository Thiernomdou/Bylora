const stats = [
  { val: "555",    sup: "",   label: "vraies questions d'entretien" },
  { val: "20",     sup: "min", label: "par jour suffisent" },
  { val: "35 000", sup: "",   label: "naturalisations par an en France" },
  { val: "4,9",    sup: "★",  label: "note moyenne des utilisateurs" },
];

export default function SocialProof() {
  return (
    <div className="border-y border-black/[0.07] bg-white/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.val}>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[28px] lg:text-[34px] font-black text-gray-900 leading-none">{s.val}</span>
                {s.sup && <span className="text-[16px] font-bold text-[#FF4D1C]">{s.sup}</span>}
              </div>
              <div className="text-[13px] text-gray-500 mt-1.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
