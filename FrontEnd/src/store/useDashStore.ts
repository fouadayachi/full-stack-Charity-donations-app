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
    data : DashboardData;
    getStats: () => Promise<void>
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
    getStats : async () => {
        try {
            const response = await axiosInstance.get("/dashboard/getStats");

            set({data : response.data.data})
        } catch (error ) {
            console.log(error);
            toast.error("Failed to load dashboard data");
            
        }
    }
  
}));

export default useDashStore;
