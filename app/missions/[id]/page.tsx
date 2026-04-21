// app/missions/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getMission,
  applyMission,
  getMissionApplications,
  updateApplicationStatus,
  deleteMission,
} from "@/services/mission";
import {
  initPayment,
  releasePayment,
  cancelPayment,
} from "@/services/payment";
import { createReview } from "@/services/review";
import { useAuth } from "@/hooks/useAuth";

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  /* ===================== */
  /* 🔹 STATE */
  /* ===================== */
  const [mission, setMission] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState<number | string>("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  /* ===================== */
  /* 🔹 DERIVED STATE */
  /* ===================== */
  const isOwner = user && mission && user.id === mission.client;
  const isFreelance = user?.role === "freelance";

  const canReview =
    mission &&
    mission.status === "completed" &&
    user; // utilisateur connecté uniquement

  /* ===================== */
  /* 🔹 LOAD MISSION */
  /* ===================== */
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMission(Number(id));
        setMission(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  /* ===================== */
  /* 🔹 LOAD APPLICATIONS */
  /* ===================== */
  useEffect(() => {
    if (!user || !mission || !isOwner) return;

    const fetchApps = async () => {
      try {
        const data = await getMissionApplications(Number(id));
        setApplications(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApps();
  }, [id, user, mission, isOwner]);

  /* ===================== */
  /* 🔥 DELETE MISSION */
  /* ===================== */
  const handleDeleteMission = async () => {
    const confirmDelete = confirm(
      "⚠️ Voulez-vous vraiment supprimer cette mission ?"
    );

    if (!confirmDelete) return;

    try {
      setLoadingAction(true);
      await deleteMission(Number(id));
      alert("Mission supprimée");
      router.push("/missions");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    } finally {
      setLoadingAction(false);
    }
  };

  /* ===================== */
  /* 🔹 APPLY */
  /* ===================== */
  const handleApply = async () => {
    try {
      await applyMission(Number(id), {
        cover_letter: coverLetter,
        proposed_rate: Number(proposedRate),
      });

      alert("Candidature envoyée");
    } catch {
      alert("Erreur candidature");
    }
  };

  /* ===================== */
  /* 🔹 ACCEPT */
  /* ===================== */
  const handleAccept = async (appId: number) => {
    await updateApplicationStatus(Number(id), appId, "accepted");

    setMission((prev: any) => ({
      ...prev,
      status: "in_progress",
    }));
  };

  /* ===================== */
  /* 🔹 PAYMENT */
  /* ===================== */
  const handleInit = async () => {
    setLoadingAction(true);
    try {
      await initPayment(Number(id));
      setPaymentStatus("held");
      alert("Paiement initié");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRelease = async () => {
    setLoadingAction(true);
    try {
      await releasePayment(Number(id));
      setPaymentStatus("released");

      setMission((prev: any) => ({
        ...prev,
        status: "completed",
      }));

      alert("Paiement libéré");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancel = async () => {
    setLoadingAction(true);
    try {
      await cancelPayment(Number(id));
      setPaymentStatus(null);
      alert("Paiement annulé");
    } finally {
      setLoadingAction(false);
    }
  };

  /* ===================== */
  /* 🔹 REVIEW */
  /* ===================== */
  const handleReview = async () => {
    try {
      await createReview(Number(id), {
        rating,
        comment,
      });

      alert("Avis envoyé");
    } catch (err: any) {
      if (err.response?.data) {
        alert(JSON.stringify(err.response.data));
      } else {
        alert("Erreur review");
      }
    }
  };

  /* ===================== */
  /* 🔹 UI */
  /* ===================== */

  if (loading) return <p>Loading...</p>;
  if (!mission) return <p>Mission introuvable</p>;

  return (
    <div className="p-6 space-y-6">

      {/* 🔹 HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{mission.title}</h1>
          <p>Status: {mission.status}</p>
        </div>

        {isOwner && (
          <button
            onClick={handleDeleteMission}
            disabled={loadingAction}
            className="bg-black text-white px-4 py-2 hover:bg-red-600"
          >
            Supprimer
          </button>
        )}
      </div>

      {/* 🔹 APPLY */}
      {isFreelance && mission.status === "open" && (
        <div className="border p-4 space-y-3">
          <h3 className="font-bold">Postuler</h3>

          <textarea
            className="w-full border p-2"
            placeholder="Lettre de motivation"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <input
            type="number"
            className="w-full border p-2"
            placeholder="Tarif"
            value={proposedRate}
            onChange={(e) => setProposedRate(e.target.value)}
          />

          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2"
          >
            Postuler
          </button>
        </div>
      )}

      {/* 🔹 PAYMENT */}
      {isOwner && mission.status === "in_progress" && (
        <div className="flex gap-3">
          {!paymentStatus && (
            <button
              onClick={handleInit}
              className="bg-yellow-500 text-white px-4 py-2"
            >
              Initier paiement
            </button>
          )}

          {paymentStatus === "held" && (
            <>
              <button
                onClick={handleRelease}
                className="bg-green-600 text-white px-4 py-2"
              >
                Libérer
              </button>

              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2"
              >
                Annuler
              </button>
            </>
          )}

          {paymentStatus === "released" && <p>✅ Payé</p>}
        </div>
      )}

      {/* 🔹 APPLICATIONS */}
      {isOwner && (
        <div>
          <h2 className="text-xl font-bold">Candidatures</h2>

          {applications.map((app) => (
            <div key={app.id} className="border p-3">
              <p>{app.freelancer_email}</p>

              {app.status === "pending" && (
                <button
                  onClick={() => handleAccept(app.id)}
                  className="bg-green-600 text-white px-3 py-1"
                >
                  Accepter
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 🔹 REVIEW */}
      {canReview && (
        <div className="border p-4 space-y-3">
          <h2 className="text-xl font-bold">Donner une note</h2>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>

          <textarea
            className="w-full border p-2"
            placeholder="Commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleReview}
            className="bg-purple-600 text-white px-4 py-2"
          >
            Envoyer avis
          </button>
        </div>
      )}
    </div>
  );
}

