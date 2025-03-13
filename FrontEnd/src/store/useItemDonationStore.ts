import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface ItemDonationStore {
  isLoading: boolean;
  isSubmitted: boolean;
  addItemDonation: (data: any) => Promise<void>;
}
const useItemDonationStore = create<ItemDonationStore>((set) => ({
  isLoading: false,
  isSubmitted: false,
  addItemDonation: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/itemDonations/add", data);
      
      toast.success(response.data.message);
      set({ isSubmitted: true });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
}));

export default useItemDonationStore;
