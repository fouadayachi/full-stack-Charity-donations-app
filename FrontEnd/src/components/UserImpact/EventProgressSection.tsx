import React, { useEffect, useState } from "react";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Navigation as Nav } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface Contribution {
  _id: string;
  event: any;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  items?: Object;
  status: string;
  type: string;
}
interface EventProgressSectionProps {
  events: string[];
  contributions: Contribution[];
  selectedEvent: string | null;
  setSelectedEvent: (event: string | null) => void;
}
export const EventProgressSection: React.FC<EventProgressSectionProps> = ({
  events,
  contributions,
  selectedEvent,
  setSelectedEvent,
}) => {
  const [eventDetails, setEventDetails] = useState<{
    name: string;
    progress: number;
    totalAmount: string;
    contributionsCount: number;
    type: string;
    color: string;
    text : string;
  } | null>(null);
  const countItems = (items: any) => {
    let num = 0;

    for (let item of items) {
      num += item.quantityDonated;
    }

    return num;
  };

  const calculateProgress = (type: string, event: any) => {
    let progress = 0;

    if (type === "Donation") {
      progress = Math.round((event.currentAmount! / event.targetAmount!) * 100);

      return {
        progress,
        text: `$${event.currentAmount!.toLocaleString()} of $${event.targetAmount!.toLocaleString()} raised`,
      };
    } else if (type === "Volunteer") {
      progress = Math.round((event.currentVolunteers! / event.targetVolunteers!) * 100);

      return {
        progress,
        text: `${event.currentVolunteers} of ${event.targetVolunteers} slots filled`,
      };
    }

    else {
      const totalDonated = event.targetItems!.reduce(
        (total : any, item : any) => total + item.quantityDonated,
        0
      );
      const totalNeeded = event.targetItems!.reduce(
        (total : any, item : any) => total + item.quantityNeeded,
        0
      );
      const progress = Math.round((totalDonated / totalNeeded) * 100);
  
      return {
        progress,
        text: `${totalDonated} of ${totalNeeded} items collected`
      };
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      const eventContributions = contributions.filter(
        (c) => c.event._id === selectedEvent
      );

      if (eventContributions.length > 0) {
        const firstContribution = eventContributions[0];
        const type = firstContribution.type;

        let totalAmount = "";

        if (type === "Donation") {
          const total = eventContributions.reduce(
            (sum, c) => sum + (c.amount && c.status === "confirmed" ? c.amount : 0),
            0
          );

          totalAmount = `$${total}`;
        } else if (type === "Volunteer") {
          const total = eventContributions.reduce(
            (sum, c) =>
              sum +
              (c.event.volunteerHours && c.status === "confirmed"
                ? parseInt(c.event.volunteerHours)
                : 0),
            0
          );

          totalAmount = `${total} Hours`;
        } else {
          const total = eventContributions.reduce(
            (sum, c) =>
              sum +
              (c.items && c.status === "confirmed" ? countItems(c.items) : 0),
            0
          );

          totalAmount = `${total} Items`;
        }
        const info = calculateProgress(firstContribution.type,firstContribution.event);
        const progress = info.progress;
        const text = info.text;
        
        let color = "";

        switch (type) {
          case "Donation":
            color = "bg-blue-500";
            break;
          case "Volunteer":
            color = "bg-green-500";
            break;
          case "Item Donation":
            color = "bg-amber-500";
            break;
          default:
            color = "bg-gray-500";
        }
        let counter = 0;

        for (let event of eventContributions) {
          if (event.status === "confirmed") {
            counter++;
          }
        }
        setEventDetails({
          name: firstContribution.event.title,
          progress,
          totalAmount,
          contributionsCount: counter,
          type,
          color,
          text
        });
      }
    }
  }, [selectedEvent, contributions]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Event List */}
      <div className="md:w-1/3">
        <h3 className="text-lg font-medium mb-3">Select an Event</h3>
        <div className="overflow-y-auto max-h-80 pr-2">
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                    selectedEvent === event
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="font-medium">
                    {
                      contributions.find((c) => c.event._id === event)?.event
                        .title
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    {contributions.find((c) => c.event._id === event)?.type}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Event Details */}
      <div className="md:w-2/3 bg-gray-50 p-5 rounded-lg relative">
        {selectedEvent && eventDetails ? (
          <div>
            <h3 className="text-xl font-semibold mb-2">{eventDetails.name}</h3>
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Progress</div>
              <div className="mb-2">
                <ProgressBar
                  bgColor={eventDetails.color}
                  progress={eventDetails.progress}
                />
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span>{eventDetails.text}</span>
                <span>{eventDetails.progress}% Complete</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium">{eventDetails.type}</div>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="font-medium">{eventDetails.totalAmount}</div>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">Contributions</div>
                <div className="font-medium">
                  {eventDetails.contributionsCount}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {eventDetails.type === "Donation" ? (
                <p>
                  Your financial contribution is making a difference! Keep track
                  of this event&apos;s funding progress.
                </p>
              ) : eventDetails.type === "Volunteer" ? (
                <p>
                  Your volunteer hours are helping this event succeed. Thank you
                  for your time and dedication!
                </p>
              ) : (
                <p>
                  Your donated items are supporting this cause. Every
                  contribution matters!
                </p>
              )}
            </div>
            <Button isIconOnly as={Link} className="absolute right-4 top-4" href={"/event/" + selectedEvent} size="sm" variant="light"><Nav /></Button>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Select an event to view its progress details</p>
          </div>
        )}
      </div>
    </div>
  );
};
