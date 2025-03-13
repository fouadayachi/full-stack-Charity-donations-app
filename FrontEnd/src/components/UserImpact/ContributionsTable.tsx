import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import React from "react";
interface Contribution {
  _id: string;
  event: any;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  items?: Object;
  confirmed: boolean;
  type: string;
}
interface ContributionsTableProps {
  contributions: Contribution[];
  filterType: string;
  setFilterType: (type: string) => void;
  status: string;
  setStatus: (status: string) => void;
  filterTime: string;
  setFilterTime: (time: string) => void;
}
export const ContributionsTable: React.FC<ContributionsTableProps> = ({
  contributions,
  filterType,
  setFilterType,
  status,
  setStatus,
  filterTime,
  setFilterTime,
}) => {
  const dateChange = (date: string) => {
    const newDate = new Date(date);

    // Step 2: Format the date
    const formattedDate = newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return formattedDate;
  };

  const countItems = (items: any) => {
    let num = 0;

    for (let item of items) {
      num += item.quantityDonated;
    }

    return num;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
          <div className="flex flex-col md:flex-row md:items-center  gap-3">
            <span className="text-sm font-medium text-gray-700 md:mr-2">
              Type:
            </span>
            <div className="flex flex-wrap gap-2">
              {["All", "Donation", "Volunteer", "Items"].map((type) => (
                <Button
                  key={type}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filterType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  variant="bordered"
                  onPress={() => setFilterType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex items-center gap-2">
              {["All", "Confirmed", "Pending"].map((s) => (
                <Button
                  key={s}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    status === s
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  variant="bordered"
                  onPress={() => setStatus(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <Select
            className="max-w-[200px]"
            defaultSelectedKeys={["newest"]}
            label="Period : "
            labelPlacement="outside-left"
            selectedKeys={[filterTime]}
            size="md"
            variant="bordered"
            onChange={(e) => setFilterTime(e.target.value)}
          >
            <SelectItem key="All Time">All Time</SelectItem>
            <SelectItem key="This Month">This Month</SelectItem>
            <SelectItem key="This Year">This Year</SelectItem>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Event
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Amount/Quantity
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contributions.map((contribution, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors duration-150`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dateChange(contribution.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contribution.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer ">
                  <Link className="hover:underline hover:text-blue-500" color="foreground" href={"/event/" + contribution.event._id} size="sm">{contribution.event.title}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contribution.type === "Donation"
                    ? "$ " + contribution.amount
                    : contribution.type === "Volunteer"
                    ? (contribution.event.volunteerHours || 4) + " Hours"
                    : countItems(contribution.items) + " Items"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contribution.confirmed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {contribution.confirmed === true ? "Confirmed" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contributions.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          No contributions found matching your filters.
        </div>
      )}
    </div>
  );
};
