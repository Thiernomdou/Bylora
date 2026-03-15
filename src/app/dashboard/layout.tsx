"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_ENTRETIEN = [
  { href: "/dashboard",              icon: "home",             label: "Accueil"      },
  { href: "/dashboard/entretien",    icon: "record_voice_over",label: "Mon entretien" },
  { href: "/dashboard/apprendre",    icon: "menu_book",        label: "Apprendre"    },
  { href: "/dashboard/simulation",   icon: "fitness_center",   label: "S'entraîner"  },
  { href: "/dashboard/examen",       icon: "assignment",       label: "Entretien"    },
  { href: "/dashboard/statistiques", icon: "bar_chart_4_bars", label: "Statistiques" },
];

function buildNavCivique(parcours?: string) {
  const base = [
    { href: "/dashboard",                icon: "home",  label: "Accueil"        },
    { href: "/dashboard/examen-civique", icon: "quiz",  label: "Examen civique" },
  ];
  if (!parcours) return base;
  return [
    ...base,
    { href: `/dashboard/examen-civique/${parcours}/revision`,      icon: "menu_book",        label: "Apprendre"    },
    { href: `/dashboard/examen-civique/${parcours}/entrainement`,  icon: "fitness_center",   label: "S'entraîner"  },
    { href: `/dashboard/examen-civique/${parcours}/examen`,        icon: "assignment",       label: "Examen"       },
    { href: `/dashboard/examen-civique/${parcours}/statistiques`,  icon: "bar_chart_4_bars", label: "Statistiques" },
  ];
}

const NAV_HOME = [
  { href: "/dashboard", icon: "home", label: "Accueil" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path    = usePathname();
  const router  = useRouter();
  const [initial,     setInitial]     = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const emailInitial = (data.user.email ?? "?").charAt(0).toUpperCase();
        setInitial(emailInitial);
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
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
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

      {/* ── SIDEBAR (mobile: slim icons / desktop: full) ── */}
      <aside className="flex flex-col fixed left-0 top-0 h-full z-50
        w-14 md:w-56
        bg-white/90 md:bg-white/80 backdrop-blur-md border-r border-black/[0.07] shadow-sm"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center justify-center md:justify-start gap-2 px-0 md:px-4 py-4 md:py-5 border-b border-black/[0.06] shrink-0">
          {/* Mobile: icône seule */}
          <img src="/icon.svg" alt="" className="flex md:hidden h-7 w-7" aria-hidden="true" />
          {/* Desktop: icône + texte */}
          <img src="/icon.svg" alt="" className="hidden md:block h-7 w-7" aria-hidden="true" />
          <span className="hidden md:block text-[17px] font-black tracking-tight text-gray-900">
            Citoyen<span className="text-[#FF4D1C]">Facile</span>
          </span>
        </Link>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col px-1.5 md:px-3 py-3 md:py-4 gap-1 overflow-y-auto">
          {(path.startsWith("/dashboard/examen-civique")
            ? buildNavCivique(path.match(/\/dashboard\/examen-civique\/([^/]+)/)?.[1])
            : path.startsWith("/dashboard/entretien") || path.startsWith("/dashboard/apprendre") || path.startsWith("/dashboard/simulation") || path.startsWith("/dashboard/examen") || path.startsWith("/dashboard/statistiques")
            ? NAV_ENTRETIEN
            : NAV_HOME
          ).map((n) => {
            const active = path === n.href || (n.href !== "/dashboard" && path.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                title={n.label}
                className={`flex items-center justify-center md:justify-start gap-3 px-0 md:px-3 py-2.5 rounded-xl transition-all text-[14px] font-medium ${
                  active
                    ? "bg-[#FF4D1C]/10 text-[#FF4D1C] font-semibold"
                    : "text-gray-500 hover:bg-black/[0.04] hover:text-gray-900"
                }`}
              >
                <span
                  className="material-symbols-outlined shrink-0"
                  style={{
                    fontSize: "22px",
                    fontVariationSettings: active
                      ? `'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24`
                      : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                  }}
                >
                  {n.icon}
                </span>
                <span className="hidden md:block">{n.label}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col ml-14 md:ml-56 min-w-0 overflow-x-hidden">

        {/* TOPBAR */}
        <header className="bg-white/80 backdrop-blur-md border-b border-black/[0.06] flex items-center justify-end px-4 md:px-8 py-3 sticky top-0 z-40">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/[0.04] border border-black/[0.07] hover:bg-black/[0.07] transition-colors cursor-pointer"
            >
              <div className="size-7 rounded-full bg-[#FF4D1C] flex items-center justify-center text-white font-bold text-[12px] shrink-0">
                {initial}
              </div>
              <span className="hidden md:block text-gray-700 text-[13px] font-medium max-w-[100px] truncate">{displayName || "Profil"}</span>
              <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "16px" }}>expand_more</span>
            </button>
            {profileOpen && <ProfileDropdown />}
          </div>
        </header>

        <main className="flex-1 pb-6">
          {children}
        </main>
      </div>

    </div>
  );
}
