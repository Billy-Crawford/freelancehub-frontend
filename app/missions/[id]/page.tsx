//  app/missions/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMission, deleteMission, applyMission } from "@/services/mission";
import { Mission } from "@/types/mission";
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

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Pour candidature freelance
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState<number | string>("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        if (!id) return;
        const data = await getMission(Number(id));
        setMission(data);
        setProposedRate(data.budget); // valeur par défaut
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Supprimer cette mission ?")) return;
    try {
      await deleteMission(Number(id));
      router.push("/missions");
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    }
  };

  const handleApply = async () => {
    if (!coverLetter || !proposedRate) {
      alert("Veuillez compléter tous les champs");
      return;
    }
    setApplying(true);
    try {
      await applyMission(Number(id), {
        cover_letter: coverLetter,
        proposed_rate: Number(proposedRate),
      });
      alert("Candidature envoyée !");
      setCoverLetter("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la candidature");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!mission) return <p>Mission introuvable</p>;

  const isOwner = user?.id === mission.client;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{mission.title}</h1>
      <p className="text-gray-600 mb-4">{mission.description}</p>

      <div className="space-y-2">
        <p><strong>Budget:</strong> {mission.budget} €</p>
        <p><strong>Deadline:</strong> {mission.deadline}</p>
        <p><strong>Status:</strong> {formatStatus(mission.status)}</p>
        <p>
          <strong>Skills:</strong>{" "}
          {mission.skills.length > 0 ? mission.skills.join(", ") : "Aucune compétence"}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-col gap-4">

        {/* 🔹 Freelance : postuler */}
        {user?.role === "freelance" && mission.status === "open" && (
          <div className="p-4 border rounded space-y-2">
            <h2 className="font-semibold">Postuler à cette mission</h2>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Votre lettre de motivation"
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleApply}
              disabled={applying}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
              {applying ? "Envoi..." : "Postuler"}
            </button>
          </div>
        )}

        {/* 🔹 Client propriétaire */}
        {isOwner && (
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/missions/edit/${mission.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
