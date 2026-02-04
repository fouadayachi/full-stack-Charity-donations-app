import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface DashboardData {
  totalEvents: number;
  completedEvents: number;
  totalUsers: {
    count: number;
    increase: string;
  };
  totalMoneyRaised: {
    amount: number;
    increase: string;
  };
  pendingRequests: {
    count: number;
    highUrgency: string;
  };
}
interface DashStore {
    data: DashboardData;
    pendingContributions: number; // New state for pending contributions
    getStats: () => Promise<void>;
    fetchPendingContributions: () => Promise<void>; // New method
}
const useDashStore = create<DashStore>((set) => ({
    data: {
        totalEvents: 0,
        completedEvents: 0,
        totalUsers: {
            count: 0,
            increase: ""
        },
        totalMoneyRaised: {
            amount: 0,
            increase: ""
        },
        pendingRequests: {
            count: 0,
            highUrgency: ""
        }
    },
    pendingContributions: 0,
    getStats : async () => {
        try {
            const response = await axiosInstance.get("/dashboard/getStats");

            set({data : response.data.data})
        } catch (error ) {
            console.log(error);
            toast.error("Failed to load dashboard data");
            
        }
    },
    fetchPendingContributions: async () => {
        try {
            const response = await axiosInstance.get("/dashboard/getPendingContributions");
            
            set({ pendingContributions: response.data.data });
        } catch (error) {
            console.log(error);
            toast.error("Failed to load pending contributions");
        }
    }
  
}));

export default useDashStore;
