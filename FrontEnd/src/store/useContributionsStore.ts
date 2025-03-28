import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";
import useEventsStore from "./useEventsStore";
import useDashStore from "./useDashStore";

type PaymentMethod = "credit_card" | "paypal" | "google_pay" | "apple_pay";

interface Donation {
  _id: string;
  userId?: string;
  eventId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  name: string;
  email: string;
  phone: string;
  status: "confirmed" | "canceled" | "pending";
  createdAt: string;
  updatedAt: string;
}

interface Volunteer {
  _id: string;
  userId?: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "confirmed" | "canceled" | "pending";
  createdAt: string;
  updatedAt: string;
}

interface ItemDonation {
  _id: string;
  userId?: string;
  eventId: string;
  items: Array<{
    name: string;
    quantityDonated: number;
  }>;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "confirmed" | "canceled" | "pending";
  createdAt: string;
  updatedAt: string;
}

interface ContributionsStore {
  donations: Donation[];
  itemDonations: ItemDonation[];
  volunteers: Volunteer[];
  isLoading: boolean;
  getDonations: (eventId: string) => Promise<void>;
  getItemDonations: (eventId: string) => Promise<void>;
  getVolunteers: (eventId: string) => Promise<void>;
  confirmDonation: (donationId: string, eventId: string) => Promise<void>;
  cancelDonation: (donationId: string, eventId: string) => Promise<void>;
  confirmItemDonation: (
    itemDonationId: string,
    eventId: string
  ) => Promise<void>;
  cancelItemDonation: (
    itemDonationId: string,
    eventId: string
  ) => Promise<void>;
  confirmVolunteer: (volunteerId: string, eventId: string) => Promise<void>;
  cancelVolunteer: (volunteerId: string, eventId: string) => Promise<void>;
  updatePendingContributions: (eventId: string) => void;
}

const useContributionsStore = create<ContributionsStore>((set, get) => ({
  donations: [],
  itemDonations: [],
  volunteers: [],
  isLoading: false,

  // Method to update pending contributions for a specific event
  updatePendingContributions: (eventId: string) => {
    useEventsStore.setState((state) => ({
      events: state.events.map((event: any) =>
        event._id === eventId && event.pendingContributions > 0
          ? {
              ...event,
              pendingContributions: Math.max(event.pendingContributions - 1, 0),
            }
          : event
      ),
    }));

    // Decrease pending contributions in useDashStore
    useDashStore.setState((state) => ({
      pendingContributions: Math.max(state.pendingContributions - 1, 0),
    }));
  },

  getDonations: async (eventId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/contributions/donations/${eventId}`
      );

      set({ donations: response.data.donations });
    } catch (error : any) {
      console.log(error);
      toast.error("Failed to load contributions data");
    }
    set({ isLoading: false });
  },

  getItemDonations: async (eventId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/contributions/item-donations/${eventId}`
      );

      set({ itemDonations: response.data.itemDonations });
    } catch (error : any) {
      console.log(error);
      toast.error("Failed to load contributions data");
    }
    set({ isLoading: false });
  },

  getVolunteers: async (eventId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/contributions/volunteers/${eventId}`
      );

      set({ volunteers: response.data.volunteers });
    } catch (error : any) {
      console.log(error);
      toast.error("Failed to load contributions data");
    }
    set({ isLoading: false });
  },

  confirmDonation: async (donationId, eventId) => {
    try {
      await axiosInstance.put(`/donations/confirm/${donationId}`);
      const donation = get().donations.find((d) => d._id === donationId);

      if (donation?.status === "pending") {
        get().updatePendingContributions(eventId);
      }
      set((state) => ({
        donations: state.donations.map((donation) =>
          donation._id === donationId
            ? { ...donation, status: "confirmed" }
            : donation
        ),
      }));

      toast.success("Donation confirmed successfully");
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  cancelDonation: async (donationId, eventId) => {
    try {
      await axiosInstance.put(`/donations/cancel/${donationId}`);
      const donation = get().donations.find((d) => d._id === donationId);

      if (donation?.status === "pending") {
        get().updatePendingContributions(eventId);
      }
      set((state) => ({
        donations: state.donations.map((donation) =>
          donation._id === donationId
            ? { ...donation, status: "canceled" }
            : donation
        ),
      }));

      toast.success("Donation canceled successfully");
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  confirmItemDonation: async (itemDonationId, eventId) => {
    try {
      await axiosInstance.put(`/itemDonations/confirm/${itemDonationId}`);
      const itemDonation = get().itemDonations.find(
        (d) => d._id === itemDonationId
      );

      if (itemDonation?.status === "pending") {
        get().updatePendingContributions(eventId);
      }
      set((state) => ({
        itemDonations: state.itemDonations.map((itemDonation) =>
          itemDonation._id === itemDonationId
            ? { ...itemDonation, status: "confirmed" }
            : itemDonation
        ),
      }));

      toast.success("Item donation confirmed successfully");
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  cancelItemDonation: async (itemDonationId, eventId) => {
    try {
      await axiosInstance.put(`/itemDonations/cancel/${itemDonationId}`);
      const itemDonation = get().itemDonations.find(
        (d) => d._id === itemDonationId
      );

      if (itemDonation?.status === "pending") {
        get().updatePendingContributions(eventId);
      }
      set((state) => ({
        itemDonations: state.itemDonations.map((itemDonation) =>
          itemDonation._id === itemDonationId
            ? { ...itemDonation, status: "canceled" }
            : itemDonation
        ),
      }));

      toast.success("Item donation canceled successfully");
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  confirmVolunteer: async (volunteerId, eventId) => {
    try {
      await axiosInstance.put(`/volunteers/confirm/${volunteerId}`);
      const volunteer = get().volunteers.find((d) => d._id === volunteerId);

      if (volunteer?.status === "pending") {
        get().updatePendingContributions(eventId);
      }
      set((state) => ({
        volunteers: state.volunteers.map((volunteer) =>
          volunteer._id === volunteerId
            ? { ...volunteer, status: "confirmed" }
            : volunteer
        ),
      }));

      toast.success("Volunteer confirmed successfully");
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  cancelVolunteer: async (volunteerId, eventId) => {
    try {
      await axiosInstance.put(`/volunteers/cancel/${volunteerId}`);
      const volunteer = get().volunteers.find((d) => d._id === volunteerId);

      if (volunteer?.status === "pending") {
        get().updatePendingContributions(eventId);
      }
      set((state) => ({
        volunteers: state.volunteers.map((volunteer) =>
          volunteer._id === volunteerId
            ? { ...volunteer, status: "canceled" }
            : volunteer
        ),
      }));

      toast.success("Volunteer canceled successfully");
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
}));

export default useContributionsStore;
