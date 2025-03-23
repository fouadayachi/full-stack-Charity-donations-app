import React, { useEffect, useMemo, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import {
  SearchIcon,
  CheckIcon,
  XIcon,
  UserIcon,
  InboxIcon,
  Eye,
} from "lucide-react";
import { RequestDetailsModal } from "./RequestDetailsModal";
import useRequestsStore from "@/store/useRequestsStore";
type RequestStatus = "pending" | "accepted" | "refused";
export interface AdminRequest {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  helpType: string;
  urgency: string;
  status: RequestStatus;
  description: string;
  createdAt: string;
  dateUpdated: string;
  incomeLevel?: string;
  referralSource?: string;
  consent?: boolean;
  images?: string[];
}
type FilterType = "all" | "type" | "urgency";
export const RequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RequestStatus>("pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(
    null
  );
  const {
    getAllRequests,
    requests,
    acceptRequest,
    refuseRequest,
  } = useRequestsStore();
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (request.status !== activeTab) return false;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = request.fullName
          .toLowerCase()
          .includes(searchLower);
        const matchesEmail = request.email.toLowerCase().includes(searchLower);
        const matchesDescription = request.description
          .toLowerCase()
          .includes(searchLower);

        if (!(matchesName || matchesEmail || matchesDescription)) {
          return false;
        }
      }
      if (filterType !== "all" && filterValue) {
        if (filterType === "type" && request.helpType !== filterValue) {
          return false;
        }
        if (filterType === "urgency" && request.urgency !== filterValue) {
          return false;
        }
      }

      return true;
    });
  }, [requests, activeTab, searchQuery, filterType, filterValue]);

  const handleViewDetails = (requestId: string) => {
    const request = requests.find((r) => r._id === requestId);

    if (request) {
      setSelectedRequest(request);
      setIsDetailsModalOpen(true);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const getUrgencyBadge = (urgency: any) => {
    switch (urgency) {
      case "high":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            🔴 High
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            🟠 Medium
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            ⚪ Low
          </span>
        );
    }
  };

  const requestCounts = useMemo(() => {
    const counts = {
      pending: 0,
      accepted: 0,
      refused: 0,
    };

    requests.forEach((request: AdminRequest) => {
      counts[request.status]++;
    });

    return counts;
  }, [requests]);

  useEffect(() => {
    getAllRequests();
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1A365D]">Requests</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative sm:w-48">
            <Select
              className="max-w-[200px]"
              defaultSelectedKeys={["all"]}
              selectedKeys={[filterType]}
              variant="bordered"
              onChange={(e) => setFilterType(e.target.value as FilterType)}
            >
              <SelectItem key="all">All Fields</SelectItem>
              <SelectItem key="type">Help Type</SelectItem>
              <SelectItem key="urgency">Urgency</SelectItem>
            </Select>
          </div>
          {filterType === "type" && (
            <div className="relative sm:w-48">
              <Select
                className="max-w-[200px]"
                defaultSelectedKeys={[""]}
                selectedKeys={[filterValue]}
                variant="bordered"
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <SelectItem key="">All Types</SelectItem>
                <SelectItem key="Food Assistance">Food</SelectItem>
                <SelectItem key="Financial Aid">Financial</SelectItem>
                <SelectItem key="Medical Support">Medical</SelectItem>
                <SelectItem key="Clothing">Clothing</SelectItem>
                <SelectItem key="Other">Other</SelectItem>
              </Select>
            </div>
          )}
          {filterType === "urgency" && (
            <div className="relative sm:w-48">
              <Select
                className="max-w-[200px]"
                defaultSelectedKeys={[""]}
                selectedKeys={[filterValue]}
                variant="bordered"
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <SelectItem key="">All Urgency</SelectItem>
                <SelectItem key="high">High</SelectItem>
                <SelectItem key="medium">Medium</SelectItem>
                <SelectItem key="low">Low</SelectItem>
              </Select>
            </div>
          )}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" size={16} />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
              placeholder="Search requests..."
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
              activeTab === "pending"
                ? "border-[#3182CE] text-[#3182CE]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } flex items-center transition-colors duration-200`}
            onClick={() => setActiveTab("pending")}
          >
            <span>Pending</span>
            <span className="bg-orange-100 text-orange-800 ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {requestCounts.pending}
            </span>
          </button>
          <button
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "accepted"
                ? "border-[#48BB78] text-[#48BB78]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } flex items-center transition-colors duration-200`}
            onClick={() => setActiveTab("accepted")}
          >
            <span>Accepted</span>
            <span className="bg-green-100 text-green-800 ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {requestCounts.accepted}
            </span>
          </button>
          <button
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "refused"
                ? "border-[#F56565] text-[#F56565]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } flex items-center transition-colors duration-200`}
            onClick={() => setActiveTab("refused")}
          >
            <span>Refused</span>
            <span className="bg-red-100 text-red-800 ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {requestCounts.refused}
            </span>
          </button>
        </nav>
      </div>
      {filteredRequests.length > 0 ? (
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
                      <span>Requester</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center">
                      <span>Help Type</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center">
                      <span>Urgency</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center">
                      <span>Date Submitted</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    <div className="flex items-center justify-center">
                      <span>Details</span>
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
                {filteredRequests.map((request, index) => (
                  <tr
                    key={request._id}
                    className={
                      index % 2 === 0
                        ? "bg-white hover:bg-[#F8FAFC]"
                        : "bg-[#F8FAFC] hover:bg-gray-100"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="text-gray-500" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.helpType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getUrgencyBadge(request.urgency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(request.createdAt)}
                      </div>
                      {request.dateUpdated && (
                        <div className="text-xs text-gray-500">
                          Updated: {formatDate(request.dateUpdated)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        color="secondary"
                        size="sm"
                        startContent={<Eye size={15} />}
                        variant="bordered"
                        onClick={() => handleViewDetails(request._id)}
                      >
                        View
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {activeTab === "pending" && (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            className="bg-[#48BB78] text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                            title="Accept Request"
                            onClick={() => acceptRequest(request._id)}
                          >
                            <CheckIcon size={16} />
                          </button>
                          <button
                            className="bg-[#F56565] text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            title="Refuse Request"
                            onClick={() => refuseRequest(request._id)}
                          >
                            <XIcon size={16} />
                          </button>
                        </div>
                      )}
                      {(activeTab === "accepted" ||
                        activeTab === "refused") && (
                        <span className="text-xs text-gray-500">
                          No actions available
                        </span>
                      )}
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
              <InboxIcon className="text-[#3182CE]" size={32} />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No {activeTab} requests found
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTab === "pending"
              ? "There are no pending requests that require your attention."
              : activeTab === "accepted"
              ? "No requests have been accepted yet."
              : "No requests have been refused yet."}
          </p>
        </div>
      )}
      <RequestDetailsModal
        isOpen={isDetailsModalOpen}
        request={selectedRequest as any}
        onAccept={acceptRequest}
        onClose={() => setIsDetailsModalOpen(false)}
        onRefuse={refuseRequest}
      />
    </div>
  );
};
