import React, { useEffect, useMemo, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  DollarSignIcon,
  ClockIcon,
  PackageIcon,
  TrendingUpIcon,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
interface ImpactMetrics {
  totalDonations: number;
  totalHours: number;
  totalItems: number;
  totalContributions: number;
}
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  impact: ImpactMetrics;
  createdAt: string;
}
type SortField =
  | "name"
  | "email"
  | "donations"
  | "hours"
  | "items"
  | "contributions"
  | "joinDate";
type SortDirection = "asc" | "desc";
type FilterType = "all" | "email" | "phone" | "address";
export const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const { getAllUsers, users } = useAuthStore();
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const fullAddress = user.address.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      switch (filterType) {
        case "email":
          return user.email.toLowerCase().includes(searchLower);
        case "phone":
          return user.phone.includes(searchQuery);
        case "address":
          return fullAddress.includes(searchLower);
        case "all":
        default:
          return (
            fullName.includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.phone.includes(searchQuery) ||
            fullAddress.includes(searchLower)
          );
      }
    });
  }, [users, searchQuery, filterType]);
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "donations":
          aValue = a.impact.totalDonations;
          bValue = b.impact.totalDonations;
          break;
        case "hours":
          aValue = a.impact.totalHours;
          bValue = b.impact.totalHours;
          break;
        case "items":
          aValue = a.impact.totalItems;
          bValue = b.impact.totalItems;
          break;
        case "contributions":
          aValue = a.impact.totalContributions;
          bValue = b.impact.totalContributions;
          break;
        case "joinDate":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
      }
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredUsers, sortField, sortDirection]);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsers, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1A365D]">
            User Impact Dashboard
          </h1>
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
              <SelectItem key="email">Email</SelectItem>
              <SelectItem key="phone">Phone</SelectItem>
              <SelectItem key="address">Address</SelectItem>
            </Select>
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" size={16} />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
              placeholder="Search users..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      {paginatedUsers.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    scope="col"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      <span>Basic Info</span>
                      {sortField === "name" ? (
                        sortDirection === "asc" ? (
                          <ChevronUpIcon className="ml-1" size={16} />
                        ) : (
                          <ChevronDownIcon className="ml-1" size={16} />
                        )
                      ) : (
                        <FilterIcon className="ml-1 text-gray-300" size={16} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    scope="col"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      <span>Contact</span>
                      {sortField === "email" ? (
                        sortDirection === "asc" ? (
                          <ChevronUpIcon className="ml-1" size={16} />
                        ) : (
                          <ChevronDownIcon className="ml-1" size={16} />
                        )
                      ) : (
                        <FilterIcon className="ml-1 text-gray-300" size={16} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    scope="col"
                    onClick={() => handleSort("donations")}
                  >
                    <div className="flex items-center">
                      <span>Donations</span>
                      {sortField === "donations" ? (
                        sortDirection === "asc" ? (
                          <ChevronUpIcon className="ml-1" size={16} />
                        ) : (
                          <ChevronDownIcon className="ml-1" size={16} />
                        )
                      ) : (
                        <FilterIcon className="ml-1 text-gray-300" size={16} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    scope="col"
                    onClick={() => handleSort("hours")}
                  >
                    <div className="flex items-center">
                      <span>Hours</span>
                      {sortField === "hours" ? (
                        sortDirection === "asc" ? (
                          <ChevronUpIcon className="ml-1" size={16} />
                        ) : (
                          <ChevronDownIcon className="ml-1" size={16} />
                        )
                      ) : (
                        <FilterIcon className="ml-1 text-gray-300" size={16} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    scope="col"
                    onClick={() => handleSort("items")}
                  >
                    <div className="flex items-center">
                      <span>Items</span>
                      {sortField === "items" ? (
                        sortDirection === "asc" ? (
                          <ChevronUpIcon className="ml-1" size={16} />
                        ) : (
                          <ChevronDownIcon className="ml-1" size={16} />
                        )
                      ) : (
                        <FilterIcon className="ml-1 text-gray-300" size={16} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    scope="col"
                    onClick={() => handleSort("contributions")}
                  >
                    <div className="flex items-center">
                      <span>Contributions</span>
                      {sortField === "contributions" ? (
                        sortDirection === "asc" ? (
                          <ChevronUpIcon className="ml-1" size={16} />
                        ) : (
                          <ChevronDownIcon className="ml-1" size={16} />
                        )
                      ) : (
                        <FilterIcon className="ml-1 text-gray-300" size={16} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                    scope="col"
                    onClick={() => handleSort("joinDate")}
                  >
                    <div className="flex items-center">
                      <span>Join Date</span>
                      {sortField === "joinDate" ? (
                        sortDirection === "asc" ? (
                          <ChevronUpIcon className="ml-1" size={16} />
                        ) : (
                          <ChevronDownIcon className="ml-1" size={16} />
                        )
                      ) : (
                        <FilterIcon className="ml-1 text-gray-300" size={16} />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user, index) => {
                  return (
                    <tr
                      key={user._id}
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
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 md:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 hidden md:block">
                          <div className="flex items-center">
                            <MailIcon
                              className="mr-1 text-gray-400"
                              size={14}
                            />
                            {user.email}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <PhoneIcon
                              className="mr-1 text-gray-400"
                              size={14}
                            />
                            {user.phone}
                          </div>
                        </div>
                        <div
                          className="text-sm text-gray-500 mt-1 truncate max-w-[200px] group relative"
                          title={user.address}
                        >
                          <div className="flex items-center">
                            <MapPinIcon
                              className="mr-1 text-gray-400 flex-shrink-0"
                              size={14}
                            />
                            {user.address}
                          </div>
                          <div className="absolute left-0 top-full mt-1 z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64">
                            {user.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSignIcon
                            className="mr-1 text-green-500"
                            size={16}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(user.impact.totalDonations)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center">
                          <ClockIcon className="mr-1 text-blue-500" size={16} />
                          <span className="text-sm font-medium text-gray-900">
                            {user.impact.totalHours}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center">
                          <PackageIcon
                            className="mr-1 text-purple-500"
                            size={16}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {user.impact.totalItems}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
                          <div className="flex items-center">
                            <TrendingUpIcon
                              className="mr-1 text-blue-600"
                              size={16}
                            />
                            <span className="text-sm font-bold text-blue-800">
                              {user.impact.totalContributions}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Total contributions
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Previous
              </button>
              <button
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, sortedUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedUsers.length}</span>{" "}
                  users
                </p>
              </div>
              <div>
                <nav
                  aria-label="Pagination"
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                >
                  <button
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#3182CE] bg-opacity-10 flex items-center justify-center">
              <UserIcon className="text-[#3182CE]" size={32} />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No users found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};
