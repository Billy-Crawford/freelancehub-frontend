// services/chat.ts

// import api from "./api";

// export const getMessages = async (missionId: number) => {
//   const res = await api.get(`/chat/messages/${missionId}/`);
//   return res.data;
// };

// export const sendMessageApi = async (
// missionId: number, p0: number, message: string, file?: File) => {
//   const formData = new FormData();

//   if (message) formData.append("message", message);
//   if (file) formData.append("file", file);

//   const res = await api.post(`/chat/messages/${missionId}/`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return res.data;
// };


import api from "./api";

export const getMessages = async (missionId: number) => {
  const res = await api.get(`/chat/messages/${missionId}/`);
  return res.data;
};

export const sendMessageApi = async (
  missionId: number,
  message: string,
  file?: File
) => {
  const formData = new FormData();

  formData.append("message", message); // OK backend attend message
  if (file) formData.append("file", file);

  const res = await api.post(
    `/chat/messages/${missionId}/`,
    formData
  );

  return res.data;
};