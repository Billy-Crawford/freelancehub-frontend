// services/mission.ts
import api from "./api";
import { Mission } from "@/types/mission";

/* =========================
   🔹 MISSION MAPPING
========================= */

const mapMission = (data: any): Mission => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    budget: parseFloat(data.budget),
    deadline: data.deadline,
    status: data.status,
    skills: data.skills_required || [],
    client: data.client,
  };
};

/* =========================
   🔹 MISSIONS
========================= */

export const getMissions = async (): Promise<Mission[]> => {
  const res = await api.get("/missions/");
  return res.data.map(mapMission);
};

export const getMission = async (id: number): Promise<Mission> => {
  const res = await api.get(`/missions/${id}/`);
  return mapMission(res.data);
};

export const createMission = async (data: any) => {
  const payload = {
    ...data,
    skills_required: data.skills,
  };

  delete payload.skills;

  const res = await api.post("/missions/", payload);
  return mapMission(res.data);
};

export const updateMission = async (id: number, data: Partial<Mission>) => {
  const res = await api.put(`/missions/${id}/`, data);
  return mapMission(res.data);
};

export const deleteMission = async (id: number) => {
  await api.delete(`/missions/${id}/`);
};

export const getCompletedMissions = async () => {
  const res = await api.get("/missions/completed/");
  return res.data.map(mapMission);
};

/* =========================
   🔹 APPLICATION MAPPING
========================= */

const mapApplication = (app: any) => {
  return {
    id: app.id,
    mission: app.mission,
    mission_title: app.mission_title || app.mission?.title,
    freelancer: app.freelancer,
    freelancer_id: app.freelancer_id,
    freelancer_email:
      app.freelancer_email || app.freelancer?.email || "Unknown",
    cover_letter: app.cover_letter,
    proposed_rate: parseFloat(app.proposed_rate) || 0,
    status: app.status,
  };
};

/* =========================
   🔹 APPLICATIONS
========================= */

export const applyMission = async (
  missionId: number,
  data: { cover_letter: string; proposed_rate: number }
) => {
  const res = await api.post(`/missions/${missionId}/apply/`, data);
  return res.data;
};

export const getMissionApplications = async (missionId: number) => {
  const res = await api.get(`/missions/${missionId}/applications/`);
  return res.data.map(mapApplication);
};

export const updateApplicationStatus = async (
  missionId: number,
  appId: number,
  status: "accepted" | "rejected"
) => {
  const res = await api.put(
    `/missions/${missionId}/applications/${appId}/status/`,
    { status }
  );

  return res.data;
};

/* =========================
   🔹 FREELANCE
========================= */

export const getMyApplications = async () => {
  const res = await api.get("/missions/my-applications/");
  return res.data.map(mapApplication);
};

export const getClientAcceptedApplications = async () => {
  const res = await api.get("/missions/my-missions-applications/");
  return res.data.map(mapApplication);
};


