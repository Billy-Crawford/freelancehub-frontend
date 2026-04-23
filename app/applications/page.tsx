//  app/applications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyApplications } from "@/services/mission";
import { MyApplication } from "@/types/mission";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const formatStatus = (status: string) => {
  switch (status) {
    case "pending": return "En attente";
    case "accepted": return "Acceptée";
    case "rejected": return "Refusée";
    default: return status;
  }
};

const statusStyle = (status: string) => {
  switch (status) {
    case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const statusDot = (status: string) => {
  switch (status) {
    case "accepted": return "bg-emerald-500";
    case "rejected": return "bg-red-500";
    default: return "bg-amber-500";
  }
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "freelance") fetchApps();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  if (user?.role !== "freelance") return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-sm">
        <div className="text-4xl mb-3">🔒</div>
        <p className="text-red-700 font-medium">Accès réservé aux freelances</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>
          <p className="text-sm text-gray-500 mt-1">
            {applications.length} candidature{applications.length !== 1 ? "s" : ""} envoyée{applications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          {["accepted", "pending", "rejected"].map((s) => (
            <div key={s} className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full ${statusDot(s)}`}></span>
              {formatStatus(s)}
            </div>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 font-medium">Aucune candidature envoyée</p>
          <p className="text-sm text-gray-400 mt-1">Parcourez les missions disponibles pour postuler</p>
          <Link href="/missions" className="inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all">
            Voir les missions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-base font-semibold text-gray-900">{app.mission_title}</h2>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle(app.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(app.status)}`}></span>
                      {formatStatus(app.status)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{app.cover_letter}</p>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-indigo-500 font-medium">Taux proposé</p>
                    <p className="text-lg font-bold text-indigo-700">{app.proposed_rate} €</p>
                  </div>

                  {app.status === "accepted" && (
                    <Link
                      href={`/chat/${app.mission}/${app.client_id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all shadow-md shadow-indigo-100"
                    >
                      💬 Ouvrir le chat
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

