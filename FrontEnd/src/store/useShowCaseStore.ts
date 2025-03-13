import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface ShowCases {
  showCases: any;
  event: any;
  isLoading: boolean;
  isLoadingEvent: boolean;
  isLoadingMore: boolean;
  totalShowCases: number;
  getShowCases: () => Promise<void>;
  getMoreShowCases: (data: any) => Promise<void>;
  getEvent: (data: any) => Promise<void>;
}
const useShowCases = create<ShowCases>((set, get) => ({
  isLoading: false,
  isLoadingMore: false,
  isLoadingEvent: false,
  totalShowCases: 0,
  showCases: [],
  event: {},
  getShowCases: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/showcases/getShowCases");

      set({ showCases: response.data.showCases });
      set({ totalShowCases: response.data.total });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
  getEvent: async (id) => {
    set({ isLoadingEvent: true });
    try {
      const response = await axiosInstance.get(`/showcases/getShowCase/${id}`);

      set({ event: response.data.showCase });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoadingEvent: false });
  },
  getMoreShowCases: async (params) => {
    set({ isLoadingMore: true });
    try {
      const response = await axiosInstance.get("/showcases/getShowCases", {
        params,
      });

      set({ showCases: [...get().showCases, ...response.data.showCases] });
      set({ totalShowCases: response.data.total });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoadingMore: false });
  },
}));

export default useShowCases;
