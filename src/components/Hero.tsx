function MacBookMockup() {
  return (
    <div className="absolute left-0 top-0" style={{ width: 560 }}>
      {/* Ambient shadow */}
      <div style={{
        position: "absolute", left: 30, right: 0, bottom: -40, height: 60,
        background: "rgba(0,0,0,0.22)", filter: "blur(30px)", borderRadius: "50%", zIndex: -1,
      }} />

      {/* Screen lid — space gray aluminum */}
      <div style={{
        background: "linear-gradient(175deg, #3a3a3c 0%, #1c1c1e 40%, #2a2a2c 100%)",
        borderRadius: "14px 14px 0 0",
        padding: "14px 14px 0 14px",
        boxShadow: "0 -1px 0 rgba(255,255,255,0.08) inset, 0 1px 0 rgba(0,0,0,0.6) inset",
        border: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "none",
      }}>
        {/* Camera notch */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "radial-gradient(circle, #555 30%, #333 100%)",
            border: "1px solid #444",
            boxShadow: "0 0 0 2px rgba(255,255,255,0.04)",
          }} />
        </div>

        {/* Screen glass */}
        <div style={{
          width: 530, height: 330, borderRadius: "8px 8px 0 0",
          overflow: "hidden",
          background: "#f9fafb",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.3) inset",
          position: "relative",
        }}>
          {/* Screen glare */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "35%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)",
            zIndex: 10, pointerEvents: "none", borderRadius: "8px 8px 0 0",
          }} />

          <div style={{ display: "flex", height: "100%", position: "relative", zIndex: 1 }}>
            {/* Sidebar */}
            <div style={{ width: 82, background: "#ffffff", borderRight: "1px solid #ebebeb", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              {/* Logo */}
              <div style={{ padding: "12px 0", display: "flex", justifyContent: "center", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,77,28,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#FF4D1C" }}>local_library</span>
                </div>
              </div>
              {/* Nav */}
              <div style={{ flex: 1, padding: "10px 7px", display: "flex", flexDirection: "column", gap: 3 }}>
                {([
                  { icon: "home",             active: false },
                  { icon: "menu_book",        active: true  },
                  { icon: "fitness_center",   active: false },
                  { icon: "assignment",       active: false },
                  { icon: "bar_chart_4_bars", active: false },
                ] as const).map(({ icon, active }, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "9px 0", borderRadius: 10,
                    background: active ? "rgba(255,77,28,0.1)" : "transparent",
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: 17, color: active ? "#FF4D1C" : "#b0b0b0",
                      fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    }}>{icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content — Apprendre */}
            <div style={{ flex: 1, padding: "14px 14px 10px", background: "#f5f5f7", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#111827", lineHeight: 1 }}>Apprendre</p>
                  <p style={{ fontSize: 7.5, color: "#9ca3af", marginTop: 3 }}>555 questions · 5 thèmes</p>
                </div>
                {/* Search bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: "4px 10px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 10, color: "#9ca3af" }}>search</span>
                  <span style={{ fontSize: 8, color: "#d1d5db" }}>Rechercher...</span>
                </div>
              </div>

              {/* Progression globale */}
              <div style={{ background: "#111827", borderRadius: 12, padding: "10px 13px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -10, top: -10, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,77,28,0.25)", filter: "blur(20px)" }} />
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Progression globale</p>
                    <p style={{ color: "white", fontSize: 11, fontWeight: 700, marginTop: 3 }}>142 questions maîtrisées</p>
                    <div style={{ marginTop: 6, width: 120, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "56%", background: "#FF4D1C", borderRadius: 4 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { val: "56%", label: "global" },
                      { val: "18j", label: "entretien" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <p style={{ color: "white", fontSize: 13, fontWeight: 800, lineHeight: 1 }}>{s.val}</p>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 7, marginTop: 2 }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thèmes */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, flex: 1, overflow: "hidden", minHeight: 0 }}>
                {[
                  { icon: "flag",             label: "Valeurs françaises",   count: 112, pct: 72, color: "#FF4D1C",  status: "En cours"   },
                  { icon: "history_edu",       label: "Histoire de France",   count: 98,  pct: 54, color: "#3B82F6",  status: "En cours"   },
                  { icon: "account_balance",   label: "Institutions",         count: 85,  pct: 38, color: "#8B5CF6",  status: "À reprendre"},
                  { icon: "public",            label: "Géographie",           count: 76,  pct: 61, color: "#10B981",  status: "En cours"   },
                  { icon: "gavel",             label: "Droits & Citoyenneté", count: 92,  pct: 45, color: "#F59E0B",  status: "À reprendre"},
                ].map((t) => (
                  <div key={t.label} style={{
                    background: "white", borderRadius: 11, padding: "9px 11px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    display: "flex", flexDirection: "column", gap: 6,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                        background: `${t.color}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: t.color }}>{t.icon}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 8.5, fontWeight: 700, color: "#111827", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</p>
                        <p style={{ fontSize: 7, color: "#9ca3af", marginTop: 1.5 }}>{t.count} questions</p>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 800, color: t.color,
                        background: `${t.color}12`, borderRadius: 6, padding: "2px 5px",
                        flexShrink: 0,
                      }}>{t.pct}%</span>
                    </div>
                    <div>
                      <div style={{ height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: 4 }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                        <span style={{ fontSize: 7, color: "#9ca3af" }}>{Math.round(t.count * t.pct / 100)}/{t.count} maîtrisées</span>
                        <span style={{ fontSize: 7, fontWeight: 600, color: t.color }}>{t.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bezel (thin black strip) */}
      <div style={{
        background: "linear-gradient(to bottom, #1c1c1e, #111)",
        height: 4,
        borderRadius: "0 0 2px 2px",
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
      }} />

      {/* Hinge line */}
      <div style={{ height: 3, background: "linear-gradient(to bottom, #48484a, #2c2c2e)", margin: "0 2px" }} />

      {/* Base — silver aluminum */}
      <div style={{
        height: 26,
        background: "linear-gradient(to bottom, #e0e0e0 0%, #c8c8c8 50%, #b8b8b8 100%)",
        borderRadius: "0 0 10px 10px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.15)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Reflection stripe */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
        {/* Notch cutout hint */}
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 60, height: 3, borderRadius: 3, background: "rgba(0,0,0,0.08)" }} />
      </div>
    </div>
  );
}

function IPhoneScreen() {
  return (
    <>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", padding: "10px 14px", flexShrink: 0, marginTop: 50 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,77,28,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#FF4D1C" }}>local_library</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginLeft: 8, flex: 1 }}>Bylora</span>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#FF4D1C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700 }}>B</div>
      </div>

      {/* Content */}
      <div style={{ padding: "11px 12px", display: "flex", flexDirection: "column", gap: 9, flex: 1, overflow: "hidden" }}>
        {/* Progress bar row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 8.5, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>S'entraîner</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#374151" }}>7 / 20</span>
        </div>
        <div style={{ height: 4, width: "100%", background: "rgba(0,0,0,0.08)", borderRadius: 4, marginTop: -4 }}>
          <div style={{ height: "100%", width: "35%", background: "#FF4D1C", borderRadius: 4 }} />
        </div>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FAF4EC", border: "1px solid rgba(255,77,28,0.25)", borderRadius: 20, padding: "5px 11px", alignSelf: "flex-start" as const }}>
          <span className="material-symbols-outlined" style={{ fontSize: 11, color: "#FF4D1C" }}>flag</span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: "#FF4D1C" }}>Valeurs Françaises</span>
        </div>
        {/* Question card */}
        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "13px 13px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", flex: 1 }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 7 }}>Question</p>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", lineHeight: 1.45 }}>Quelle est la devise de la République française ?</p>
          <div style={{ marginTop: 11, paddingTop: 11, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 8, fontWeight: 700, color: "#FF4D1C", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Réponse</p>
            <p style={{ fontSize: 11.5, color: "#4b5563", lineHeight: 1.55 }}>&ldquo;Liberté, Égalité, Fraternité&rdquo; — inscrite dans la Constitution depuis 1789.</p>
          </div>
        </div>
        {/* Rating label */}
        <p style={{ fontSize: 8.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", textAlign: "center" as const }}>Tu connaissais ?</p>
        {/* Rating buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          <div style={{ background: "#FF4D1C", borderRadius: 14, padding: "10px 4px", textAlign: "center" as const, boxShadow: "0 4px 12px rgba(255,77,28,0.4)" }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "white" }}>Je sais</span>
          </div>
          <div style={{ background: "#FAF4EC", border: "1px solid rgba(255,77,28,0.25)", borderRadius: 14, padding: "10px 4px", textAlign: "center" as const }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "#FF4D1C" }}>J'hésite</span>
          </div>
          <div style={{ background: "rgba(0,0,0,0.05)", borderRadius: 14, padding: "10px 4px", textAlign: "center" as const }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "#6b7280" }}>Non</span>
          </div>
        </div>
      </div>
    </>
  );
}

function IPhoneMockup() {
  return (
    <div style={{ width: 230, position: "relative" }}>

      {/* Ombre portée douce sous le téléphone */}
      <div style={{
        position: "absolute",
        bottom: -28, left: "10%", right: "10%",
        height: 40,
        background: "rgba(0,0,0,0.45)",
        filter: "blur(22px)",
        borderRadius: "50%",
        zIndex: -1,
      }} />

      {/* ── BOUTON ACTION (gauche, haut) ── */}
      <div style={{
        position: "absolute", left: -3, top: 74,
        width: 3, height: 28,
        borderRadius: "2px 0 0 2px",
        background: "#1e1e20",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.7), -1px 0 0 rgba(255,255,255,0.06)",
      }} />
      {/* ── VOLUME + ── */}
      <div style={{
        position: "absolute", left: -3, top: 114,
        width: 3, height: 48,
        borderRadius: "2px 0 0 2px",
        background: "#1e1e20",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.7), -1px 0 0 rgba(255,255,255,0.06)",
      }} />
      {/* ── VOLUME − ── */}
      <div style={{
        position: "absolute", left: -3, top: 172,
        width: 3, height: 48,
        borderRadius: "2px 0 0 2px",
        background: "#1e1e20",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.7), -1px 0 0 rgba(255,255,255,0.06)",
      }} />
      {/* ── BOUTON POWER (droite) ── */}
      <div style={{
        position: "absolute", right: -3, top: 132,
        width: 3, height: 72,
        borderRadius: "0 2px 2px 0",
        background: "#1e1e20",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.7), 1px 0 0 rgba(255,255,255,0.06)",
      }} />

      {/* ── CADRE PRINCIPAL ── */}
      {/* Liseré extérieur métallique (1.5px) */}
      <div style={{
        borderRadius: 50,
        padding: 1.5,
        background: "linear-gradient(145deg, #4a4a4c 0%, #2a2a2c 30%, #141416 55%, #1e1e20 75%, #3a3a3c 100%)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 16px 32px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
      }}>

        {/* Corps du cadre en titane noir */}
        <div style={{
          borderRadius: 48.5,
          background: "#1a1a1c",
          padding: "3px 4px 8px",
          position: "relative",
        }}>

          {/* ── ÉCRAN (Dynamic Island intégré dedans) ── */}
          <div style={{
            borderRadius: 44,
            overflow: "hidden",
            background: "#f5f5f7",
            height: 468,
            display: "flex", flexDirection: "column",
            position: "relative",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.45)",
          }}>
            {/* Dynamic Island flottant en haut de l'écran */}
            <div style={{
              position: "absolute", top: 12, left: "50%",
              transform: "translateX(-50%)",
              width: 94, height: 26,
              borderRadius: 18,
              background: "#000",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 8px 0 13px",
              zIndex: 30,
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1a1a1a" }} />
              <div style={{
                width: 11, height: 11, borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #1c2e42 0%, #0c1a28 50%, #050d14 100%)",
                border: "1.5px solid rgba(60,90,140,0.55)",
                boxShadow: "inset 0 0 5px rgba(0,60,200,0.25)",
                position: "relative", flexShrink: 0,
              }}>
                <div style={{ position: "absolute", top: 1.5, left: 2, width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              </div>
            </div>

            {/* Reflet verre */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 30%, transparent 55%)",
              zIndex: 20, pointerEvents: "none", borderRadius: 44,
            }} />
            <IPhoneScreen />
          </div>

          {/* ── HOME INDICATOR ── */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 8, position: "relative", zIndex: 1 }}>
            <div style={{
              width: 60, height: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.20)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeroProps { onOpenAuth: () => void; }

export default function Hero({ onOpenAuth }: HeroProps) {
  return (
    <section className="hero-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-28 flex flex-col lg:flex-row items-center gap-14 lg:gap-16">

        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-gray-400 text-[14px] font-medium mb-4 tracking-wide">Bienvenue sur Bylora</p>

          <h1 className="text-[36px] lg:text-[50px] xl:text-[58px] font-bold leading-[1.1] tracking-tight text-gray-900 mb-6">
            Réussis ton entretien<br />
            de naturalisation<br />
            <span className="text-[#FF4D1C] font-extrabold">en toute sérénité</span>
          </h1>

          <p className="text-[15px] lg:text-[17px] text-gray-500 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
            555 questions issues des vrais entretiens. Répétition espacée intelligente.
            20 minutes par jour depuis ton téléphone ou ton ordinateur.
          </p>

          <div className="flex justify-center lg:justify-start">
            <button
              onClick={onOpenAuth}
              className="bg-[#FF4D1C] text-white text-[15px] font-semibold px-8 py-4 rounded-full hover:bg-[#E8421A] transition-colors cursor-pointer shadow-md shadow-[#FF4D1C]/25"
            >
              Je commence à réviser
            </button>
          </div>

          <p className="text-[13px] text-gray-400 mt-5 font-normal">
            Accès immédiat · Sans engagement · Paiement sécurisé
          </p>

          {/* Trust */}
          <div className="flex flex-wrap items-center gap-5 mt-8 justify-center lg:justify-start">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
              <span className="text-[#FF4D1C]">★★★★★</span> 4,9/5
            </div>
          </div>
        </div>

        {/* Devices — desktop */}
        <div className="hidden lg:block flex-shrink-0 relative" style={{ width: 660, height: 560 }}>
          <MacBookMockup />
          <div className="absolute bottom-0 right-0 z-10">
            <IPhoneMockup />
          </div>
        </div>

        {/* Phone only — mobile */}
        <div className="lg:hidden w-full flex justify-center">
          <IPhoneMockup />
        </div>

      </div>
    </section>
  );
}
