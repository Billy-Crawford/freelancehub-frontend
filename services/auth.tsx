//  services/auth.tsx
import API from "./api";

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/users/login/", { email, password });

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const registerUser = async (data: any) => {
  return API.post("/users/register/", data);
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

