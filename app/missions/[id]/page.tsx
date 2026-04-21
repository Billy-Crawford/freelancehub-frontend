// app/missions/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getMission,
  applyMission,
  getMissionApplications,
  updateApplicationStatus,
} from "@/services/mission";
import {
  initPayment,
  releasePayment,
  cancelPayment,
} from "@/services/payment";
import { useAuth } from "@/hooks/useAuth";

export default function MissionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [mission, setMission] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState<number | string>("");

  const isOwner = user && mission && user.id === mission.client;

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
    if (!user || !mission) return;
    if (!isOwner) return;

    const fetchApps = async () => {
      try {
        const data = await getMissionApplications(Number(id));
        setApplications(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApps();
  }, [id, user, mission]);

  /* ===================== */
  /* 🔹 ACTIONS */
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

  const handleAccept = async (appId: number) => {
    await updateApplicationStatus(Number(id), appId, "accepted");

    setMission((prev: any) => ({
      ...prev,
      status: "in_progress",
    }));
  };

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
  /* 🔹 UI */
  /* ===================== */

  if (loading) return <p>Loading...</p>;
  if (!mission) return <p>Mission introuvable</p>;

  return (
    <div className="p-6 space-y-6">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{mission.title}</h1>
        <p>Status: {mission.status}</p>
      </div>

      {/* ===================== */}
      {/* 🔹 FREELANCE APPLY */}
      {/* ===================== */}
      {user?.role === "freelance" && mission.status === "open" && (
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

      {/* ===================== */}
      {/* 🔹 PAYMENT (CLIENT) */}
      {/* ===================== */}
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

      {/* ===================== */}
      {/* 🔹 APPLICATIONS */}
      {/* ===================== */}
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
    </div>
  );
}

