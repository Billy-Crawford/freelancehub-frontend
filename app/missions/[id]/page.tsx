// app/missions/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMission, applyMission, getMissionApplications, updateApplicationStatus, deleteMission } from "@/services/mission";
import { initPayment, releasePayment, cancelPayment } from "@/services/payment";
import { createReview } from "@/services/review";
import { useAuth } from "@/hooks/useAuth";

const statusStyle = (status: string) => {
  switch (status) {
    case "open": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in_progress": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "completed": return "bg-gray-50 text-gray-600 border-gray-200";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "open": return "Ouverte";
    case "in_progress": return "En cours";
    case "completed": return "Terminée";
    case "cancelled": return "Annulée";
    default: return status;
  }
};

const appStatusStyle = (status: string) => {
  switch (status) {
    case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isOwner = user && mission && user.id === mission.client;
  const isFreelance = user?.role === "freelance";
  const canReview = mission && mission.status === "completed" && user;

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

  useEffect(() => {
    if (!user || !mission || !isOwner) return;
    const fetchApps = async () => {
      try {
        const data = await getMissionApplications(Number(id));
        setApplications(data);
      } catch (err) { console.error(err); }
    };
    fetchApps();
  }, [id, user, mission, isOwner]);

  const handleDeleteMission = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette mission ?")) return;
    try {
      setLoadingAction(true);
      await deleteMission(Number(id));
      alert("Mission supprimée");
      router.push("/missions");
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleApply = async () => {
    try {
      await applyMission(Number(id), { cover_letter: coverLetter, proposed_rate: Number(proposedRate) });
      alert("Candidature envoyée");
    } catch { alert("Erreur candidature"); }
  };

  const handleAccept = async (appId: number) => {
    await updateApplicationStatus(Number(id), appId, "accepted");
    setMission((prev: any) => ({ ...prev, status: "in_progress" }));
  };

  const handleInit = async () => {
    setLoadingAction(true);
    try { await initPayment(Number(id)); setPaymentStatus("held"); alert("Paiement initié"); }
    finally { setLoadingAction(false); }
  };

  const handleRelease = async () => {
    setLoadingAction(true);
    try {
      await releasePayment(Number(id));
      setPaymentStatus("released");
      setMission((prev: any) => ({ ...prev, status: "completed" }));
      alert("Paiement libéré");
    } finally { setLoadingAction(false); }
  };

  const handleCancel = async () => {
    setLoadingAction(true);
    try { await cancelPayment(Number(id)); setPaymentStatus(null); alert("Paiement annulé"); }
    finally { setLoadingAction(false); }
  };

  const handleReview = async () => {
    try {
      await createReview(Number(id), { rating, comment });
      alert("Avis envoyé");
    } catch (err: any) {
      alert(err.response?.data ? JSON.stringify(err.response.data) : "Erreur review");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  if (!mission) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">❌</div>
        <p className="text-red-700 font-medium">Mission introuvable</p>
      </div>
    </div>
  );

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">{mission.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyle(mission.status)}`}>
                {formatStatus(mission.status)}
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed mb-5">{mission.description}</p>

            {mission.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {mission.skills.map((s: string) => (
                  <span key={s} className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">{s}</span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Budget : <strong className="text-gray-800">{mission.budget} €</strong>
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Deadline : <strong className="text-gray-800">{mission.deadline}</strong>
              </span>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDeleteMission}
              disabled={loadingAction}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          )}
        </div>
      </div>

      {/* Postuler */}
      {isFreelance && mission.status === "open" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">✍️</span>
            Postuler à cette mission
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lettre de motivation</label>
              <textarea
                rows={4}
                className={inputClass}
                placeholder="Décrivez pourquoi vous êtes le bon candidat..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarif proposé (€)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="Ex: 500"
                value={proposedRate}
                onChange={(e) => setProposedRate(e.target.value)}
              />
            </div>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-100 transition-all"
            >
              Envoyer ma candidature
            </button>
          </div>
        </div>
      )}

      {/* Paiement */}
      {isOwner && mission.status === "in_progress" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-sm">💳</span>
            Gestion du paiement
          </h3>
          <div className="flex flex-wrap gap-3">
            {!paymentStatus && (
              <button onClick={handleInit} disabled={loadingAction}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all disabled:opacity-60">
                Initier le paiement
              </button>
            )}
            {paymentStatus === "held" && (
              <>
                <button onClick={handleRelease} disabled={loadingAction}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-100 transition-all disabled:opacity-60">
                  Libérer le paiement
                </button>
                <button onClick={handleCancel} disabled={loadingAction}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-60">
                  Annuler
                </button>
              </>
            )}
            {paymentStatus === "released" && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-600 font-semibold text-sm">✅ Paiement effectué</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Candidatures (owner) */}
      {isOwner && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Candidatures reçues</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{applications.length}</span>
          </div>

          {applications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucune candidature reçue pour le moment</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-100 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                          {app.freelancer_email?.[0]?.toUpperCase() ?? "F"}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{app.freelancer_email}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${appStatusStyle(app.status)}`}>
                          {app.status === "accepted" ? "Acceptée" : app.status === "rejected" ? "Refusée" : "En attente"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 ml-9">{app.cover_letter}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                        {app.proposed_rate} €
                      </span>
                      {app.status === "pending" && (
                        <button
                          onClick={() => handleAccept(app.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm"
                        >
                          Accepter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review */}
      {canReview && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 text-sm">⭐</span>
            Donner un avis
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`w-10 h-10 rounded-xl text-lg transition-all ${
                      r <= rating
                        ? "bg-amber-50 border-2 border-amber-300 shadow-sm"
                        : "bg-gray-50 border border-gray-200 hover:border-amber-200"
                    }`}
                  >
                    ⭐
                  </button>
                ))}
                <span className="ml-2 self-center text-sm text-gray-500">{rating}/5</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Commentaire</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                placeholder="Votre avis sur cette mission..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              onClick={handleReview}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-md shadow-violet-100 transition-all"
            >
              Envoyer mon avis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
