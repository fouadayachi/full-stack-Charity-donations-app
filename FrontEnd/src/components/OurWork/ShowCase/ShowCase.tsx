import useShowCases from "@/store/useShowCaseStore";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AchievementsShowcase() {
  const {
    isLoading,
    showCases,
    getShowCases,
    totalShowCases,
    isLoadingMore,
    getMoreShowCases,
  } = useShowCases();
  const navigate = useNavigate();
  const handleReadMore = (id : any) => {
    navigate(`/showcase/${id}`);
  };

  useEffect(() => {
    getShowCases();
  }, []);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Key Achievements
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {isLoading
            ? [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Image Skeleton */}
                  <div className="relative h-48 overflow-hidden">
                    <Skeleton className="w-full h-full rounded-none">
                      <div className="w-full h-full bg-gray-200" />
                    </Skeleton>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-6">
                    {/* Title Skeleton */}
                    <Skeleton className="rounded-lg mb-2">
                      <div className="h-6 w-3/4 bg-gray-300" />
                    </Skeleton>

                    {/* Description Skeleton */}
                    <Skeleton className="rounded-lg mb-4">
                      <div className="h-4 w-full bg-gray-300" />
                    </Skeleton>
                    <Skeleton className="rounded-lg mb-4">
                      <div className="h-4 w-2/3 bg-gray-300" />
                    </Skeleton>

                    {/* Button Skeleton */}
                    <div className="flex items-center justify-end">
                      <Skeleton className="rounded-lg">
                        <Button
                          disabled
                          className="font-medium inline-flex items-center transition-colors"
                          color="primary"
                        >
                          Learn More
                        </Button>
                      </Skeleton>
                    </div>
                  </div>
                </div>
              ))
            : showCases &&
              showCases.map((achievement: any, index: any) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-900/40 transition-colors z-10" />
                    <img
                      alt={achievement.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      src={achievement.mainImage}
                    />
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors hover:underline cursor-pointer">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {achievement.shortDescription}
                    </p>

                    {/* This div will stick to the bottom */}
                    <div className="flex items-end justify-end">
                      <Button
                        className="font-medium inline-flex items-center transition-colors"
                        color="primary"
                        onPress={() => handleReadMore(achievement._id)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {showCases.length < totalShowCases && (
          <div className="text-center mt-8">
            <Button
              className="px-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              isLoading={isLoadingMore}
              onPress={() => getMoreShowCases({ skip: 3 })}
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
