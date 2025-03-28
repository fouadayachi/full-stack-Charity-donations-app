import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../config/axios";

interface Message {
    _id : string;
  fullName: string;
  email: string;
  message: string;
  isRead : boolean;
  createdAt: string;
}

interface MessagesStore {
  messages: Message[];
  unreadMessagesCount: number; 
  isSending: boolean;
  isGettingMessages: boolean;
  sendMessage: (message: any) => Promise<void>;
  getMessages: () => Promise<void>;
  fetchUnreadMessagesCount: () => Promise<void>; 
  toggleMessageReadStatus: (messageId: string, isRead: boolean) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>; 
}

const useMessagesStore = create<MessagesStore>((set) => ({
  messages: [],
  unreadMessagesCount: 0,
  isSending: false,
  isGettingMessages: false,
  sendMessage: async (message) => {
    set({ isSending: true });
    try {
      const response = await axiosInstance.post("/messages/sendMessage", message);

      if (response.status === 200) {
        toast.success("Message sent successfully");
        set((state) => ({ messages: [...state.messages, message] }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    } finally {
      set({ isSending: false });
    }
  },
  getMessages: async () => {
    set({ isGettingMessages: true });
    try {
      const response = await axiosInstance.get("/messages/getMessages");

      set({ messages: response.data.messages });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }
    set({ isGettingMessages: false });
  },
  fetchUnreadMessagesCount: async () => {
    try {
      const response = await axiosInstance.get("/messages/getUnreadMessagesCount");

      set({ unreadMessagesCount: response.data.data });
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch unread messages count");
    }
  },
  toggleMessageReadStatus: async (messageId, isRead) => {
    try {
      const response = await axiosInstance.put(`/messages/toggleReadStatus/${messageId}`, {
        isRead,
      });

      if (response.status === 200) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId ? { ...msg, isRead  } : msg
          ),
          unreadMessagesCount : isRead === true ? state.unreadMessagesCount - 1 : state.unreadMessagesCount + 1
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update message status");
    }
  },
  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(`/messages/deleteMessage/${messageId}`);

      if (response.status === 200) {
        set((state) => ({
          unreadMessagesCount : state.messages.find((msg) => msg._id === messageId)?.isRead === false ? state.unreadMessagesCount - 1 : state.unreadMessagesCount,
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete message");
    }
  },
}));

export default useMessagesStore;