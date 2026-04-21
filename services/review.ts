// services/review.ts
import api from "./api";

export const createReview = async (
  missionId: number,
  data: { rating: number; comment: string }
) => {
  const res = await api.post(`/missions/${missionId}/review/`, data);
  return res.data;
};

export const getUserReviews = async (userId: number) => {
  const res = await api.get(`/users/${userId}/reviews/`);
  return res.data;
};

