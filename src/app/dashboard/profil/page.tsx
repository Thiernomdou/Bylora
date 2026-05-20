"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const supabase = createClient();

  const [displayName,    setDisplayName]    = useState("");
  const [interviewDate,  setInterviewDate]  = useState("");
  const [loading,        setLoading]        = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [error,          setError]          = useState("");
  const [initial,        setInitial]        = useState("T");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/"); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, interview_date")
        .eq("id", data.user.id)
        .single();
      if (profile) {
        setDisplayName(profile.display_name || "");
        setInterviewDate(profile.interview_date || "");
        setInitial((profile.display_name || "T").charAt(0).toUpperCase());
      }
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Session expirée."); setLoading(false); return; }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName,
      interview_date: interviewDate || null,
    });

    setLoading(false);
    if (upsertError) { setError(upsertError.message); return; }
    setSaved(true);
    setInitial(displayName.charAt(0).toUpperCase());
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen bg-[#FAF4EC] px-5 py-8 md:px-10 md:py-12">
      <div className="max-w-lg mx-auto">

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 text-[13px] font-medium hover:text-gray-900 transition-colors mb-8 cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
          Retour
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="size-16 rounded-full bg-[#FF4D1C] flex items-center justify-center text-white text-[28px] font-black shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-[20px] font-black text-gray-900">Mon profil</p>
            <p className="text-[13px] text-gray-500">Modifier vos informations personnelles</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-black/[0.07] rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSave} className="space-y-5">

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Prénom ou pseudo
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Sarah"
                className="w-full bg-[#FAF4EC] border border-black/[0.08] rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/30 focus:border-[#FF4D1C] text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Date d&apos;entretien <span className="text-gray-400 normal-case font-normal">(optionnel)</span>
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full bg-[#FAF4EC] border border-black/[0.08] rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D1C]/30 focus:border-[#FF4D1C] text-[14px]"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Renseignez votre date d&apos;entretien pour activer le compte à rebours.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-[13px] px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check_circle</span>
                Profil mis à jour !
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4D1C] text-white py-3.5 rounded-full font-bold text-[15px] hover:bg-[#E8421A] disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loading ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
