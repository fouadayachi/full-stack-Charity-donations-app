/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import useAuthStore from "@/store/useAuthStore";
import useEventsStore from "@/store/useEventsStore";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Bookmark, Calendar, MapPin, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

interface Event {
  _id: string;
  type: "donation" | "volunteer" | "items";
  mainImage: string;
  title: string;
  shortDescription: string;
  location: string;
  endDate: string;
  startDate: string;
  currentAmount?: number;
  targetAmount?: number;
  currentVolunteers?: number;
  targetVolunteers?: number;
  targetItems?: {
    name: string;
    quantityDonated: number;
    quantityNeeded: number;
  }[];
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { saveEvent, unsaveEvent } = useEventsStore();
  const { user } = useAuthStore();
  let progressData: {
    progress: number;
    text: string;
    items?: { name: string; donated: number; needed: number }[];
  } | null = null;
  const navigate = useNavigate();
  const handleEventDetails = (id : any) => {
    navigate(`/event/${id}`);
  };

  // Calculate progress for donation posts
  const calculateDonationProgress = (post: Event) => {
    const progress = (post.currentAmount! / post.targetAmount!) * 100;

    return {
      progress,
      text: `$${post.currentAmount!.toLocaleString()} of $${post.targetAmount!.toLocaleString()} raised`,
    };
  };

  // Calculate progress for volunteer posts
  const calculateVolunteerProgress = (post: Event) => {
    const progress = (post.currentVolunteers! / post.targetVolunteers!) * 100;

    return {
      progress,
      text: `${post.currentVolunteers} of ${post.targetVolunteers} slots filled`,
    };
  };

  // Calculate progress for item posts
  const calculateItemsProgress = (post: Event) => {
    const totalDonated = post.targetItems!.reduce(
      (total, item) => total + item.quantityDonated,
      0
    );
    const totalNeeded = post.targetItems!.reduce(
      (total, item) => total + item.quantityNeeded,
      0
    );
    const progress = (totalDonated / totalNeeded) * 100;

    return {
      progress,
      text: `${totalDonated} of ${totalNeeded} items collected`,
      items: post.targetItems!.map((item) => ({
        name: item.name,
        donated: item.quantityDonated,
        needed: item.quantityNeeded,
      })),
    };
  };

  const toggleSaveEvent = async (eventId: any) => {
    const isSaved = user.savedEvents.includes(eventId);

    if (isSaved) {
      await unsaveEvent({ eventId }); // Unsave the event
    } else {
      await saveEvent({ eventId }); // Save the event
    }
  };

  switch (event.type) {
    case "donation":
      progressData = calculateDonationProgress(event);
      break;
    case "volunteer":
      progressData = calculateVolunteerProgress(event);
      break;
    case "items":
      progressData = calculateItemsProgress(event);
      break;
    default:
      progressData = null;
  }

  return (
    <div
      key={event._id}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col lg:flex-row overflow-hidden relative">
        <div className="lg:w-1/3 overflow-hidden ">
          <Image
            isZoomed
            alt={event.title}
            className="w-full aspect-video object-cover cursor-pointer"
            src={event.mainImage}
          />
        </div>
        <div className="px-6 py-3 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2 hover:underline cursor-pointer" onClick={() =>  handleEventDetails(event._id)}>
                {event.title}
              </h3>
              <p className="text-gray-600 mb-4">{event.shortDescription}</p>
            </div>
            <div className="  z-20 absolute right-3 top-3 md:flex md:static gap-2">
              <Button
                isIconOnly
                className="p-2  bg-transparent hover:bg-gray-100  rounded-full"
              >
                <Share2 className="text-primary-500" size={20} />
              </Button>
              {user ? (
                <Button
                  isIconOnly
                  className="p-2 bg-transparent hover:bg-gray-100 rounded-full"
                  onPress={() => toggleSaveEvent(event._id)}
                >
                  {user?.savedEvents.includes(event._id) ? (
                    <Bookmark
                      className="text-primary-500"
                      fill="#006FEE"
                      size={20}
                    />
                  ) : (
                    <Bookmark className="text-primary-500" size={20} />
                  )}
                </Button>
              ) : (
                <Popover placement="left">
                  <PopoverTrigger>
                    <Button
                      isIconOnly
                      className="p-2  bg-transparent hover:bg-gray-100 rounded-full"
                    >
                      <Bookmark className="text-primary-500" size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 space-y-2 text-center">
                      <div className="text-small font-bold">
                        You need to login to save events
                      </div>
                      <Button
                        as={Link}
                        className="text-sm font-normal "
                        color="primary"
                        href="/login"
                        variant="shadow"
                      >
                        Log in
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mb-4">
            {progressData && (
              <ProgressBar
                progress={progressData.progress}
                text={progressData.text}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-col  gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {event.location}
              </span>
              <div className="flex gap-4 items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Started on {event.startDate.split("T")[0]}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Ends on {event.endDate.split("T")[0]}
              </span>
              </div>
            </div>
            <button className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" onClick={() =>  handleEventDetails(event._id)}>
              {event.type === "donation" && "Donate Now"}
              {event.type === "volunteer" && "Volunteer Now"}
              {event.type === "items" && "Donate Items"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
