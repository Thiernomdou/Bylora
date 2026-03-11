export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.07] px-6 lg:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-8 border-b border-black/[0.07]">
          <div>
            <p className="text-[22px] font-black text-gray-900 mb-1.5">
              By<span className="text-[#FF4D1C]">lora</span>
            </p>
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs">
              La préparation à l&apos;entretien de naturalisation française<br />pour la diaspora africaine.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-[14px] text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors font-medium">Mentions légales</a>
            <a href="#" className="hover:text-gray-900 transition-colors font-medium">Confidentialité</a>
            <a href="#" className="hover:text-gray-900 transition-colors font-medium">Contact</a>
          </div>
        </div>
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-gray-400">© 2026 Bylora · Fait avec ❤️ en France</p>
          <p className="text-[12px] text-gray-400">Paiement sécurisé · Données protégées</p>
        </div>
      </div>
    </footer>
  );
}
