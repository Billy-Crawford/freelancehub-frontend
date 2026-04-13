"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createMission } from "@/services/mission";
import { useAuth } from "@/hooks/useAuth";

export default function CreateMissionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  if (!user) return <p>Non autorisé</p>;
  if (user.role !== "client") return <p>Accès réservé aux clients</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.budget || !form.deadline) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      await createMission({
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        deadline: form.deadline,
        skills: form.skills.split(",").map((s) => s.trim()),
      });

      alert("Mission créée !");
      router.push("/my-missions");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Créer une mission</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (ex: Python, Django, React)"
          value={form.skills}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}

