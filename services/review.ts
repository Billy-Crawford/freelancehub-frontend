// services/review.ts

import api from "./api";

/* =========================
   CREATE REVIEW
========================= */
export const createReview = async (
  missionId: number,
  data: { rating: number; comment?: string }
) => {
  const res = await api.post(
    `/reviews/missions/${missionId}/review/`,
    data
  );

  return res.data;
};

/* =========================
   CHECK IF CAN REVIEW
========================= */
export const canReviewMission = async (missionId: number) => {
  const res = await api.get(
    `/missions/${missionId}/can-review/`
  );

  return res.data;
};

/* =========================
   GET USER REVIEWS
========================= */
export const getUserReviews = async (userId: number) => {
  const res = await api.get(`/users/${userId}/reviews/`);
  return res.data;
};


// import api from "./api";

// export const createReview = async (
//   missionId: number,
//   data: { rating: number; comment: string }
// ) => {
//   const res = await api.post(`/missions/${missionId}/review/`, data);
//   return res.data;
// };

// export const getUserReviews = async (userId: number) => {
//   const res = await api.get(`/users/${userId}/reviews/`);
//   return res.data;
// };

