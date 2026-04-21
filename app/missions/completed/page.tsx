// app/missions/completed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCompletedMissions } from "@/services/mission";
import { useAuth } from "@/hooks/useAuth";

export default function CompletedMissionsPage() {
  const { user } = useAuth();
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Missions terminées
      </h1>

      {missions.length === 0 && (
        <p>Aucune mission terminée</p>
      )}

      <div className="grid gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            className="border p-4 rounded shadow-sm bg-white"
          >
            <h2 className="font-bold">{m.title}</h2>
            <p>{m.description}</p>
            <p className="text-sm text-gray-500">
              Budget: {m.budget}€
            </p>

            <span className="text-green-600 font-semibold">
              ✔ Terminée
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

