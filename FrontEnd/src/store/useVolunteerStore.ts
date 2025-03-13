import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface VolunteerStore {
  isLoading: boolean;
  isSubmitted: boolean;
  addVolunteer: (data: any) => Promise<void>;
}
const useVolunteerStore = create<VolunteerStore>((set) => ({
  isLoading: false,
  isSubmitted: false,
  addVolunteer: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/volunteers/add", data);
      
      toast.success(response.data.message);
      set({ isSubmitted: true });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
}));

export default useVolunteerStore;
