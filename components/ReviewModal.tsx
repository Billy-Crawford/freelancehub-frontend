"use client";

import { useState } from "react";
import { createReview } from "@/services/review";

interface Props {
  missionId: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({
  missionId,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createReview(missionId, {
        rating,
        comment,
      });

      setRating(5);
      setComment("");

      onSuccess?.();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erreur review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

        <h2 className="text-lg font-bold mb-2">
          Noter le freelance ⭐
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Donnez une note après cette mission
        </p>

        {/* ⭐ STARS */}
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

        {/* COMMENT */}
        <textarea
          className="w-full border rounded-lg p-2 text-sm mb-4"
          rows={4}
          placeholder="Commentaire (optionnel)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>

        </div>
      </div>
    </div>
  );
}

