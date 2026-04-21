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
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Initier le paiement</h1>

      <p>Le paiement sera bloqué jusqu'à validation.</p>

      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Traitement..." : "Initier paiement"}
      </button>
    </div>
  );
}

