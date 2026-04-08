"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not authenticated</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar */}
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

      {/* Infos générales */}
      <div className="mb-6">
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Client */}
      {user.role === "client" && user.client_profile && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="font-semibold mb-2">Profil Client</h2>
          <p><strong>Entreprise:</strong> {user.client_profile.company}</p>
          <p><strong>Bio:</strong> {user.client_profile.bio}</p>
          <p><strong>Website:</strong> {user.client_profile.website}</p>
        </div>
      )}

      {/* Freelance */}
      {user.role === "freelance" && user.freelance_profile && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="font-semibold mb-2">Profil Freelance</h2>
          <p><strong>Bio:</strong> {user.freelance_profile.bio}</p>
          <p><strong>Skills:</strong> {user.freelance_profile.skills.join(", ")}</p>
          <p><strong>Tarif:</strong> {user.freelance_profile.hourly_rate} €/h</p>
          <p><strong>Portfolio:</strong> 
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

      {/* Bouton modifier */}
      <Link
        href="/profile/edit"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Modifier mon profil
      </Link>
    </div>
  );
}

