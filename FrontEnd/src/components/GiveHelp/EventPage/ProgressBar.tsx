
interface ProgressBarProps {
  percentage: number;
}
export function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${percentage}%`,
        }}
       />
    </div>
  );
}
