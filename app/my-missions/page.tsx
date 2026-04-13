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

export default function MyMissionsPage() {
  const { user } = useAuth();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMissions();

        // 🔥 FILTRAGE BACKEND FRONT
        const myMissions = data.filter(
          (mission) => user && mission.client === user.id
        );

        setMissions(myMissions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMissions();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Non autorisé</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        Mes missions
      </h1>

      {missions.length === 0 ? (
        <p>Aucune mission créée</p>
      ) : (
        <div className="space-y-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="border p-4 rounded shadow-sm bg-blue-50"
            >
              <h2 className="text-lg font-semibold">{mission.title}</h2>
              <p className="text-gray-600">{mission.description}</p>

              <div className="mt-2">
                <p><strong>Budget:</strong> {mission.budget} €</p>
                <p><strong>Deadline:</strong> {mission.deadline}</p>
                <p><strong>Status:</strong> {formatStatus(mission.status)}</p>
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
      )}
    </div>
  );
}

