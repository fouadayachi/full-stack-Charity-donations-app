import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";
import useAuthStore from "./useAuthStore";

interface EventsStore {
  events: any;
  event: any;
  isLoading: boolean;
  isLoadingMore: boolean;
  isLoadingEvent: boolean;
  totalEvents: number;
  getInitialEvents: (data: any) => Promise<void>;
  getEvent: (data: any) => Promise<void>;
  getFilterEvents: (data: any) => Promise<void>;
  getMoreEvents: (data: any) => Promise<void>;
  saveEvent: (data: any) => Promise<void>;
  unsaveEvent: (data: any) => Promise<void>;
}

const useEventsStore = create<EventsStore>((set, get) => ({
  isLoading: false,
  isLoadingMore: false,
  isLoadingEvent: false,

  totalEvents: 0,
  events: [],
  event: null,
  getInitialEvents: async (params) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/events", { params });

      set({ events: response.data.events });
      set({ totalEvents: response.data.total });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
  getEvent: async (eventId) => {
    set({ isLoadingEvent: true });
    try {
      const response = await axiosInstance.get("/admin/event/" + eventId);

      set({ event: response.data.event });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoadingEvent: false });
  },
  getFilterEvents: async (params) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/events/filter", {
        params,
      });

      set({ events: response.data.events });
      set({ totalEvents: response.data.total });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoading: false });
  },
  getMoreEvents: async (params) => {
    set({ isLoadingMore: true });
    try {
      const response = await axiosInstance.get("/admin/events/filter", {
        params,
      });

      set({ events: [...get().events, ...response.data.events] });
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isLoadingMore: false });
  },
  saveEvent: async (eventId) => {
    try {
      const response = await axiosInstance.post(
        "/admin/events/saveEvent",
        eventId
      );
      const { user } = useAuthStore.getState();
      const { savedEvents } = user;

      savedEvents.push(eventId.eventId);

      useAuthStore.setState({ user: { ...user, savedEvents } });

      console.log(response.data);
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  unsaveEvent: async (eventId) => {
    try {
      const response = await axiosInstance.post(
        "/admin/events/unsaveEvent",
        eventId
      );

      const { user } = useAuthStore.getState();
      const { savedEvents } = user;

      const newSavedEvents = savedEvents.filter(
        (id: any) => id.toString() !== eventId.eventId
      );

      useAuthStore.setState({ user: { ...user, savedEvents: newSavedEvents } });

      console.log(response.data);
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
}));

export default useEventsStore;
