//  app/profile/edit/page.tsx
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

  /* ===================== */
  /* 🔹 INIT DATA */
  /* ===================== */
  useEffect(() => {
    if (!user) return;

    // 🔹 Infos générales
    setForm((prev: any) => ({
      ...prev,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    }));

    // 🔹 CLIENT
    if (user.role === "client" && user.client_profile) {
      const profile = user.client_profile;

      setForm((prev: any) => ({
        ...prev,
        bio: profile.bio || "",
        company: profile.company || "",
        website: profile.website || "",
        avatar: null,
      }));

      setAvatarPreview(profile.avatar || null);
    }

    // 🔹 FREELANCE
    if (user.role === "freelance" && user.freelance_profile) {
      const profile = user.freelance_profile;

      setForm((prev: any) => ({
        ...prev,
        bio: profile.bio || "",
        skills: profile.skills || [],
        hourly_rate: profile.hourly_rate || "",
        portfolio_url: profile.portfolio_url || "",
        avatar: null,
      }));

      setAvatarPreview(profile.avatar || null);
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not authenticated</p>;

  /* ===================== */
  /* 🔹 HANDLERS */
  /* ===================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: any) => ({
      ...prev,
      skills: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev: any) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  /* ===================== */
  /* 🔥 SUBMIT */
  /* ===================== */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 🔥 1. UPDATE USER
      await updateUser({
        first_name: form.first_name,
        last_name: form.last_name,
      });

      // 🔥 2. PREPARE PROFILE DATA
      let data: any;

      if (form.avatar instanceof File) {
        data = new FormData();

        Object.keys(form).forEach((key) => {
          if (["first_name", "last_name"].includes(key)) return;

          if (key === "skills" && Array.isArray(form[key])) {
            form[key].forEach((skill: string) => data.append("skills", skill));
          } else {
            data.append(key, form[key]);
          }
        });
      } else {
        data = { ...form };
        delete data.first_name;
        delete data.last_name;
      }

      // 🔥 3. UPDATE PROFILE
      if (user.role === "client") {
        await updateClientProfile(data);
      } else {
        await updateFreelanceProfile(data);
      }

      // 🔥 4. REFRESH
      await refreshUser();
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  /* ===================== */
  /* 🔹 UI */
  /* ===================== */

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier mon profil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🔥 NOM / PRENOM */}
        <div>
          <label className="block font-semibold mb-1">Prénom</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Nom</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        {/* AVATAR */}
        <div>
          <label className="block font-semibold mb-1">Avatar</label>
          {avatarPreview && (
            <img src={avatarPreview} className="w-24 h-24 rounded-full mb-2" />
          )}
          <input type="file" onChange={handleAvatarChange} />
        </div>

        {/* BIO */}
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* CLIENT */}
        {user.role === "client" && (
          <>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border p-2"
              placeholder="Entreprise"
            />

            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className="w-full border p-2"
              placeholder="Website"
            />
          </>
        )}

        {/* FREELANCE */}
        {user.role === "freelance" && (
          <>
            <input
              value={form.skills.join(", ")}
              onChange={handleSkillsChange}
              className="w-full border p-2"
              placeholder="Skills"
            />

            <input
              type="number"
              name="hourly_rate"
              value={form.hourly_rate}
              onChange={handleChange}
              className="w-full border p-2"
              placeholder="Tarif"
            />

            <input
              name="portfolio_url"
              value={form.portfolio_url}
              onChange={handleChange}
              className="w-full border p-2"
              placeholder="Portfolio"
            />
          </>
        )}

        <button className="bg-blue-600 text-white px-4 py-2">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
