import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface RequestsStore {
  isLoading: boolean;
  isSubmitted: boolean;
  requests: Array<any>;
  pendingRequestsCount: number; 
  getAllRequests: () => Promise<void>;
  addRequest: (data: any) => Promise<void>;
  setIsSubmitted: () => any;
  fetchPendingRequestsCount: () => Promise<void>; 
  acceptRequest: (requestId: string) => Promise<void>; 
  refuseRequest: (requestId: string) => Promise<void>; 
}
const useRequestsStore = create<RequestsStore>((set) => ({
  isLoading: false,
  isSubmitted: false,
  requests : [],
  pendingRequestsCount: 0,
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
  getAllRequests: async () => {
    try {
      const response = await axiosInstance.get("/requests/getAllRequests");

      if (response.data.success) {
        set({ requests: response.data.requests }); // Update the requests array in the store
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  fetchPendingRequestsCount: async () => {
    try {
      const response = await axiosInstance.get("/requests/getPendingRequestsCount");
      
      set({ pendingRequestsCount: response.data.data });
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch pending requests count");
    }
  },
  acceptRequest: async (requestId: string) => {
    console.log(requestId);
    try {
      const response = await axiosInstance.put(`/requests/acceptRequest/${requestId}`);

      if (response.data.success) {
        toast.success(response.data.message);
        
        set((state) => ({
          requests: state.requests.map((request) =>
            request._id === requestId ? { ...request, status: "accepted" } : request
          ),
          pendingRequestsCount : state.pendingRequestsCount - 1
        }));
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },


  refuseRequest: async (requestId: string) => {
    try {
      const response = await axiosInstance.put(`/requests/refuseRequest/${requestId}`);

      if (response.data.success) {

        toast.success(response.data.message);
        
        set((state) => ({
          requests: state.requests.map((request) =>
            request._id === requestId ? { ...request, status: "refused" } : request
          ),
          pendingRequestsCount : state.pendingRequestsCount - 1
        }));
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
}));

export default useRequestsStore;
