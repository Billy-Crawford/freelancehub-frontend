"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMission, updateMission } from "@/services/mission";
// import { Mission } from "@/types/mission";

export default function EditMissionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: [] as string[],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const data = await getMission(Number(id));

        setForm({
          title: data.title,
          description: data.description,
          budget: data.budget.toString(),
          deadline: data.deadline,
          skills: data.skills || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMission();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await updateMission(Number(id), {
        ...form,
        budget: parseFloat(form.budget),
      });

      router.push(`/missions/${id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier la mission</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Titre</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Budget</label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Skills (séparées par ,)</label>
          <input
            type="text"
            value={form.skills.join(", ")}
            onChange={handleSkillsChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

