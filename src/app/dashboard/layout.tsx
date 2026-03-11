"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard",              icon: "home",             label: "Accueil"     },
  { href: "/dashboard/apprendre",    icon: "menu_book",        label: "Apprendre"   },
  { href: "/dashboard/simulation",   icon: "fitness_center",   label: "S'entraîner" },
  { href: "/dashboard/examen",       icon: "assignment",       label: "Entretien"   },
  { href: "/dashboard/statistiques", icon: "bar_chart_4_bars", label: "Statistiques" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path     = usePathname();
  const router   = useRouter();
  const [initial,      setInitial]      = useState("T");
  const [displayName,  setDisplayName]  = useState("");
  const [profileOpen,  setProfileOpen]  = useState(false);
  const mobileProfileRef  = useRef<HTMLDivElement>(null);
  const desktopProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", data.user.id)
          .single();
        if (profile?.display_name) {
          setInitial(profile.display_name.charAt(0).toUpperCase());
          setDisplayName(profile.display_name);
        }
      }
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const inMobile  = mobileProfileRef.current?.contains(e.target as Node);
      const inDesktop = desktopProfileRef.current?.contains(e.target as Node);
      if (!inMobile && !inDesktop) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  function ProfileDropdown() {
    return (
      <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-black/[0.08] rounded-2xl shadow-xl z-[200] overflow-hidden">
        <div className="px-4 py-3 border-b border-black/[0.06]">
          <p className="text-[13px] font-bold text-gray-900 truncate">{displayName || "Mon compte"}</p>
        </div>
        <div className="p-1.5">
          <Link
            href="/dashboard/profil"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-black/[0.04] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>manage_accounts</span>
            Modifier le profil
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* ── DESKTOP SIDEBAR ────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-white/80 backdrop-blur-md border-r border-black/[0.07] z-50 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-black/[0.06]">
          <div className="size-9 rounded-full bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "18px" }}>local_library</span>
          </div>
          <span className="text-gray-900 text-[17px] font-bold">Bylora</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => {
            const active = path === n.href || (n.href !== "/dashboard" && path.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-[14px] font-medium ${
                  active
                    ? "bg-[#FF4D1C]/10 text-[#FF4D1C] font-semibold"
                    : "text-gray-600 hover:bg-black/[0.04] hover:text-gray-900"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings: active
                      ? `'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24`
                      : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                  }}
                >
                  {n.icon}
                </span>
                {n.label}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* ── MAIN WRAPPER ──────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-56">

        {/* MOBILE HEADER */}
        <header className="md:hidden bg-white/70 backdrop-blur-md border-b border-black/[0.06] flex items-center px-5 py-3.5 sticky top-0 z-50">
          <div className="size-9 rounded-full bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#FF4D1C]" style={{ fontSize: "18px" }}>local_library</span>
          </div>
          <h2 className="text-gray-900 text-[17px] font-bold leading-tight ml-3 flex-1">Bylora</h2>
          <div className="relative" ref={mobileProfileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="size-9 rounded-full bg-[#FF4D1C] flex items-center justify-center text-white font-bold text-[13px] cursor-pointer"
            >
              {initial}
            </button>
            {profileOpen && <ProfileDropdown />}
          </div>
        </header>

        {/* DESKTOP TOPBAR */}
        <header className="hidden md:flex bg-white/60 backdrop-blur-md border-b border-black/[0.06] items-center px-8 py-3.5 sticky top-0 z-40">
          <div className="flex-1" />
          <div className="relative" ref={desktopProfileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/[0.04] border border-black/[0.07] hover:bg-black/[0.07] transition-colors cursor-pointer"
            >
              <div className="size-7 rounded-full bg-[#FF4D1C] flex items-center justify-center text-white font-bold text-[12px] shrink-0">
                {initial}
              </div>
              <span className="text-gray-700 text-[13px] font-medium max-w-[100px] truncate">{displayName || "Profil"}</span>
              <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "16px" }}>expand_more</span>
            </button>
            {profileOpen && <ProfileDropdown />}
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 pb-28 md:pb-8">
          {children}
        </main>

        {/* MOBILE BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/[0.06] z-50"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="flex items-center justify-around max-w-lg mx-auto px-1 py-1.5">
            {NAV.map((n) => {
              const active = path === n.href || (n.href !== "/dashboard" && path.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl transition-colors min-w-0 flex-1 ${
                    active ? "text-[#FF4D1C]" : "text-gray-400"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "22px",
                      fontVariationSettings: active
                        ? `'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24`
                        : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                    }}
                  >
                    {n.icon}
                  </span>
                  <span className={`text-[9px] leading-tight truncate w-full text-center ${active ? "font-bold" : "font-medium"}`}>{n.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
