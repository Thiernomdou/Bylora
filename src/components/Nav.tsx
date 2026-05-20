interface Props { onOpenAuth: () => void; }

export default function Nav({ onOpenAuth }: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-[#FAF4EC]/90 backdrop-blur-md border-b border-black/[0.07]">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/icon.svg" alt="" className="h-7 w-7" aria-hidden="true" />
          <span className="text-[20px] font-black tracking-tight text-gray-900">
            Citoyen<span className="text-[#FF4D1C]">Facile</span>
          </span>
        </a>

        {/* Links — desktop only */}
        <div className="hidden md:flex items-center gap-7 flex-1">
          <a href="#comment"   className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Comment ça marche</a>
          <a href="#questions" className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Les questions</a>
          <a href="#pricing"   className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Tarifs</a>
          <a href="#faq"       className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Se connecter — desktop uniquement (trop large sur mobile) */}
          <button
            onClick={onOpenAuth}
            className="hidden md:block text-[14px] font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-black/[0.05] transition-colors cursor-pointer whitespace-nowrap"
          >
            Se connecter
          </button>
          <button
            onClick={onOpenAuth}
            className="bg-[#FF4D1C] text-white text-[13px] md:text-[14px] font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-[#E8421A] transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            <span className="md:hidden">Commencer</span>
            <span className="hidden md:inline">Créer un compte</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
