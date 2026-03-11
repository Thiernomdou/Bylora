"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import CgvModal from "./CgvModal";

type Tab = "signup" | "login";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("signup");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [marketingOpt, setMarketingOpt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cgvOpen, setCgvOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cgvAccepted) { setError("Veuillez accepter les CGV pour continuer."); return; }
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères."); return; }

    setLoading(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0], marketing_opt_in: marketingOpt },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (signUpError) {
      setError(signUpError.message === "User already registered"
        ? "Un compte existe déjà avec cet email. Connecte-toi."
        : signUpError.message);
      setLoading(false);
      return;
    }

    // Update profile with marketing opt-in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        display_name: displayName || email.split("@")[0],
        email,
        marketing_opt_in: marketingOpt,
      });
    }

    setLoading(false);
    onClose();
    router.push("/onboarding");
    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message === "Invalid login credentials"
        ? "Email ou mot de passe incorrect."
        : loginError.message);
      setLoading(false);
      return;
    }

    // Check if onboarding done
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_done")
        .eq("id", user.id)
        .single();

      setLoading(false);
      onClose();
      router.push(profile?.onboarding_done ? "/dashboard" : "/onboarding");
      router.refresh();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Card */}
        <div className="bg-white border border-black/[0.08] rounded-3xl shadow-2xl w-full max-w-md p-8 relative">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-8 rounded-full bg-black/[0.05] border border-black/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-black/[0.08] transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-[22px] font-black text-gray-900 mb-1">
              {tab === "signup" ? "Créer un compte" : "Se connecter"}
            </p>
            <p className="text-[13px] text-gray-500">
              {tab === "signup"
                ? "Rejoignez-nous pour préparer votre entretien de naturalisation."
                : "Bon retour ! Ton parcours t'attend."}
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex bg-black/[0.04] border border-black/[0.07] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab("signup"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${tab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              S&apos;inscrire
            </button>
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${tab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Se connecter
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* SIGN UP FORM */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <label className="flex items-start gap-3 bg-[#FAF4EC] border border-black/[0.07] rounded-2xl p-4 cursor-pointer">
                <input type="checkbox" checked={cgvAccepted} onChange={(e) => setCgvAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded shrink-0 cursor-pointer accent-[#FF4D1C]" />
                <span className="text-[13px] text-gray-600 leading-relaxed">
                  Je reconnais avoir lu et accepté les{" "}
                  <button type="button" onClick={() => setCgvOpen(true)} className="text-[#FF4D1C] font-semibold underline cursor-pointer">CGU & CGV</button>
                  {" "}et la{" "}
                  <button type="button" onClick={() => setCgvOpen(true)} className="text-[#FF4D1C] font-semibold underline cursor-pointer">Politique de Confidentialité</button>.
                </span>
              </label>

              <div className="border-t border-black/[0.07] pt-3 space-y-3">
                <p className="text-[11px] text-center text-gray-400 uppercase tracking-widest font-semibold">Mes informations</p>

                {[
                  { label: "Prénom ou pseudo", type: "text",     val: displayName, set: setDisplayName, ph: "Mamadou" },
                  { label: "Email",             type: "email",    val: email,       set: setEmail,       ph: "nom@exemple.com" },
                  { label: "Mot de passe",      type: "password", val: password,    set: setPassword,    ph: "6 caractères minimum" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                      required={f.type !== "text"}
                      className="bg-[#FAF4EC] border border-black/[0.08] rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/30 focus:border-[#FF4D1C] w-full text-[14px]" />
                  </div>
                ))}

                <button type="submit" disabled={loading}
                  className="w-full bg-[#FF4D1C] text-white py-3.5 rounded-full font-bold text-[15px] hover:bg-[#E8421A] disabled:opacity-50 cursor-pointer transition-colors">
                  {loading ? "Création du compte…" : "S'inscrire"}
                </button>
              </div>
            </form>
          )}

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-3">
              {[
                { label: "Email",       type: "email",    val: email,    set: setEmail,    ph: "nom@exemple.com" },
                { label: "Mot de passe", type: "password", val: password, set: setPassword, ph: "Ton mot de passe" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} required
                    className="bg-[#FAF4EC] border border-black/[0.08] rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/30 focus:border-[#FF4D1C] w-full text-[14px]" />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full bg-[#FF4D1C] text-white py-3.5 rounded-full font-bold text-[15px] hover:bg-[#E8421A] disabled:opacity-50 cursor-pointer transition-colors">
                {loading ? "Connexion…" : "Se connecter"}
              </button>
              <button type="button" className="w-full text-[13px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                Mot de passe oublié ?
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CGV Modal */}
      <CgvModal open={cgvOpen} onClose={() => setCgvOpen(false)} />
    </>
  );
}
