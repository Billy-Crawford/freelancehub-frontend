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

  const handleStatusChange = async (applicationId: number, status: "accepted" | "rejected") => {
    try {
      const updated = await updateApplicationStatus(Number(id), applicationId, status);
      setApplications((prev) =>
        prev.map((app) => (app.id === updated.id ? { ...app, status: updated.status } : app))
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!applications.length) return <p>Aucune candidature pour cette mission.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Candidatures</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="border p-4 rounded shadow-sm flex flex-col gap-2">
            <p><strong>Freelance:</strong> {app.freelancer.email}</p>
            <p><strong>Proposition:</strong> {app.proposed_rate} €</p>
            <p><strong>Lettre de motivation:</strong> {app.cover_letter}</p>
            <p><strong>Status:</strong> {app.status}</p>

            {user?.id === app.freelancer.id || app.status !== "open" ? null : (
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={() => handleStatusChange(app.id, "accepted")}
                >
                  Accepter
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded"
                  onClick={() => handleStatusChange(app.id, "rejected")}
                >
                  Refuser
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

