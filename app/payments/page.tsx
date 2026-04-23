// app/payments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyPayments, cancelPayment, releasePayment } from "@/services/payment";

const statusStyle = (status: string) => {
  switch (status) {
    case "released": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "held": return "bg-amber-50 text-amber-700 border-amber-200";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "released": return "Libéré";
    case "held": return "En attente";
    case "cancelled": return "Annulé";
    default: return status;
  }
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const loadPayments = async () => {
    try {
      const data = await getMyPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPayments(); }, []);

  const handleCancel = async (missionId: number) => {
    setActionId(missionId);
    try {
      await cancelPayment(missionId);
      await loadPayments();
    } finally {
      setActionId(null);
    }
  };

  const handleRelease = async (missionId: number) => {
    setActionId(missionId);
    try {
      await releasePayment(missionId);
      await loadPayments();
    } finally {
      setActionId(null);
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

  const totalHeld = payments.filter(p => p.status === "held").reduce((acc, p) => acc + Number(p.amount), 0);
  const totalReleased = payments.filter(p => p.status === "released").reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des paiements</h1>
        <p className="text-sm text-gray-500 mt-1">{payments.length} paiement{payments.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Stats */}
      {payments.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-amber-100 p-5">
            <p className="text-xs font-medium text-amber-600 mb-1">En attente</p>
            <p className="text-2xl font-bold text-amber-700">{totalHeld.toFixed(2)} €</p>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5">
            <p className="text-xs font-medium text-emerald-600 mb-1">Libéré</p>
            <p className="text-2xl font-bold text-emerald-700">{totalReleased.toFixed(2)} €</p>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">💳</div>
          <p className="text-gray-500 font-medium">Aucun paiement</p>
          <p className="text-sm text-gray-400 mt-1">Les paiements apparaîtront ici une fois initiés</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h2 className="text-base font-semibold text-gray-900">{p.mission_title}</h2>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle(p.status)}`}>
                      {formatStatus(p.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Mission #{p.mission_id}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">Montant</p>
                    <p className="text-xl font-bold text-gray-900">{Number(p.amount).toFixed(2)} €</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {p.status === "held" && (
                      <button
                        onClick={() => handleRelease(p.mission_id)}
                        disabled={actionId === p.mission_id}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-sm transition-all disabled:opacity-60"
                      >
                        {actionId === p.mission_id ? "..." : "Valider"}
                      </button>
                    )}
                    {p.status !== "released" && (
                      <button
                        onClick={() => handleCancel(p.mission_id)}
                        disabled={actionId === p.mission_id}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all disabled:opacity-60"
                      >
                        {actionId === p.mission_id ? "..." : "Annuler"}
                      </button>
                    )}
                    {p.status === "released" && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Payé
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

