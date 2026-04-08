"use client";

import { useState } from "react";
import { registerUser } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    role: "freelance",
  });

  const router = useRouter();

  const handleRegister = async () => {
    try {
      await registerUser(form);
      router.push("/login");
    } catch (error: any) {
      console.log(error.response?.data);
      alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>

      <input
        placeholder="Email"
        className="w-full border p-2 mb-2"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Mot de passe"
        type="password"
        className="w-full border p-2 mb-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        placeholder="Confirmer mot de passe"
        type="password"
        className="w-full border p-2 mb-2"
        onChange={(e) => setForm({ ...form, password2: e.target.value })}
      />

      <input
        placeholder="Prénom"
        className="w-full border p-2 mb-2"
        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
      />

      <input
        placeholder="Nom"
        className="w-full border p-2 mb-2"
        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
      />

      <select
        className="w-full border p-2 mb-4"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="freelance">Freelance</option>
        <option value="client">Client</option>
      </select>

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        S’inscrire
      </button>
    </div>
  );
}

