// app/profile/edit/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  updateClientProfile,
  updateFreelanceProfile,
  updateUser,
} from "@/services/user";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  const [form, setForm] = useState<any>({
    first_name: "",
    last_name: "",
    bio: "",
    company: "",
    website: "",
    skills: [],
    hourly_rate: "",
    portfolio_url: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setForm((prev: any) => ({
      ...prev,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    }));

    if (user.role === "client" && user.client_profile) {
      const profile = user.client_profile;

      setForm((prev: any) => ({
        ...prev,
        bio: profile.bio || "",
        company: profile.company || "",
        website: profile.website || "",
      }));

      setAvatarPreview(profile.avatar || null);
    }

    if (user.role === "freelance" && user.freelance_profile) {
      const profile = user.freelance_profile;

      setForm((prev: any) => ({
        ...prev,
        bio: profile.bio || "",
        skills: profile.skills || [],
        hourly_rate: profile.hourly_rate || "",
        portfolio_url: profile.portfolio_url || "",
      }));

      setAvatarPreview(profile.avatar || null);
    }
  }, [user]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!user) return <p className="p-6 text-red-500">Not authenticated</p>;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: any) => {
    setForm((prev: any) => ({
      ...prev,
      skills: e.target.value.split(",").map((s: string) => s.trim()),
    }));
  };

  const handleAvatarChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev: any) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await updateUser({
        first_name: form.first_name,
        last_name: form.last_name,
      });

      let data: any;

      if (form.avatar instanceof File) {
        data = new FormData();

        Object.keys(form).forEach((key) => {
          if (["first_name", "last_name"].includes(key)) return;

          if (key === "skills" && Array.isArray(form[key])) {
            form[key].forEach((skill: string) =>
              data.append("skills", skill)
            );
          } else {
            data.append(key, form[key]);
          }
        });
      } else {
        data = { ...form };
        delete data.first_name;
        delete data.last_name;
      }

      if (user.role === "client") {
        await updateClientProfile(data);
      } else {
        await updateFreelanceProfile(data);
      }

      await refreshUser();
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          Modifier mon profil
        </h1>
        <p className="text-sm text-gray-500">
          Mets à jour tes informations personnelles
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NAMES */}
        <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-700">Prénom</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Nom</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* AVATAR */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <label className="text-sm font-medium text-gray-700">
            Avatar
          </label>

          <div className="flex items-center gap-4 mt-3">
            {avatarPreview && (
              <img
                src={avatarPreview}
                className="w-16 h-16 rounded-full object-cover border"
              />
            )}

            <input type="file" onChange={handleAvatarChange} />
          </div>
        </div>

        {/* BIO */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className={inputClass}
            rows={4}
          />
        </div>

        {/* CLIENT */}
        {user.role === "client" && (
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Infos entreprise</h2>

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Entreprise"
              className={inputClass}
            />

            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Website"
              className={inputClass}
            />
          </div>
        )}

        {/* FREELANCE */}
        {user.role === "freelance" && (
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Infos freelance</h2>

            <input
              value={form.skills.join(", ")}
              onChange={handleSkillsChange}
              placeholder="Skills (ex: React, Node, UI)"
              className={inputClass}
            />

            <input
              type="number"
              name="hourly_rate"
              value={form.hourly_rate}
              onChange={handleChange}
              placeholder="Tarif / heure"
              className={inputClass}
            />

            <input
              name="portfolio_url"
              value={form.portfolio_url}
              onChange={handleChange}
              placeholder="Portfolio"
              className={inputClass}
            />
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

