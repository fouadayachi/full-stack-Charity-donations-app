import useRequestsStore from "@/store/useRequestsStore";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Eye, SearchIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { UserRequestsModal } from "./UserRequestsModal";



export const UserRequests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "type" | "urgency">("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const { getAllRequests, requests } = useRequestsStore();

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = request.fullName.toLowerCase().includes(searchLower);
        const matchesEmail = request.email.toLowerCase().includes(searchLower);
        const matchesDescription = request.description.toLowerCase().includes(searchLower);

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
  }, [requests, searchQuery, filterType, filterValue]);

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

  useEffect(() => {
    getAllRequests();
  }, [getAllRequests]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1A365D]">My Requests</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative sm:w-48">
            <Select
              className="max-w-[200px]"
              defaultSelectedKeys={["all"]}
              selectedKeys={[filterType]}
              variant="bordered"
              onChange={(e) => setFilterType(e.target.value as "all" | "type" | "urgency")}
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
      {filteredRequests.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Help Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
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
                      <div className="text-sm font-medium text-gray-900">
                        {request.fullName}
                      </div>
                      <div className="text-xs text-gray-500">{request.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.helpType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.urgency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(request.createdAt)}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
          <p className="text-gray-500">You have not submitted any requests yet.</p>
        </div>
      )}
      <UserRequestsModal
        isOpen={isDetailsModalOpen}
        request={selectedRequest}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};
