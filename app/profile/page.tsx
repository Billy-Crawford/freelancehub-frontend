// app/profile/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getUserReviews } from "@/services/review";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  /* ===================== */
  /* 🔹 LOAD REVIEWS */
  /* ===================== */
  useEffect(() => {
    if (!user) return;

    // uniquement freelance
    if (user.role !== "freelance") {
      setLoadingReviews(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const data = await getUserReviews(user.id);
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not authenticated</p>;

  /* ===================== */
  /* 🔹 MOYENNE */
  /* ===================== */
  const average =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* ===================== */}
      {/* 🔹 HEADER */}
      {/* ===================== */}
      <div className="flex items-center gap-4">
        {user.role === "client" && user.client_profile?.avatar && (
          <img
            src={user.client_profile.avatar}
            alt="Avatar Client"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}

        {user.role === "freelance" && user.freelance_profile?.avatar && (
          <img
            src={user.freelance_profile.avatar}
            alt="Avatar Freelance"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}

        <div>
          <h1 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-gray-500">Rôle : {user.role}</p>
        </div>
      </div>

      {/* ===================== */}
      {/* 🔹 INFOS */}
      {/* ===================== */}
      <div>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* ===================== */}
      {/* 🔹 CLIENT */}
      {/* ===================== */}
      {user.role === "client" && user.client_profile && (
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Profil Client</h2>
          <p><strong>Entreprise:</strong> {user.client_profile.company}</p>
          <p><strong>Bio:</strong> {user.client_profile.bio}</p>
          <p><strong>Website:</strong> {user.client_profile.website}</p>
        </div>
      )}

      {/* ===================== */}
      {/* 🔹 FREELANCE */}
      {/* ===================== */}
      {user.role === "freelance" && user.freelance_profile && (
        <div className="p-4 border rounded space-y-2">
          <h2 className="font-semibold">Profil Freelance</h2>

          <p><strong>Bio:</strong> {user.freelance_profile.bio}</p>
          <p><strong>Skills:</strong> {user.freelance_profile.skills.join(", ")}</p>
          <p><strong>Tarif:</strong> {user.freelance_profile.hourly_rate} €/h</p>

          <p>
            <strong>Portfolio:</strong>
            <a
              href={user.freelance_profile.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Voir
            </a>
          </p>
        </div>
      )}

      {/* ===================== */}
      {/* ⭐ REVIEWS FREELANCE */}
      {/* ===================== */}
      {user.role === "freelance" && (
        <div className="p-4 border rounded space-y-4">
          <h2 className="text-xl font-bold">Avis clients</h2>

          {loadingReviews ? (
            <p>Chargement...</p>
          ) : (
            <>
              {/* moyenne */}
              <div>
                {average ? (
                  <p className="text-2xl font-semibold">
                    {average} ⭐ ({reviews.length} avis)
                  </p>
                ) : (
                  <p>Aucun avis pour le moment</p>
                )}
              </div>

              {/* liste */}
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="border p-3 rounded">
                    <p className="font-bold">{review.rating} ⭐</p>

                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}

                    {review.reviewer_email && (
                      <p className="text-sm text-gray-500">
                        Par: {review.reviewer_email}
                      </p>
                    )}

                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* 🔹 EDIT */}
      {/* ===================== */}
      <Link
        href="/profile/edit"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Modifier mon profil
      </Link>
    </div>
  );
}

