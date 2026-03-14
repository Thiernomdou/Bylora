"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "signup" | "login";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const router   = useRouter();
  const supabase = createClient();

  const [tab,             setTab]             = useState<Tab>("signup");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6)          { setError("Le mot de passe doit contenir au moins 6 caractères."); return; }
    if (password !== confirmPassword)  { setError("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: email.split("@")[0] },
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

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_done, parcours_defaut")
        .eq("id", user.id)
        .single();

      setLoading(false);
      onClose();

      if (!profile?.onboarding_done) {
        router.push("/onboarding");
      } else {
        const stored = localStorage.getItem("cf_parcours");
        if (stored) {
          await supabase.from("profiles").update({ parcours_defaut: stored }).eq("id", user.id);
          localStorage.removeItem("cf_parcours");
          router.push(stored === "examen-civique" ? "/dashboard/examen-civique" : "/dashboard");
        } else if (profile?.parcours_defaut === "examen-civique") {
          router.push("/dashboard/examen-civique");
        } else {
          router.push("/dashboard");
        }
      }
      router.refresh();
    }
  };

  const inputClass = "bg-[#FAF4EC] border border-black/[0.08] rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/30 focus:border-[#FF4D1C] w-full text-[14px]";

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white border border-black/[0.08] rounded-3xl shadow-2xl w-full max-w-md p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-8 rounded-full bg-black/[0.05] border border-black/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-black/[0.08] transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <p className="text-[22px] font-black text-gray-900 mb-1">
            {tab === "signup" ? "Créer un compte" : "Se connecter"}
          </p>
          <p className="text-[13px] text-gray-500">
            {tab === "signup" ? "Préparez votre examen civique." : "Bon retour ! Ton parcours t'attend."}
          </p>
        </div>

        <div className="flex bg-black/[0.04] border border-black/[0.07] rounded-xl p-1 mb-6">
          {(["signup", "login"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t === "signup" ? "S'inscrire" : "Se connecter"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            {[
              { label: "Email",                    type: "email",    val: email,           set: setEmail,           ph: "nom@exemple.com" },
              { label: "Mot de passe",              type: "password", val: password,        set: setPassword,        ph: "6 caractères minimum" },
              { label: "Confirmer le mot de passe", type: "password", val: confirmPassword, set: setConfirmPassword, ph: "Même mot de passe" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} required className={inputClass} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-[#FF4D1C] text-white py-3.5 rounded-full font-bold text-[15px] hover:bg-[#E8421A] disabled:opacity-50 cursor-pointer transition-colors mt-1">
              {loading ? "Création du compte…" : "S'inscrire"}
            </button>
          </form>
        )}

        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-3">
            {[
              { label: "Email",        type: "email",    val: email,    set: setEmail,    ph: "nom@exemple.com" },
              { label: "Mot de passe", type: "password", val: password, set: setPassword, ph: "Ton mot de passe" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} required className={inputClass} />
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
  );
}
