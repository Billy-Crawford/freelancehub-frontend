//  app/components/Navbar.tsx
"use client";

import Link from "next/link";
// import { useAuth } from "@/hooks/useAuth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [missionOpen, setMissionOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-300 transition-shadow">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              Accueil
            </Link>

            <Link href="/messages" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              Messages
            </Link>

            <Link href="/payments" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              Paiements
            </Link>

            {/* Dropdown Missions */}
            <div
              className="relative"
              onMouseEnter={() => setMissionOpen(true)}
              onMouseLeave={() => setMissionOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                Missions
                <svg className={`w-4 h-4 transition-transform ${missionOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {missionOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-indigo-50 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link href="/missions" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    Toutes les missions
                  </Link>

                  {user?.role === "client" && (
                    <>
                      <Link href="/my-missions" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                        Mes missions
                      </Link>
                      <Link href="/missions/create" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Créer une mission
                      </Link>
                    </>
                  )}

                  {user?.role === "freelance" && (
                    <Link href="/applications" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                      Mes candidatures
                    </Link>
                  )}

                  <div className="mx-4 my-1 border-t border-gray-100"></div>

                  <Link href="/missions/completed" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Missions terminées
                  </Link>
                </div>
              )}
            </div>

            {/* Auth */}
            {!user ? (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-all">
                  Connexion
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md hover:shadow-indigo-200 transition-all">
                  S'inscrire
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.first_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span>{user.first_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-indigo-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-indigo-50 px-4 py-3 space-y-1">
          {[
            { href: "/", label: "Accueil" },
            { href: "/missions", label: "Toutes les missions" },
            { href: "/messages", label: "Messages" },
            { href: "/payments", label: "Paiements" },
            { href: "/missions/completed", label: "Missions terminées" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              {label}
            </Link>
          ))}

          {user?.role === "client" && (
            <>
              <Link href="/my-missions" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Mes missions</Link>
              <Link href="/missions/create" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Créer une mission</Link>
            </>
          )}

          {user?.role === "freelance" && (
            <Link href="/applications" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Mes candidatures</Link>
          )}

          <div className="pt-2 border-t border-gray-100">
            {!user ? (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors">
                  Connexion
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 transition-colors">
                  S'inscrire
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.first_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  {user.first_name}
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

