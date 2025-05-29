import { persist } from "zustand/middleware";
import { create } from "zustand";
import createAxiosInstance from "@/app/axios/axiosInstance";
import Cookies from "js-cookie";

const axiosInstance = createAxiosInstance();

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {},
      token: null,
      loading: false,
      error: null,

      login: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await axiosInstance.post("/auth/login", payload);
          set({ token: res?.data?.token });
          return res;
        } catch (err) {
          set({ error: err.response?.data?.message || err.message });
        } finally {
          set({ loading: false });
        }
      },

      logoutUser: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        set({ token: null });
      },

      generateNewToken: async () => {
        try {
          const refreshToken = Cookies.get("refresh_token");
          if (!refreshToken) throw new Error("No refresh token available");

          const res = await refreshInstance.post("/auth/refresh-token", {
            refreshToken,
          });

          const newAccessToken = res.data?.access_token;
          if (!newAccessToken) throw new Error("No token received");

          Cookies.set("access_token", newAccessToken);
          set({ token: newAccessToken, error: null });

          console.log("New token:", newAccessToken);

          return newAccessToken;
        } catch (error) {
          console.error("Token refresh failed", error);
          set({ token: null, error: error.message || "Token refresh failed" });
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
