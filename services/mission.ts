// services/mission.ts
import api from "./api";
import { Mission } from "@/types/mission";

// 🔹 Liste des missions
export const getMissions = async (): Promise<Mission[]> => {
  const res = await api.get("/missions/");
  return res.data.map(mapMission); // 🔥 mapping ici
};

// 🔹 Détail mission
export const getMission = async (id: number): Promise<Mission> => {
  const res = await api.get(`/missions/${id}/`);
  return mapMission(res.data);
};

// 🔹 Créer mission (client)
export const createMission = async (data: Partial<Mission>): Promise<Mission> => {
  const res = await api.post("/missions/", data);
  return res.data;
};

// 🔹 Modifier mission
export const updateMission = async (id: number, data: Partial<Mission>): Promise<Mission> => {
  const res = await api.put(`/missions/${id}/`, data);
  return res.data;
};

// 🔹 Supprimer mission
export const deleteMission = async (id: number): Promise<void> => {
  await api.delete(`/missions/${id}/`);
};

const mapMission = (data: any): Mission => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    budget: parseFloat(data.budget), // 🔥 conversion string → number
    deadline: data.deadline,
    status: data.status,
    skills: data.skills_required || [], // 🔥 mapping correct
    client: data.client,
  };
};

// 🔹 Candidater mission
export const applyMission = async (
  missionId: number,
  data: { cover_letter: string; proposed_rate: number }
) => {
  const res = await api.post(`/missions/${missionId}/apply/`, data);
  return res.data;
};

// 🔹 Liste des candidatures pour une mission
export const getMissionApplications = async (missionId: number) => {
  const res = await api.get(`/missions/${missionId}/applications/`);
  return res.data.map((app: any) => ({
    id: app.id,
    cover_letter: app.cover_letter,
    // ⚡ si la valeur est null ou vide, mettre 0
    proposed_rate: app.proposed_rate ? parseFloat(app.proposed_rate) : 0,
    status: app.status,
    freelancer_email: app.freelancer_email || app.freelancer.email,
  }));
};

// 🔹 Mettre à jour le statut d'une candidature
export const updateApplicationStatus = async (
  missionId: number,
  appId: number,
  status: "accepted" | "rejected"
) => {
  const res = await api.put(`/missions/${missionId}/applications/${appId}/status/`, { status });
  return res.data;
};

