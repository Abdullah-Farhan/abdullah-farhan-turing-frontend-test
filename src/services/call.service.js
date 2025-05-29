import { create } from "zustand";
import { persist } from "zustand/middleware";
import createAxiosInstance from "@/app/axios/axiosInstance";
import Cookies from "js-cookie";
import generateNewToken from "./auth.service";

let token = Cookies.get("access_token");
let axiosInstance = createAxiosInstance(token);

const useCallStore = create(
  persist(
    (set, get) => ({
      callsData: [],
      totalPages: 0,
      totalCount: 0,
      loading: false,
      error: null,

      getCallsData: async (offset, limit) => {
        set({ loading: true });
        try {
          if (token) {
            const res = await axiosInstance.get(
              `/calls?offset=${offset}&limit=${limit}`
            );
            set({
              callsData: res?.data?.nodes,
              totalPages: Math.ceil(res?.data?.totalCount / limit),
              totalCount: res?.data?.totalCount,
              loading: false,
            });
            console.log(res);
            return res;
          }
        } catch (error) {
          console.log(error);

          if (
            error.response?.status === 401 ||
            error.response?.statusCode === 401
          ) {
            try {
              const newToken = await get().generateNewToken();
              if (newToken) {
                token = newToken;
                axiosInstance = createAxiosInstance(token);
                Cookies.set("access_token", newToken);

                const retryRes = await axiosInstance.get(
                  `/calls?offset=${offset}&limit=${limit}`
                );
                set({
                  callsData: retryRes?.data?.nodes,
                  totalPages: Math.ceil(retryRes?.data?.totalCount / limit),
                  totalCount: retryRes?.data?.totalCount,
                  loading: false,
                });
                return retryRes;
              }
            } catch (retryError) {
              set({
                error: retryError.message || "Retry after token refresh failed",
                loading: false,
              });
              throw retryError;
            }
          }
          set({
            error: error.response?.data?.message || error.message,
            loading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "call-storage",
    }
  )
);

export default useCallStore;
