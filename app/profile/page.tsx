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

  useEffect(() => {
    if (!user) return;

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

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!user) return <p className="p-6 text-red-500">Not authenticated</p>;

  const average =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-5">
        {user.role === "client" && user.client_profile?.avatar && (
          <img
            src={user.client_profile.avatar}
            className="w-20 h-20 rounded-full object-cover border"
          />
        )}

        {user.role === "freelance" && user.freelance_profile?.avatar && (
          <img
            src={user.freelance_profile.avatar}
            className="w-20 h-20 rounded-full object-cover border"
          />
        )}

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-900">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-sm text-gray-500">
            {user.email}
          </p>

          <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {user.role}
          </span>
        </div>
      </div>

      {/* ================= CLIENT ================= */}
      {user.role === "client" && user.client_profile && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-2">
          <h2 className="font-semibold text-gray-900">Profil Client</h2>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Entreprise:</span>{" "}
            {user.client_profile.company}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Bio:</span>{" "}
            {user.client_profile.bio}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Website:</span>{" "}
            {user.client_profile.website}
          </p>
        </div>
      )}

      {/* ================= FREELANCE ================= */}
      {user.role === "freelance" && user.freelance_profile && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900">Profil Freelance</h2>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Bio:</span> {user.freelance_profile.bio}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Skills:</span>{" "}
            {user.freelance_profile.skills.join(", ")}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Tarif:</span>{" "}
            {user.freelance_profile.hourly_rate} €/h
          </p>

          <a
            href={user.freelance_profile.portfolio_url}
            target="_blank"
            className="text-indigo-600 text-sm hover:underline"
          >
            Voir portfolio →
          </a>
        </div>
      )}

      {/* ================= REVIEWS ================= */}
      {user.role === "freelance" && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Avis clients</h2>

            {average && (
              <span className="text-sm font-medium bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border">
                ⭐ {average} / 5
              </span>
            )}
          </div>

          {loadingReviews ? (
            <p className="text-gray-500 text-sm">Chargement...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun avis pour le moment</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-yellow-600">
                      ⭐ {review.rating}/5
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-2">
                      {review.comment}
                    </p>
                  )}

                  {review.reviewer_email && (
                    <p className="text-xs text-gray-500 mt-2">
                      Par {review.reviewer_email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= EDIT ================= */}
      <div className="flex justify-end">
        <Link
          href="/profile/edit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm transition"
        >
          Modifier mon profil
        </Link>
      </div>
    </div>
  );
}