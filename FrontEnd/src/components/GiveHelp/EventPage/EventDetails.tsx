import { MapPinIcon, CalendarIcon } from "lucide-react";
import { Event } from "./Event";
import { ProgressBar } from "./ProgressBar";
import { ItemsList } from "./ItemsList";
interface EventDetailsProps {
  event: Event;
  startDate: string;
  endDate: string;
}
export function EventDetails({ event, startDate, endDate }: EventDetailsProps) {
  let progressPercentage = 0;
  let totalNeeded = 0;
  let totalDonated = 0;
  const calculateDonationProgress = () => {
    const progress = (event?.currentAmount! / event?.targetAmount!) * 100;

    progressPercentage = progress;
  };

  const calculateVolunteerProgress = () => {
    const progress = (event?.currentVolunteers! / event?.targetVolunteers!) * 100;

    progressPercentage = progress;
  };

  if (event?.type === "items") {
    totalDonated = event?.targetItems!.reduce(
      (total, item) => total + item.quantityDonated,
      0
    );
    totalNeeded = event?.targetItems!.reduce(
      (total, item) => total + item.quantityNeeded,
      0
    );
  }

  // Calculate progress for item event?s
  const calculateItemsProgress = () => {
    const progress = (totalDonated / totalNeeded) * 100;

    progressPercentage = progress;
  };

  switch (event?.type) {
    case "donation":
      calculateDonationProgress();
      break;
    case "volunteer":
      calculateVolunteerProgress();
      break;
    case "items":
      calculateItemsProgress();
      break;
  }

  return (
    <section className="py-8 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Event Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Progress
            </h3>
            <ProgressBar percentage={progressPercentage} />

            <p className="mt-2 text-gray-700">
              <span className="font-medium">
                {event?.type === "donation"
                  ? `${event?.currentAmount!} of ${event?.targetAmount} raised`
                  : event?.type === "volunteer"
                  ? `${event?.currentVolunteers!} of ${
                      event?.targetVolunteers
                    } slots filled`
                  : `${totalDonated} of ${totalNeeded} raised`}
              </span>{" "}
            </p>
          </div>
          {event?.type === "items" && event?.targetItems && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Items Needed
              </h3>
              <ItemsList items={event?.targetItems} />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-start gap-2 mb-4">
            <MapPinIcon
              className="text-blue-600 mt-1 flex-shrink-0"
              size={20}
            />
            <p className="text-gray-700">{event?.location}</p>
          </div>
          <div className="flex items-start gap-2 mb-6">
            <CalendarIcon
              className="text-blue-600 mt-1 flex-shrink-0"
              size={20}
            />
            <div>
              <p className="text-gray-700">Start: {startDate}</p>
              <p className="text-gray-700">End: {endDate}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              About This Event
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {event?.longDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
