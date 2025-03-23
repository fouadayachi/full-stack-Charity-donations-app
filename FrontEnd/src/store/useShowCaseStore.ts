import { Showcase } from "@/components/Admin/ShowCase/ShowcasePage";
import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface ShowCases {
  showCases: Array<Showcase>;
  event: any;
  isLoading: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  isLoadingEvent: boolean;
  isLoadingMore: boolean;
  totalShowCases: number;
  getShowCases: () => Promise<void>;
  getMoreShowCases: (data: any) => Promise<void>;
  getEvent: (data: any) => Promise<void>;
  getAllShowCases: () => Promise<void>;
  deleteShowCase: (id: string) => Promise<void>;
  updateShowCase: (data: any, id: string) => Promise<void>;
  addShowCase: (data: any) => Promise<void>;
}

const useShowCases = create<ShowCases>((set, get) => ({
  isLoading: false,
  isLoadingMore: false,
  isLoadingEvent: false,
  isAdding: false,
  isUpdating: false,
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
  getAllShowCases: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/showcases/getAllShowCases");

      set({ showCases: response.data.showCases });
      set({ totalShowCases: response.data.showCases.length });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
  deleteShowCase: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/showcases/deleteShowCase/${id}`);
      toast.success("Showcase deleted successfully");

      await get().getShowCases();
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
  addShowCase: async (data) => {
    set({ isAdding: true });
    try {
      const response = await axiosInstance.post(
        "/showcases/addShowCase",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        }
      );

      set((state) => ({
        showCases: [response.data.showCase, ...state.showCases],
        totalShowCases: state.totalShowCases + 1,
      }));

      toast.success("Show case added successfully");
    } catch (error : any) {
      console.error("Add showcase error:", error);
      toast.error(error.response?.data?.message || "Failed to add event");
    }
    set({ isAdding: false });
  },
  updateShowCase: async (data, id) => {
    set({ isUpdating: true });
    try {
      const response = await axiosInstance.put(
        `/showcases/updateShowCase/${id}`,
        data
      );

      set((state) => ({
        showCases: state.showCases.map((showCase: any) =>
          showCase._id === id ? response.data.showcase : showCase
        ),
      }));

      toast.success("Show case updated successfully");
    } catch (error : any) {
      console.error("Update showcase error:", error);
      toast.error(error.response?.data?.message || "Failed to update event");
    }
    set({isUpdating : false});
  },
}));

export default useShowCases;
