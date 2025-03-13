import React, { useEffect, useState } from "react";
import { Contribution } from "../../config/mockData";
interface ContributionChartProps {
  contributions: Contribution[];
}
export const ContributionChart: React.FC<ContributionChartProps> = ({
  contributions,
}) => {
  const [chartData, setChartData] = useState<
    {
      type: string;
      count: number;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    // Count contributions by type
    const donationCount = contributions.filter(
      (c) => c.type === "Donation",
    ).length;
    const volunteerCount = contributions.filter(
      (c) => c.type === "Volunteer",
    ).length;
    const itemCount = contributions.filter(
      (c) => c.type === "Item Donation",
    ).length;
    // Calculate percentages
    // const total = contributions.length;

    setChartData([
      {
        type: "Donations",
        count: donationCount,
        color: "bg-blue-500",
      },
      {
        type: "Volunteer Hours",
        count: volunteerCount,
        color: "bg-green-500",
      },
      {
        type: "Item Donations",
        count: itemCount,
        color: "bg-amber-500",
      },
    ]);
  }, [contributions]);
  const maxCount = Math.max(...chartData.map((item) => item.count));

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                {item.type}
              </span>
              <span className="text-sm text-gray-500">
                {item.count} (
                {Math.round((item.count / contributions.length) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${item.color} h-4 rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                }}
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
