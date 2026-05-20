"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
    >
      Déconnexion
    </button>
  );
}
