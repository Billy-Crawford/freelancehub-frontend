// app/missions/completed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCompletedMissions } from "@/services/mission";

export default function CompletedMissionsPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCompletedMissions();
        setMissions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Missions terminées</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            {missions.length}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Historique de toutes les missions complétées</p>
      </div>

      {missions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">🏁</div>
          <p className="text-gray-500 font-medium">Aucune mission terminée</p>
          <p className="text-sm text-gray-400 mt-1">Les missions complétées apparaîtront ici</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {missions.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-base font-semibold text-gray-900">{m.title}</h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Terminée
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{m.description}</p>
                </div>

                <div className="shrink-0 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-emerald-600 font-medium">Budget</p>
                  <p className="text-lg font-bold text-emerald-700">{m.budget} €</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


