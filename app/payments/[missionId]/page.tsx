// app/payments/[missionId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { initPayment } from "@/services/payment";

export default function PaymentPage() {
  const { missionId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!missionId) return;
    setLoading(true);
    try {
      await initPayment(Number(missionId));
      alert("Paiement initié ✅");
      router.push("/payments");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Erreur paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Initier le paiement</h1>
        <p className="text-sm text-gray-500 mt-1">Mission #{missionId}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

        {/* Illustration */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Paiement sécurisé</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Le montant sera bloqué en escrow et ne sera libéré au freelance
            qu&apos;une fois la mission validée par vos soins.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-indigo-700">
              <p className="font-medium mb-0.5">Comment ça fonctionne</p>
              <p className="text-indigo-600">Votre paiement est sécurisé. Vous pourrez le libérer ou l&apos;annuler depuis la page paiements.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
          >
            Retour
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Traitement...
              </span>
            ) : "Initier le paiement"}
          </button>
        </div>
      </div>
    </div>
  );
}


