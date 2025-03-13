import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface RequestsStore {
  isLoading: boolean;
  isSubmitted: boolean;

  addRequest: (data: any) => Promise<void>;
  setIsSubmitted: () => any;
}
const useRequestsStore = create<RequestsStore>((set) => ({
  isLoading: false,
  isSubmitted: false,
  addRequest: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/requests/addRequest", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      });

      toast.success(response.data.message);
      set({ isSubmitted: true });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
  setIsSubmitted: () => {
    set({ isSubmitted: false });
  },
}));

export default useRequestsStore;
