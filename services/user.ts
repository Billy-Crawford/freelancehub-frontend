import api from "./api";
import { User, ClientProfile, FreelanceProfile } from "@/types/user";

// 🔹 récupérer user complet
export const getMe = async (): Promise<User> => {
  const res = await api.get("/users/me/");
  return res.data;
};

// 🔹 récupérer profil freelance
export const getFreelanceProfile = async (): Promise<FreelanceProfile> => {
  const res = await api.get("/users/profile/freelance/");
  return res.data;
};

// 🔹 update profil freelance
// Modification freelance profile
export const updateFreelanceProfile = async (
  data: Partial<FreelanceProfile>
): Promise<FreelanceProfile> => {
  const res = await api.put("/users/profile/freelance/", data); // <-- remplacer patch par put
  return res.data;
};

// 🔹 profil client
export const getClientProfile = async (): Promise<ClientProfile> => {
  const res = await api.get("/users/profile/client/");
  return res.data;
};

// Modification Client Profile
export const updateClientProfile = async (
  data: Partial<ClientProfile>
): Promise<ClientProfile> => {
  const res = await api.put("/users/profile/client/", data); // <-- remplacer patch par put
  return res.data;
};

