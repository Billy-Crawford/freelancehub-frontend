// app/missions/[id]/applications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMissionApplications, updateApplicationStatus } from "@/services/mission";
import { useAuth } from "@/hooks/useAuth";

type Application = {
  id: number;
  freelancer: { id: number; email: string };
  cover_letter: string;
  proposed_rate: number;
  status: string;
};

const statusStyle = (status: string) => {
  switch (status) {
    case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "accepted": return "Acceptée";
    case "rejected": return "Refusée";
    case "pending": return "En attente";
    default: return status;
  }
};

export default function MissionApplicationsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMissionApplications(Number(id));
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplications();
  }, [id]);

  const handleStatusChange = async (appId: number, status: "accepted" | "rejected") => {
    try {
      const updated = await updateApplicationStatus(Number(id), appId, status);
      setApplications((prev) =>
        prev.map((app) => app.id === updated.id ? { ...app, status: updated.status } : app)
      );
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{applications.length}</span>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 font-medium">Aucune candidature pour cette mission</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold shadow-sm">
                      {app.freelancer.email?.[0]?.toUpperCase() ?? "F"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{app.freelancer.email}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle(app.status)}`}>
                        {formatStatus(app.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{app.cover_letter}</p>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-indigo-500 font-medium">Tarif proposé</p>
                    <p className="text-lg font-bold text-indigo-700">{app.proposed_rate} €</p>
                  </div>

                  {user?.id !== app.freelancer.id && app.status !== "open" && app.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(app.id, "accepted")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, "rejected")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
                      >
                        Refuser
                      </button>
                    </div>
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

