/* eslint-disable jsx-a11y/anchor-is-valid */
import useEventsStore from "@/store/useEventsStore";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import {
  ExternalLink,
  Eye,
  PencilIcon,
  PlusIcon,
  Search,
  TrashIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { EventContributionsModal } from "./EventContributionsModal";
import { UpdateEventModal } from "./UpdateEventModal";
type EventType = "donation" | "volunteer" | "items";
type EventStatus = "active" | "completed" | "canceled";
const EventsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isContributionsModalOpen, setIsContributionsModalOpen] = useState(
    false
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {
    events,
    getInitialEvents,
    deleteEvent,
    updateEvent,
  } = useEventsStore();

  const handleSelectionChange = (e: any) => {
    setSortBy(e.target.value);
  };
  const filteredEvents = events.filter((event: any) => {
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });
  // Helper function to get type badge color
  const getTypeBadgeColor = (type: EventType) => {
    switch (type) {
      case "donation":
        return "#3182CE";
      case "volunteer":
        return "#48BB78";
      case "items":
        return "#805AD5";
      default:
        return "#718096";
    }
  };
  // Helper function to get status icon and color
  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case "active":
        return {
          icon: "🟢",
          label: "Active",
          color: "text-green-600",
        };
      case "canceled":
        return {
          icon: "🔴",
          label: "Canceled",
          color: "text-red-500",
        };
      case "completed":
        return {
          icon: "⚪",
          label: "Completed",
          color: "text-gray-500",
        };
    }
  };
  const calculateProgress = (event: any) => {
    let progress = 0;

    if (event.type === "donation") {
      progress = Math.round((event.currentAmount! / event.targetAmount!) * 100);

      return {
        progress,
        text: `$${event.currentAmount!.toLocaleString()} of $${event.targetAmount!.toLocaleString()} raised`,
      };
    } else if (event.type === "volunteer") {
      progress = Math.round(
        (event.currentVolunteers! / event.targetVolunteers!) * 100
      );

      return {
        progress,
        text: `${event.currentVolunteers} of ${event.targetVolunteers} slots filled`,
      };
    } else {
      const totalDonated = event.targetItems!.reduce(
        (total: any, item: any) => total + item.quantityDonated,
        0
      );
      const totalNeeded = event.targetItems!.reduce(
        (total: any, item: any) => total + item.quantityNeeded,
        0
      );
      const progress = Math.round((totalDonated / totalNeeded) * 100);

      return {
        progress,
        text: `${totalDonated} of ${totalNeeded} items collected`,
      };
    }
  };

  function handleViewContributions(event : any): void {
    setSelectedEvent(event)
    setIsContributionsModalOpen(true)
  }

  function handleUpdateClicked(event: any): void {
    setSelectedEvent(event);
    setIsUpdateModalOpen(true);
  }

  function handleEventUpdate(data: any): void {
    updateEvent(data._id, data);
  }

  function handleDelete(eventId: string): void {
    deleteEvent(eventId);
  }

  useEffect(() => {
    getInitialEvents({ limit: 200 });
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1A365D]">All Events</h1>
          <Button
            as={Link}
            className="bg-[#3182CE] hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition-colors"
            href="/admin/events/addEvent"
          >
            <PlusIcon className="mr-2" size={16} />
            Add Event
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search ..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Type Filter */}
          <div className="flex gap-2">
            {["all", "donation", "volunteer", "items"].map((type) => (
              <Button
                key={type}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                variant="bordered"
                onPress={() => setSelectedType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          {/* Sort Dropdown */}
          <Select
            className="max-w-[200px]"
            defaultSelectedKeys={["newest"]}
            selectedKeys={[sortBy]}
            variant="bordered"
            onChange={handleSelectionChange}
          >
            <SelectItem key="newest">Newest First</SelectItem>
            <SelectItem key="urgent">Most Urgent</SelectItem>
            <SelectItem key="ending">Ending Soonest</SelectItem>
          </Select>
        </div>
      </div>
      {filteredEvents.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Title
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Type
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Progress
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    scope="col"
                  >
                    Start Date
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    scope="col"
                  >
                    End Date
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Contributions
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Update
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event: any, index: any) => {
                  const statusInfo = getStatusIcon(event.status);
                  const typeColor = getTypeBadgeColor(event.type);
                  const progress = calculateProgress(event);

                  return (
                    <tr
                      key={event.id}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-[#F8FAFC]"
                          : "bg-[#F8FAFC] hover:bg-gray-100"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link
                          isExternal
                          className="flex gap-2 items-center"
                          href={"/event/" + event._id}
                        >
                          <span>{event.title}</span>
                          <ExternalLink size={14} />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                          style={{
                            backgroundColor: typeColor,
                          }}
                        >
                          {event.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center ${statusInfo.color}`}
                        >
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-full max-w-xs">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${progress.progress}%`,
                                  backgroundColor: typeColor,
                                }}
                              />
                            </div>
                            <span className="text-xs whitespace-nowrap">
                              {progress.progress}%
                            </span>
                          </div>
                          <span className="text-xs">{progress.text}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {event.startDate.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {event.endDate.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <Button
                          color="secondary"
                          size="sm"
                          startContent={<Eye size={15} />}
                          variant="bordered"
                          onPress={() => handleViewContributions(event)}
                        >
                          View
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                          onClick={() => handleUpdateClicked(event)}
                        >
                          <PencilIcon className="text-blue-600" size={16} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          className="p-1 rounded-full hover:bg-red-100 transition-colors"
                          onClick={() => handleDelete(event._id)}
                        >
                          <TrashIcon className="text-red-600" size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#3182CE] bg-opacity-10 flex items-center justify-center">
              <CalendarIcon className="text-[#3182CE]" size={32} />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No events found
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first event
          </p>
          <button className="bg-[#3182CE] hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center mx-auto transition-colors">
            <PlusIcon className="mr-2" size={16} />
            Add Event
          </button>
        </div>
      )}
      <UpdateEventModal
        event={selectedEvent}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleEventUpdate}
      />
      <EventContributionsModal
        event={selectedEvent}
        isOpen={isContributionsModalOpen}
        onClose={() => setIsContributionsModalOpen(false)}
      />
    </div>
  );
};
const CalendarIcon = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

export default EventsPage;
