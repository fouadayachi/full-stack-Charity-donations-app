import { Skeleton } from "@heroui/skeleton";

export function EventSkeleton() {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-3/4 mb-4 rounded" />
          <Skeleton className="h-6 w-full mb-6 rounded" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
        
        {/* Details Skeleton */}
        <div className="py-8 border-b border-gray-200">
          <Skeleton className="h-8 w-1/3 mb-6 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-6 w-1/4 mb-2 rounded" />
              <Skeleton className="h-4 w-full mb-4 rounded" />
              <Skeleton className="h-4 w-3/4 mb-6 rounded" />
              <Skeleton className="h-6 w-1/4 mb-2 rounded" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-3/4 mb-1 rounded" />
                    <Skeleton className="h-2 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-start gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
              <div className="flex items-start gap-2 mb-6">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-1/4 mb-2 rounded" />
                <Skeleton className="h-4 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Gallery Skeleton */}
        <div className="py-8 border-b border-gray-200">
          <Skeleton className="h-8 w-1/3 mb-6 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* CTA Skeleton */}
        <div className="py-10 my-8 bg-blue-50 rounded-xl">
          <Skeleton className="h-8 w-1/2 mx-auto mb-6 rounded" />
          <Skeleton className="h-4 w-1/3 mx-auto mb-3 rounded" />
          <div className="flex justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Form Section Skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-md my-8">
          <Skeleton className="h-8 w-1/3 mb-6 rounded" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-1/4 rounded" />
                <Skeleton className="h-12 w-full rounded" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full mt-6 rounded" />
        </div>
      </div>
    </div>
  );
}