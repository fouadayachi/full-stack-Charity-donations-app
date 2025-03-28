import useContributionsStore from "@/store/useContributionsStore";
import {
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Package as PackageIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  Users as UsersIcon,
  XCircle as XCircleIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
type PaymentMethod = "credit_card" | "paypal" | "google_pay" | "apple_pay";
type EventType = "donation" | "volunteer" | "items";

interface Event {
  _id: string;
  title: string;
  type: EventType;
  location: string;
  startDate: string;
  endDate: string;
}
interface EventContributionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}
export const EventContributionsModal: React.FC<EventContributionsModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const {
    donations,
    itemDonations,
    volunteers,
    isLoading,
    getDonations,
    getItemDonations,
    getVolunteers,
    confirmVolunteer,
    confirmDonation,
    confirmItemDonation,
    cancelVolunteer,
    cancelDonation,
    cancelItemDonation,
  } = useContributionsStore();

  useEffect(() => {
    if (isOpen) {
      switch (event?.type) {
        case "donation":
          getDonations(event?._id);
          break;
        case "volunteer":
          getVolunteers(event?._id);

          break;
        case "items":
          getItemDonations(event?._id);

          break;
        default:
      }
    }
  }, [isOpen, event?._id]);
  const getContributions = () => {
    if (!event) return [];
    switch (event.type) {
      case "donation":
        return donations;
      case "volunteer":
        return volunteers;
      case "items":
        return itemDonations;
      default:
        return [];
    }
  };
  const filteredContributions = getContributions().filter(
    (contribution: any) => {
      const matchesSearch =
        contribution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contribution.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contribution.phone && contribution.phone.includes(searchQuery)) ||
        (contribution.address &&
          contribution.address
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && contribution.status === "confirmed") ||
        (statusFilter === "pending" && contribution.status === "pending") ||
        (statusFilter === "canceled" && contribution.status === "canceled");

      return matchesSearch && matchesStatus;
    }
  );
  const handleConfirm = (id: string,eventId : any) => {
    if (event?.type === "donation") {
      confirmDonation(id,eventId);
    } else if (event?.type === "volunteer") {
      confirmVolunteer(id,eventId);
    } else if (event?.type === "items") {
      confirmItemDonation(id,eventId);
    }
  };
  const handleCancel = (id: string,eventId : any) => {
    if (event?.type === "donation") {
      cancelDonation(id,eventId);
    } else if (event?.type === "volunteer") {
      cancelVolunteer(id,eventId);
    } else if (event?.type === "items") {
      cancelItemDonation(id,eventId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "google_pay":
        return "Google Pay";
      case "apple_pay":
        return "Apple Pay";
      default:
        return method;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1" size={12} /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <ClockIcon className="mr-1" size={12} /> Pending
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="mr-1" size={12} /> Canceled
          </span>
        );
      default:
        return null;
    }
  };
  const getEventTypeIcon = () => {
    if (!event) return null;
    switch (event.type) {
      case "donation":
        return <DollarSignIcon className="mr-2 text-[#3182CE]" size={16} />;
      case "volunteer":
        return <UsersIcon className="mr-2 text-[#48BB78]" size={16} />;
      case "items":
        return <PackageIcon className="mr-2 text-[#805AD5]" size={16} />;
    }
  };
  const getEventTypeTitle = () => {
    if (!event) return "Contributions";
    switch (event.type) {
      case "donation":
        return "Donations";
      case "volunteer":
        return "Volunteers";
      case "items":
        return "Item Donations";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden my-8 mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-[#1A365D] flex items-center">
              {getEventTypeIcon()}
              {event?.title || "Loading..."} {getEventTypeTitle()}
            </h2>
            <p className="text-gray-600 text-sm">
              {formatDate(event?.startDate || "")} -{" "}
              {formatDate(event?.endDate || "")}
            </p>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex space-x-2 sm:w-auto w-full">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${
                  statusFilter === "all"
                    ? "bg-[#3182CE] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${
                  statusFilter === "confirmed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter("confirmed")}
              >
                <CheckCircleIcon className="mr-1" size={14} />
                Confirmed
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${
                  statusFilter === "pending"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter("pending")}
              >
                <ClockIcon className="mr-1" size={14} />
                Pending
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${
                  statusFilter === "canceled"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter("canceled")}
              >
                <XCircleIcon className="mr-1" size={14} />
                Canceled
              </button>
            </div>
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" size={16} />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
                placeholder="Search by name, email, phone, location..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-220px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading contributions...</div>
            </div>
          ) : filteredContributions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Contributor
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Contact Info
                  </th>
                  {event?.type === "donation" && (
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      Amount
                    </th>
                  )}
                  {event?.type === "volunteer" && (
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      Address
                    </th>
                  )}
                  {event?.type === "items" && (
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      Items
                    </th>
                  )}
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Date
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContributions.map(
                  (contribution: any, index: number) => (
                    <tr
                      key={contribution._id}
                      className={`transition-colors duration-150 ${
                        index % 2 === 0
                          ? "bg-white hover:bg-[#F8FAFC]"
                          : "bg-[#F8FAFC] hover:bg-gray-100"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contribution.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <div className="text-sm text-gray-500 flex items-center">
                            <MailIcon
                              className="mr-1 text-gray-400"
                              size={14}
                            />
                            {contribution.email}
                          </div>
                          {contribution.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <PhoneIcon
                                className="mr-1 text-gray-400"
                                size={14}
                              />
                              {contribution.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      {event?.type === "donation" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-700">
                            {formatCurrency(contribution.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPaymentMethod(contribution.paymentMethod)}
                          </div>
                        </td>
                      )}
                      {event?.type === "volunteer" && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 flex items-start">
                            <MapPinIcon
                              className="mr-1 mt-1 flex-shrink-0 text-gray-400"
                              size={14}
                            />
                            <span
                              className="truncate max-w-[300px]"
                              title={contribution.address}
                            >
                              {contribution.address}
                            </span>
                          </div>
                        </td>
                      )}
                      {event?.type === "items" && (
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {contribution.items.map(
                              (item: any, idx: number) => (
                                <div key={idx} className="flex items-center">
                                  <span className="text-sm font-medium text-purple-700">
                                    {item.quantityDonated}x
                                  </span>
                                  <span className="ml-2 text-sm text-gray-700">
                                    {item.name}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-start mt-2">
                            <MapPinIcon
                              className="mr-1 mt-1 flex-shrink-0 text-gray-400"
                              size={14}
                            />
                            <span
                              className="truncate max-w-[200px]"
                              title={contribution.address}
                            >
                              {contribution.address}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contribution.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(contribution.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {contribution.status === "pending" && (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              className="bg-[#48BB78] text-white p-1.5 rounded-full hover:bg-green-600 transition-colors"
                              title="Confirm Contribution"
                              onClick={() => handleConfirm(contribution._id,event && event._id)}
                            >
                              <CheckCircleIcon size={16} />
                            </button>
                            <button
                              className="bg-[#F56565] text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                              title="Cancel Contribution"
                              onClick={() => handleCancel(contribution._id,event && event._id)}
                            >
                              <XCircleIcon size={16} />
                            </button>
                          </div>
                        )}
                        {contribution.status === "confirmed" && (
                          <button
                            className="bg-[#F56565] text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                            title="Cancel Contribution"
                            onClick={() => handleCancel(contribution._id,event && event._id)}
                          >
                            <XCircleIcon size={16} />
                          </button>
                        )}
                        {contribution.status === "canceled" && (
                          <button
                            className="bg-[#48BB78] text-white p-1.5 rounded-full hover:bg-green-600 transition-colors"
                            title="Confirm Contribution"
                            onClick={() => handleConfirm(contribution._id,event && event._id)}
                          >
                            <CheckCircleIcon size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">
                No contributions found matching your criteria
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-medium">{filteredContributions.length}</span>{" "}
            {getEventTypeTitle().toLowerCase()}
          </div>
          <button
            className="px-4 py-2 bg-[#3182CE] text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
