import {Skeleton} from "@heroui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row overflow-hidden">
        {/* Image Section */}
        <div className="md:w-1/3">
          <Skeleton className="w-full h-48 md:h-full rounded-none" />
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start">
            {/* Title and Description */}
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
              <Skeleton className="h-4 w-full mb-4 rounded-lg" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>

          {/* Metadata and Action Button */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;