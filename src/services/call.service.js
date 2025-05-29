import { create } from "zustand";
import { persist } from "zustand/middleware";
import createAxiosInstance from "@/app/axios/axiosInstance";
import Cookies from "js-cookie";

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

      // ----------------------------------------------- Fetch all calls data Endpoint -------------------------------------------
      getCallsData: async (offset, limit) => {
        set({ loading: true });
        try {
          if (token) {
            const res = await axiosInstance.get(
              `/calls?offset=${offset}&limit=${limit}`
            );

            // fetching calls data and setting them into states
            set({
              callsData: res?.data?.nodes,
              totalPages: Math.ceil(res?.data?.totalCount / limit),
              totalCount: res?.data?.totalCount,
              loading: false,
            });
            return res;
          }
        } catch (error) {
          console.log(error);

          set({
            error: error.response?.data?.message || error.message,
            loading: false,
          });
          throw error;
        }
      },
      
// ----------------------------------------------- Update Status (is_archived) Endpoint -------------------------------------------
      updateStatus: async (id) => {
        try {
          const res = await axiosInstance.put(`/calls/${id}/archive`);
          if (res.status === 200) {
            const updatedCall = res.data;

            // from Calls Data only updating the call for which status was updated to reduce redundant requests to server
            set((state) => ({
              callsData: state.callsData.map((call) =>
                call.id === updatedCall.id ? updatedCall : call
              ),
            }));
          }
          return res;
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
          });
          throw error;
        }
      },

      // ----------------------------------------------- Add Note to a Call Endpoint -------------------------------------------
      addNote: async (id, content) => {
        const res = await axiosInstance.post(`/calls/${id}/note`, {
          content
        })
        return res;
      }
    }),
    {
      name: "call-storage",
    }
  )
);

export default useCallStore;
