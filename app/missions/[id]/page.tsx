//  app/missions/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getMission,
  deleteMission,
  applyMission,
  getMissionApplications,
  updateApplicationStatus
} from "@/services/mission";
import { Mission, MissionApplication } from "@/types/mission";
import { useAuth } from "@/hooks/useAuth";

const formatStatus = (status: string) => {
  switch (status) {
    case "open": return "Ouverte";
    case "in_progress": return "En cours";
    case "completed": return "Terminée";
    case "cancelled": return "Annulée";
    case "accepted": return "Acceptée";
    case "rejected": return "Refusée";
    default: return status;
  }
};

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState<number | string>("");
  const [applying, setApplying] = useState(false);

  const [applications, setApplications] = useState<MissionApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // 🔹 Fetch mission
  useEffect(() => {
    const fetchMission = async () => {
      try {
        if (!id) return;
        const data = await getMission(Number(id));
        setMission(data);
        setProposedRate(data.budget);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  // 🔹 Fetch candidatures
  useEffect(() => {
    const fetchApplications = async () => {
      if (!id || user?.role !== "client") return;

      setLoadingApps(true);
      try {
        const apps = await getMissionApplications(Number(id));
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApplications();
  }, [id, user]);

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
      setProposedRate(mission?.budget || 0);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la candidature");
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateApplication = async (
    appId: number,
    status: "accepted" | "rejected"
  ) => {
    try {
      const updated = await updateApplicationStatus(Number(id), appId, status);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: updated.status } : app
        )
      );

      // 🔥 Si accepté → fermer la mission
      if (status === "accepted" && mission) {
        setMission({ ...mission, status: "in_progress" });
      }

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!mission) return <p>Mission introuvable</p>;

  const isOwner = user?.id === mission.client;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* 🔹 Infos mission */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{mission.title}</h1>
        <p className="text-gray-600 mb-4">{mission.description}</p>

        <div className="space-y-1">
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
      </div>

      {/* 🔹 Freelance → postuler */}
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
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {applying ? "Envoi..." : "Postuler"}
          </button>
        </div>
      )}

      {/* 🔹 Actions client */}
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

      {/* 🔹 Candidatures */}
      {isOwner && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Candidatures</h2>

          {loadingApps ? (
            <p>Chargement...</p>
          ) : applications.length === 0 ? (
            <p>Aucune candidature</p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border p-3 rounded space-y-1">

                  <p><strong>Freelance:</strong> {app.freelancer_email}</p>
                  <p><strong>Lettre:</strong> {app.cover_letter}</p>
                  <p><strong>Proposé:</strong> {app.proposed_rate} €</p>
                  <p><strong>Status:</strong> {formatStatus(app.status)}</p>

                  <div className="flex gap-2 mt-2">

                    {/* 🔹 Actions */}
                    {app.status === "pending" && mission.status === "open" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateApplication(app.id, "accepted")
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Accepter
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateApplication(app.id, "rejected")
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Refuser
                        </button>
                      </>
                    )}

                    {/* 🔥 CHAT
                    {app.status === "accepted" && (
                      <button
                        onClick={() =>
                          router.push(`/chat/${mission.id}/${app.freelancer}`)
                        }
                        className="bg-purple-600 text-white px-3 py-1 rounded"
                      >
                        Ouvrir chat
                      </button>
                    )} */}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
