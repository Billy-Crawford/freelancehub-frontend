//  app/profile/edit/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { updateClientProfile, updateFreelanceProfile } from "@/services/user";
import { User } from "@/types/user";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  const [form, setForm] = useState<any>({
    bio: "",
    company: "",
    website: "",
    skills: [],
    hourly_rate: "",
    portfolio_url: "",
    avatar: null, // ajouté pour l'avatar
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "client" && user.client_profile) {
        setForm({
          bio: user.client_profile.bio || "",
          company: user.client_profile.company || "",
          website: user.client_profile.website || "",
          avatar: null
        });
        setAvatarPreview(user.client_profile.avatar);
      } else if (user.role === "freelance" && user.freelance_profile) {
        setForm({
          bio: user.freelance_profile.bio || "",
          skills: user.freelance_profile.skills || [],
          hourly_rate: user.freelance_profile.hourly_rate || "",
          portfolio_url: user.freelance_profile.portfolio_url || "",
          avatar: null
        });
        setAvatarPreview(user.freelance_profile.avatar);
      }
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not authenticated</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: any) => ({
      ...prev,
      skills: e.target.value.split(",").map(s => s.trim())
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev: any) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Si avatar est un fichier, on utilise FormData
      let data: any;
      if (form.avatar instanceof File) {
        data = new FormData();
        Object.keys(form).forEach(key => {
          if (key === "skills" && Array.isArray(form[key])) {
            form[key].forEach((skill: string) => data.append("skills", skill));
          } else {
            data.append(key, form[key]);
          }
        });
      } else {
        data = form;
      }

      if (user.role === "client") {
        await updateClientProfile(data);
      } else if (user.role === "freelance") {
        await updateFreelanceProfile(data);
      }

      await refreshUser();
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier mon profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Avatar */}
        <div>
          <label className="block font-semibold mb-1">Avatar</label>
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <div>
          <label className="block font-semibold mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {user.role === "client" && (
          <>
            <div>
              <label className="block font-semibold mb-1">Entreprise</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Site web</label>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}

        {user.role === "freelance" && (
          <>
            <div>
              <label className="block font-semibold mb-1">Compétences (séparées par ,)</label>
              <input
                type="text"
                name="skills"
                value={form.skills.join(", ")}
                onChange={handleSkillsChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tarif horaire (€)</label>
              <input
                type="number"
                name="hourly_rate"
                value={form.hourly_rate}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Portfolio URL</label>
              <input
                type="text"
                name="portfolio_url"
                value={form.portfolio_url}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

