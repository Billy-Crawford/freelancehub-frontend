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

    if (user?.role === "freelance") {
      fetchApps();
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;

  if (user?.role !== "freelance") {
    return <p>Accès réservé aux freelances</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes candidatures</h1>

      {applications.length === 0 ? (
        <p>Aucune candidature envoyée</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border p-4 rounded shadow-sm flex flex-col gap-2"
            >
              <p><strong>Mission:</strong> {app.mission_title}</p>
              <p><strong>Proposé:</strong> {app.proposed_rate} €</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    app.status === "accepted"
                      ? "text-green-600 font-semibold"
                      : app.status === "rejected"
                      ? "text-red-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {formatStatus(app.status)}
                </span>
              </p>
              <p><strong>Lettre:</strong> {app.cover_letter}</p>

              {/* 🔥 BOUTON CHAT */}
              {app.status === "accepted" && (
                <Link
                  href={`/chat/${app.mission}/${app.client_id}`}
                  className="inline-block mt-2 bg-blue-600 text-white px-3 py-2 rounded text-center hover:bg-blue-700 transition"
                >
                  💬 Ouvrir le chat
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}