import useEventsStore from "@/store/useEventsStore";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { BookmarkCheck, Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import useAuthStore from "@/store/useAuthStore";

const GiveHelp: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const {
    events,
    getInitialEvents,
    getFilterEvents,
    getMoreEvents,
    isLoading,
    isLoadingMore,
    totalEvents,
  } = useEventsStore();
  const { user } = useAuthStore();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectionChange = (e: any) => {
    setSortBy(e.target.value);
  };

  useEffect(() => {
    getInitialEvents({});
  }, []);

  useEffect(() => {
    getFilterEvents({ type: selectedType, sortBy: sortBy });
  }, [selectedType, sortBy]);

  // Filter events based on savedOnly, user's savedEvents, and searchQuery
  const filteredEvents = events.filter((event: any) => {
    // Check if the event matches the savedOnly filter (if enabled)
    const isSaved = !savedOnly || user?.savedEvents?.includes(event._id);

    // Check if the event matches the search query (title or location)
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    return isSaved && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-white" id="giveHelp">
      <div className="mx-auto">
        <div className="bg-gradient-to-b from-blue-200 to-white w-full pt-16 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="w-full text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Make a Real Impact in Your Community
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of changemakers who are creating positive change.
                Whether it&apos;s through donations, volunteering, or sharing
                resources - every action counts.
              </p>
            </div>
          </div>
        </div>
        <div className="sticky top-0 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {/* Search Bar */}
              <div className="relative w-full sm:w-1/3">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by title or location..."
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {/* Type Filter */}
              <div className="flex gap-2 w-full sm:w-1/3">
                {["all", "donation", "volunteer", "items"].map((type) => (
                  <Button
                    key={type}
                    className={`px-4 py-2 rounded-lg ${
                      selectedType === type
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    variant="bordered"
                    onPress={() => setSelectedType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              {/* Sort Dropdown */}
              <div className="flex items-center gap-3 w-full sm:w-1/3">
                <Select
                  className="max-w-[200px]"
                  defaultSelectedKeys={["newest"]}
                  selectedKeys={[sortBy]}
                  variant="bordered"
                  onChange={handleSelectionChange}
                >
                  <SelectItem key="newest">Newest First</SelectItem>
                  <SelectItem key="urgent">Most Urgent</SelectItem>
                  <SelectItem key="ending">Ending Soonest</SelectItem>
                </Select>
                {/* Conditionally render the "Saved" button */}
                {user && (
                  <Button
                    color={savedOnly ? "primary" : "default"}
                    radius="sm"
                    startContent={<BookmarkCheck />}
                    variant={savedOnly ? "flat" : "bordered"}
                    onPress={() => setSavedOnly(!savedOnly)}
                  >
                    Saved
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {isLoading ? (
           
            [...Array(5)].map((_, index) => <EventCardSkeleton key={index} />)
          ) : filteredEvents.length === 0 ? (
            
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                No Results Found
              </h2>
              <p className="text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            
            filteredEvents.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
       
        {events.length < totalEvents && filteredEvents.length > 0 && (
          <div className="text-center mt-8">
            <Button
              className="px-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              isLoading={isLoadingMore}
              onPress={() =>
                getMoreEvents({ type: selectedType, sortBy: sortBy, skip: 10 })
              }
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiveHelp;