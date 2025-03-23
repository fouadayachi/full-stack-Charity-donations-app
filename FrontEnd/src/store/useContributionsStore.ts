import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

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
  confirmed: boolean;
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
  confirmed: boolean;
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
  confirmed: boolean;
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
  confirmDonation: (donationId: string) => Promise<void>;
  confirmItemDonation: (itemDonationId: string) => Promise<void>;
  confirmVolunteer: (volunteerId: string) => Promise<void>;
}

const useContributionsStore = create<ContributionsStore>((set) => ({
  donations: [],
  itemDonations: [],
  volunteers: [],
  isLoading: false,

  // Function to fetch donations for a specific event
  getDonations: async (eventId) => {
    set({ isLoading: true});
    try {
      const response = await axiosInstance.get(`/contributions/donations/${eventId}`);

      set({ donations: response.data.donations });
    } catch (error) {
        console.log(error);
        toast.error("Failed to load contributions data");
    }
    set({ isLoading: false });
  },

  // Function to fetch item donations for a specific event
  getItemDonations: async (eventId) => {
    set({ isLoading: true});
    try {
      const response = await axiosInstance.get(`/contributions/item-donations/${eventId}`);

      set({ itemDonations: response.data.itemDonations});
    } catch (error) {
        console.log(error);
        toast.error("Failed to load contributions data");
    }
    set({ isLoading: false });
  },

  getVolunteers: async (eventId) => {
    set({ isLoading: true});
    try {
      const response = await axiosInstance.get(`/contributions/volunteers/${eventId}`);

      set({ volunteers: response.data.volunteers });
    } catch (error) {
        console.log(error);
        toast.error("Failed to load contributions data");
    }
    set({ isLoading: false });
  },
  confirmDonation: async (donationId) => {
    try {
      await axiosInstance.put(`/donations/confirm/${donationId}`);
      set((state) => ({
        donations: state.donations.map((donation) =>
          donation._id === donationId ? { ...donation, confirmed: true } : donation
        ),
      }));
      toast.success("Donation confirmed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to confirm donation");
    }
  },

  confirmItemDonation: async (itemDonationId) => {
    try {
      await axiosInstance.put(`/item-donations/confirm/${itemDonationId}`);
      set((state) => ({
        itemDonations: state.itemDonations.map((itemDonation) =>
          itemDonation._id === itemDonationId ? { ...itemDonation, confirmed: true } : itemDonation
        ),
      }));
      toast.success("Item donation confirmed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to confirm item donation");
    }
  },

  confirmVolunteer: async (volunteerId) => {
    try {
      await axiosInstance.put(`/volunteers/confirm/${volunteerId}`);
      set((state) => ({
        volunteers: state.volunteers.map((volunteer) =>
          volunteer._id === volunteerId ? { ...volunteer, confirmed: true } : volunteer
        ),
      }));
      toast.success("Volunteer confirmed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to confirm volunteer");
    }
  },
}));

export default useContributionsStore;