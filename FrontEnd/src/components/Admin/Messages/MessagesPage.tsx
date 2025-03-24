import React, { useEffect, useMemo, useState } from "react";
import {
  SearchIcon,
  EyeIcon,
  TrashIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { MessageDetailsModal } from "./MessageDetailsModal";
import useMessagesStore from "@/store/useMessagesStore";
interface Message {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
type FilterType = "all" | "read" | "unread";
export const MessagesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const {messages,getMessages,isGettingMessages,toggleMessageReadStatus,deleteMessage} = useMessagesStore();
    
  const filteredMessages = useMemo(() => {
    return messages?.filter((message) => {
      // Filter by read/unread status
      if (filterType === "read" && !message.isRead) return false;
      if (filterType === "unread" && message.isRead) return false;
      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = message.fullName
          .toLowerCase()
          .includes(searchLower);
        const matchesEmail = message.email.toLowerCase().includes(searchLower);
        const matchesContent = message.message
          .toLowerCase()
          .includes(searchLower);

        if (!(matchesName || matchesEmail || matchesContent)) {
          return false;
        }
      }

      return true;
    });
  }, [messages, searchQuery, filterType]);
  const handleViewMessage = (messageId: string) => {
    const message = messages.find((m) => m._id === messageId);

    if (message) {
      setSelectedMessage(message);
      setIsDetailsModalOpen(true);
    }

    toggleMessageReadStatus(messageId, true);
  };
  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
  };
  const handleMarkAsUnread = (messageId: string) => {
    toggleMessageReadStatus(messageId, false);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const truncateMessage = (message: string, maxLength: number = 100) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };
  const messageCounts = useMemo(() => {
    const counts = {
      all: messages?.length,
      read: messages?.filter((message) => message.isRead).length,
      unread: messages?.filter((message) => !message.isRead).length,
    };

    return counts;
  }, [messages]);

  useEffect(() => {
    getMessages();
  },[]);

  if(isGettingMessages){
    return <div>Loading...</div>
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1A365D]">Messages</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" size={16} />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
              placeholder="Search messages..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              filterType === "all"
                ? "border-[#3182CE] text-[#3182CE]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } flex items-center transition-colors duration-200`}
            onClick={() => setFilterType("all")}
          >
            <span>All</span>
            <span className="bg-gray-100 text-gray-800 ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {messageCounts.all}
            </span>
          </button>
          <button
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              filterType === "unread"
                ? "border-[#3182CE] text-[#3182CE]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } flex items-center transition-colors duration-200`}
            onClick={() => setFilterType("unread")}
          >
            <span>Unread</span>
            <span className="bg-blue-100 text-blue-800 ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {messageCounts.unread}
            </span>
          </button>
          <button
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              filterType === "read"
                ? "border-[#3182CE] text-[#3182CE]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } flex items-center transition-colors duration-200`}
            onClick={() => setFilterType("read")}
          >
            <span>Read</span>
            <span className="bg-gray-100 text-gray-500 ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {messageCounts.read}
            </span>
          </button>
        </nav>
      </div>
      {filteredMessages?.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center">
                      <span>Sender</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center">
                      <span>Message</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center justify-center">
                      <span>Status</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center justify-center">
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message, index) => (
                  <tr
                    key={message._id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white hover:bg-[#F8FAFC]"
                        : "bg-[#F8FAFC] hover:bg-gray-100"
                    } ${!message.isRead ? "font-medium" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="text-gray-500" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`text-sm ${
                              !message.isRead
                                ? "font-medium text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {message.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {message.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`text-sm ${
                          !message.isRead
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {truncateMessage(message.message)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(message.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(message.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {!message.isRead ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Read
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                          title="View Message"
                          onClick={() => handleViewMessage(message._id)}
                        >
                          <EyeIcon className="text-blue-600" size={18} />
                        </button>
                        
                        <button
                          className="p-1 rounded-full hover:bg-red-100 transition-colors"
                          title="Delete Message"
                          onClick={() => handleDeleteMessage(message._id)}
                        >
                          <TrashIcon className="text-red-600" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#3182CE] bg-opacity-10 flex items-center justify-center">
              <MailIcon className="text-[#3182CE]" size={32} />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No messages found
          </h3>
          <p className="text-gray-500 mb-4">
            {filterType === "all"
              ? "Your inbox is empty."
              : filterType === "unread"
              ? "You have no unread messages."
              : "No read messages to display."}
          </p>
        </div>
      )}
      <MessageDetailsModal
        isOpen={isDetailsModalOpen}
        message={selectedMessage}
        onClose={() => setIsDetailsModalOpen(false)}
        onDelete={handleDeleteMessage}
        onMarkAsUnread={handleMarkAsUnread}
      />
    </div>
  );
};
