// services/payment.ts
import api from "./api";

// 🔹 liste
export const getMyPayments = async () => {
  const res = await api.get("/payments/my/");
  return res.data;
};

// 🔹 initier paiement
export const initPayment = async (missionId: number) => {
  const res = await api.post(`/payments/${missionId}/pay/`);
  return res.data;
};

// 🔹 annuler
export const cancelPayment = async (missionId: number) => {
  const res = await api.post(`/payments/${missionId}/cancel/`);
  return res.data;
};

// 🔹 libérer
export const releasePayment = async (missionId: number) => {
  const res = await api.post(`/payments/${missionId}/release/`);
  return res.data;
};

