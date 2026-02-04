import React, { cloneElement } from "react";
interface ImpactCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}
export const ImpactCard: React.FC<ImpactCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  
  return (
    <div
      className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg`}
    >
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <div
            className={`bg-gradient-to-r ${color} text-white p-2 rounded-full`}
          >
            {cloneElement(icon as React.ReactElement, {
              size: 18,
            })}
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
