// app/missions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMissions } from "@/services/mission";
import { Mission } from "@/types/mission";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

// 🔹 format status
const formatStatus = (status: string) => {
  switch (status) {
    case "open":
      return "Ouverte";
    case "in_progress":
      return "En cours";
    case "completed":
      return "Terminée";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
};

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

  if (loading) return <p>Loading...</p>;

  // 🔥 Séparation des missions
  const myMissions = missions.filter(
    (mission) => user && mission.client === user.id
  );

  const otherMissions = missions.filter(
    (mission) => !user || mission.client !== user.id
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Missions</h1>

      {/* 🔹 MES MISSIONS (CLIENT) */}
      {user?.role === "client" && myMissions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Mes missions
          </h2>

          <div className="space-y-4">
            {myMissions.map((mission) => (
              <div
                key={mission.id}
                className="border p-4 rounded shadow-sm bg-blue-50"
              >
                <h3 className="text-lg font-semibold">{mission.title}</h3>
                <p className="text-gray-600">{mission.description}</p>

                <div className="mt-2">
                  <p><strong>Budget:</strong> {mission.budget} €</p>
                  <p><strong>Deadline:</strong> {mission.deadline}</p>
                  <p><strong>Status:</strong> {formatStatus(mission.status)}</p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {mission.skills.length > 0
                      ? mission.skills.join(", ")
                      : "Aucune compétence"}
                  </p>
                </div>

                <Link
                  href={`/missions/${mission.id}`}
                  className="inline-block mt-3 text-blue-600 hover:underline"
                >
                  Gérer →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 AUTRES MISSIONS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {user?.role === "client"
            ? "Autres missions"
            : "Missions disponibles"}
        </h2>

        <div className="space-y-4">
          {otherMissions.map((mission) => (
            <div key={mission.id} className="border p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold">{mission.title}</h3>
              <p className="text-gray-600">{mission.description}</p>

              <div className="mt-2">
                <p><strong>Budget:</strong> {mission.budget} €</p>
                <p><strong>Deadline:</strong> {mission.deadline}</p>
                <p><strong>Status:</strong> {formatStatus(mission.status)}</p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {mission.skills.length > 0
                    ? mission.skills.join(", ")
                    : "Aucune compétence"}
                </p>
              </div>

              <Link
                href={`/missions/${mission.id}`}
                className="inline-block mt-3 text-blue-600 hover:underline"
              >
                Voir détail →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

