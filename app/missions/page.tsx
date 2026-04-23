// app/missions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMissions } from "@/services/mission";
import { Mission } from "@/types/mission";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const formatStatus = (status: string) => {
  switch (status) {
    case "open": return "Ouverte";
    case "in_progress": return "En cours";
    case "completed": return "Terminée";
    case "cancelled": return "Annulée";
    default: return status;
  }
};

const statusStyle = (status: string) => {
  switch (status) {
    case "open": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in_progress": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "completed": return "bg-gray-50 text-gray-600 border-gray-200";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

function MissionCard({ mission, isOwner }: { mission: Mission; isOwner: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{mission.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle(mission.status)}`}>
              {formatStatus(mission.status)}
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{mission.description}</p>

          {mission.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {mission.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {mission.budget} €
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {mission.deadline}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href={`/missions/${mission.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all"
          >
            {isOwner ? "Gérer" : "Voir détail"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MissionsPage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMissions();
        setMissions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  const filteredMissions = missions.filter((m) => m.status !== "completed");
  const myMissions = filteredMissions.filter((m) => user && m.client === user.id);
  const otherMissions = filteredMissions.filter((m) => !user || m.client !== user.id);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredMissions.length} mission{filteredMissions.length !== 1 ? "s" : ""} disponible{filteredMissions.length !== 1 ? "s" : ""}</p>
        </div>
        {user?.role === "client" && (
          <Link
            href="/missions/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-100 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle mission
          </Link>
        )}
      </div>

      {/* Mes missions (client) */}
      {user?.role === "client" && myMissions.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mes missions</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{myMissions.length}</span>
          </div>
          <div className="space-y-4">
            {myMissions.map((m) => <MissionCard key={m.id} mission={m} isOwner={true} />)}
          </div>
        </div>
      )}

      {/* Autres missions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {user?.role === "client" ? "Autres missions" : "Missions disponibles"}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{otherMissions.length}</span>
        </div>

        {otherMissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-medium">Aucune mission disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {otherMissions.map((m) => <MissionCard key={m.id} mission={m} isOwner={false} />)}
          </div>
        )}
      </div>
    </div>
  );
}

