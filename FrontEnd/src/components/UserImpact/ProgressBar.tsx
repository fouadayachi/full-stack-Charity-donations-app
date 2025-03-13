import React from "react";
interface ProgressBarProps {
  progress: number;
  bgColor?: string;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  bgColor = "bg-blue-500",
}) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${bgColor} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{
          width: `${progress}%`,
        }}
       />
    </div>
  );
};
