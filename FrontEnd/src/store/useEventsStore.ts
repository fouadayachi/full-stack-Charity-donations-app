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
  isAddingEvent: boolean;
  isUpdating: boolean;
  totalEvents: number;
  getInitialEvents: (data: any) => Promise<void>;
  getEvent: (data: any) => Promise<void>;
  getFilterEvents: (data: any) => Promise<void>;
  getMoreEvents: (data: any) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  saveEvent: (data: any) => Promise<void>;
  unsaveEvent: (data: any) => Promise<void>;
  addEvent: (data: any) => Promise<void>;
  updateEvent: (eventId: string, data: any) => Promise<void>;
}

const useEventsStore = create<EventsStore>((set, get) => ({
  isLoading: false,
  isLoadingMore: false,
  isLoadingEvent: false,
  isAddingEvent: false,
  isUpdating: false,
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
  addEvent: async (data) => {
    set({ isAddingEvent: true });
    try {
      const response = await axiosInstance.post("/admin/postEvent", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      });

      set((state) => ({
        events: [response.data.event, ...state.events],
        totalEvents: state.totalEvents + 1,
      }));

      toast.success("Event added successfully");
    } catch (error : any) {
      console.error("Add event error:", error);
      toast.error(error.response?.data?.message || "Failed to add event");
    } finally {
      set({ isAddingEvent: false });
    }
  },
  updateEvent: async (eventId, data) => {
    set({ isUpdating: true });
    try {
      const response = await axiosInstance.put(
        `/admin/updateEvent/${eventId}`,
        data
      );

      // Update the event in the store
      set((state) => ({
        events: state.events.map((event: any) =>
          event._id === eventId ? response.data.event : event
        ),
      }));

      toast.success("Event updated successfully");
    } catch (error : any) {
      console.error("Update event error:", error);
      toast.error(error.response?.data?.message || "Failed to update event");
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteEvent: async (eventId) => {
    try {
      await axiosInstance.delete(`/admin/deleteEvent/${eventId}`);

      set((state) => ({
        events: state.events.filter((event: any) => event._id !== eventId),
        totalEvents: state.totalEvents - 1,
      }));

      if (get().event?._id === eventId) {
        set({ event: null });
      }

      toast.success("Event deleted successfully");
    } catch (error : any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
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
