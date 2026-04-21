// app/payments/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getMyPayments,
  cancelPayment,
  releasePayment,
} from "@/services/payment";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadPayments();
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Gestion des paiements</h1>

      {payments.length === 0 ? (
        <p>Aucun paiement</p>
      ) : (
        payments.map((p) => (
          <div key={p.id} className="border p-4 rounded space-y-2">

            <p><strong>Mission:</strong> {p.mission_title}</p>
            <p><strong>Montant:</strong> {p.amount} €</p>
            <p><strong>Status:</strong> {p.status}</p>

            <div className="flex gap-2">

              {/* 🔴 Annuler */}
              {p.status !== "released" && (
                <button
                  onClick={async () => {
                    await cancelPayment(p.mission_id);
                    loadPayments();
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Annuler
                </button>
              )}

              {/* 🟢 Libérer */}
              {p.status === "held" && (
                <button
                  onClick={async () => {
                    await releasePayment(p.mission_id);
                    loadPayments();
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Valider paiement
                </button>
              )}

            </div>
          </div>
        ))
      )}
    </div>
  );
}
