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

/* =========================
   STATUS UI HELPERS
========================= */

const statusStyle = (status: string) => {
  switch (status) {
    case "open":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in_progress":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "completed":
      return "bg-gray-50 text-gray-600 border-gray-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

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

const appStatusStyle = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [mission, setMission] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState<number | string>("");

  /* =========================
     REVIEW STATE
  ========================= */
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const isOwner = user && mission && user.id === mission.client;
  const isFreelance = user?.role === "freelance";

  /* ✅ STRICT RULE : only client can review after completion */
  const canReview =
    user &&
    mission &&
    mission.status === "completed" &&
    user.id === mission.client;

  /* =========================
     FETCH MISSION
  ========================= */
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

  /* =========================
     FETCH APPLICATIONS
  ========================= */
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

  /* =========================
     DELETE MISSION
  ========================= */
  const handleDeleteMission = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette mission ?")) return;

    try {
      setLoadingAction(true);
      await deleteMission(Number(id));
      router.push("/missions");
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setLoadingAction(false);
    }
  };

  /* =========================
     APPLY
  ========================= */
  const handleApply = async () => {
    try {
      await applyMission(Number(id), {
        cover_letter: coverLetter,
        proposed_rate: Number(proposedRate),
      });

      setCoverLetter("");
      setProposedRate("");
      alert("Candidature envoyée");
    } catch {
      alert("Erreur candidature");
    }
  };

  /* =========================
     REVIEW CLIENT → FREELANCE
  ========================= */
  const handleReview = async () => {
    if (reviewLoading) return;

    try {
      setReviewLoading(true);

      await createReview(Number(id), {
        rating,
        comment,
      });

      alert("Avis envoyé avec succès");

      setRating(5);
      setComment("");
    } catch (err: any) {
      alert(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Erreur review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  /* =========================
     LOADING / EMPTY STATES
  ========================= */
  if (loading) return <div className="p-10">Chargement...</div>;
  if (!mission) return <div className="p-10">Mission introuvable</div>;

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl border">
        <h1 className="text-2xl font-bold">{mission.title}</h1>

        <span className={`inline-block mt-2 px-3 py-1 text-sm border rounded-full ${statusStyle(mission.status)}`}>
          {formatStatus(mission.status)}
        </span>

        <p className="mt-4 text-gray-600">{mission.description}</p>
      </div>

      {/* =========================
         REVIEW SECTION (ONLY WHEN COMPLETED)
      ========================= */}
      {canReview && (
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-bold mb-4">
            ⭐ Noter le freelance
          </h2>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`text-2xl ${
                  n <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre commentaire..."
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={handleReview}
            disabled={reviewLoading}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            {reviewLoading ? "Envoi..." : "Envoyer l'avis"}
          </button>
        </div>
      )}

    </div>
  );
}