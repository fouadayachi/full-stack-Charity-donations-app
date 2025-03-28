import { User } from "@/components/Admin/Users/UsersPage";
import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface AuthStore {
  authenticated: boolean;
  user: any;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isUpdating: boolean;
  contributions: Array<any>;
  users: Array<User>;
  signup: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  getContributions: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getAllUsers: () => Promise<void>; 
  updateProfile: (formData: any) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  authenticated: false,
  user: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: false,
  isUpdating: false,
  contributions: [],
  users : [],

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      if (res.data.success) {
        toast.success(res.data.message);
        set({ authenticated: true, user: res.data.user });
        console.log(res.data.message);
      }
    } catch (error : any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    set({ isSigningUp: false });
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (res.data.success) {
        toast.success(res.data.message);
        set({ authenticated: true, user: res.data.user });
        console.log(res.data.message);
      }
    } catch (error : any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    set({ isLoggingIn: false });
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");

      if (res.data.success) {
        set({ authenticated: false, user: null });
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.post("/auth/authentication");

      if (res.data.success) {
        set({ authenticated: true, user: res.data.user });
      }
    } catch (error) {
      console.log(error);
    }
    set({ isCheckingAuth: false });
  },
  getContributions: async () => {
    try {
      const [donations, volunteers, itemDonations] = await Promise.all([
        axiosInstance.get("/donations/getDonations"),
        axiosInstance.get("/volunteers/getVolunteers"),
        axiosInstance.get("/itemDonations/getItemDonations"),
      ]);

      set({
        contributions: [
          ...donations.data.map((d : any) => ({ ...d, type: "Donation" })),
          ...volunteers.data.map((v : any) => ({ ...v, type: "Volunteer" })),
          ...itemDonations.data.map((i : any) => ({ ...i, type: "Items" })),
        ],
      });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/auth/getAllUsers");

      if (res.data.success) {
        set({ users: res.data.users }); 
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdating: true });
    try {
      const response = await axiosInstance.put('/auth/updateProfile', formData);

      if (response.data.success) {
        set({user : response.data.user});
        toast.success(response.data.message);
      } 
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isUpdating: false });
  },

  changePassword: async (data) => {
    try {
      const response = await axiosInstance.put('/auth/changePassword', data);

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  },
}));

export default useAuthStore;
