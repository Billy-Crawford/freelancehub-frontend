//  app/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4">

      {/* ================= HERO ================= */}
      <div className="text-center max-w-3xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-100">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Plateforme freelance moderne
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Construisez, collaborez et gagnez avec{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
            FreelanceHub
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Une plateforme professionnelle pour connecter clients et freelances,
          gérer vos missions et sécuriser vos paiements.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">

          <Link
            href="/missions"
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all text-center"
          >
            Explorer les missions
          </Link>

          {!user ? (
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              Créer un compte
            </Link>
          ) : (
            <Link
              href="/profile"
              className="px-8 py-3.5 rounded-xl font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              Mon tableau de bord
            </Link>
          )}

        </div>
      </div>

      {/* ================= STATS DASHBOARD ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">

        <div className="bg-white rounded-2xl p-6 border border-indigo-50 shadow-sm hover:shadow-md transition-all">
          <div className="text-sm text-gray-500 mb-2">📊 Missions actives</div>
          <div className="text-3xl font-bold text-gray-900">+120</div>
          <p className="text-xs text-gray-400 mt-1">Disponibles actuellement</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-indigo-50 shadow-sm hover:shadow-md transition-all">
          <div className="text-sm text-gray-500 mb-2">👨‍💻 Freelances</div>
          <div className="text-3xl font-bold text-gray-900">+540</div>
          <p className="text-xs text-gray-400 mt-1">Actifs sur la plateforme</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-indigo-50 shadow-sm hover:shadow-md transition-all">
          <div className="text-sm text-gray-500 mb-2">💳 Paiements sécurisés</div>
          <div className="text-3xl font-bold text-gray-900">100%</div>
          <p className="text-xs text-gray-400 mt-1">Transactions protégées</p>
        </div>

      </div>

      {/* ================= ROLE SECTION ================= */}
      {user && (
        <div className="mt-16 w-full max-w-5xl">

          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bienvenue 👋 {user.first_name}
            </h2>

            <p className="text-gray-600 mb-4">
              Vous êtes connecté en tant que{" "}
              <span className="font-semibold text-indigo-600">
                {user.role}
              </span>
            </p>

            <div className="flex flex-wrap gap-3">

              {user.role === "client" && (
                <>
                  <Link href="/missions/create" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                    Créer une mission
                  </Link>
                  <Link href="/my-missions" className="px-4 py-2 bg-white border rounded-lg text-sm">
                    Mes missions
                  </Link>
                </>
              )}

              {user.role === "freelance" && (
                <>
                  <Link href="/missions" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                    Trouver des missions
                  </Link>
                  <Link href="/applications" className="px-4 py-2 bg-white border rounded-lg text-sm">
                    Mes candidatures
                  </Link>
                </>
              )}

              <Link href="/profile" className="px-4 py-2 bg-white border rounded-lg text-sm">
                Mon profil
              </Link>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

