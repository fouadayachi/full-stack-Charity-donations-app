import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface DonationStore {
  isLoading: boolean;
  isSubmitted: boolean;
  addDonation: (data: any) => Promise<void>;
}
const useDonationStore = create<DonationStore>((set) => ({
  isLoading: false,
  isSubmitted: false,
  addDonation: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/donations/add", data);
      
      toast.success(response.data.message);
      set({ isSubmitted: true });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
}));

export default useDonationStore;
