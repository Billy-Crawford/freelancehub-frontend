// services/user.ts
import api from "./api";
import { User, ClientProfile, FreelanceProfile } from "@/types/user";

/* =========================
   🔹 USER
========================= */

// 🔹 récupérer user complet
export const getMe = async (): Promise<User> => {
  const res = await api.get("/users/me/");
  return res.data;
};

// 🔥 UPDATE USER (NOM / PRENOM)
export const updateUser = async (data: {
  first_name: string;
  last_name: string;
}): Promise<User> => {
  const res = await api.put("/users/me/", data);
  return res.data;
};

/* =========================
   🔹 FREELANCE
========================= */

export const getFreelanceProfile = async (): Promise<FreelanceProfile> => {
  const res = await api.get("/users/profile/freelance/");
  return res.data;
};

export const updateFreelanceProfile = async (
  data: Partial<FreelanceProfile>
): Promise<FreelanceProfile> => {
  const res = await api.put("/users/profile/freelance/", data);
  return res.data;
};

/* =========================
   🔹 CLIENT
========================= */

export const getClientProfile = async (): Promise<ClientProfile> => {
  const res = await api.get("/users/profile/client/");
  return res.data;
};

export const updateClientProfile = async (
  data: Partial<ClientProfile>
): Promise<ClientProfile> => {
  const res = await api.put("/users/profile/client/", data);
  return res.data;
};

