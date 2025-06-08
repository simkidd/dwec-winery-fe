import instance from "@/services/axios";

export const getMe = async () => {
  const res = await instance.get(`/auth/me`);
  return res.data;
};
