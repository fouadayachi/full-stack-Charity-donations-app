import { Skeleton } from "@heroui/skeleton";

export function ShowCaseSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Header Skeleton */}
        <div className="relative bg-blue-700 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Skeleton className="inline-block w-48 h-8 rounded-full mb-6" />
              <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
              <div className="flex flex-wrap justify-center gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-5 h-5 mr-2 rounded-full" />
                    <Skeleton className="w-24 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Overview Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Achievements Skeleton */}
            <div className="bg-gray-50 rounded-xl p-6">
              <Skeleton className="h-8 w-1/4 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="w-6 h-6 rounded-full mr-3" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}