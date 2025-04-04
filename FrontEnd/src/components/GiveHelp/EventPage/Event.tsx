import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import { CallToAction } from "./CallToAction";
import { DonateItemsSection } from "./DonateItemsSection";
import { DonationSection } from "./DonationSection";
import { EventDetails } from "./EventDetails";
import { EventGallery } from "./EventGallery";
import { EventHeader } from "./EventHeader";
import { VolunteerSection } from "./VolunteerSection";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { FloatingBanner } from "./FloatingBanner";
import { EventSkeleton } from "./EventSkeleton";
import useEventsStore from "@/store/useEventsStore";
export interface Event {
  _id?: string;
  title: string;
  type: "donation" | "volunteer" | "items";
  shortDescription: string;
  longDescription: string;
  startDate: Date;
  endDate: Date;
  location: string;
  mainImage: string;
  images: string[];
  targetAmount?: number;
  currentAmount?: number;
  targetVolunteers?: number;
  currentVolunteers?: number;
  targetItems?: Array<{
    name: string;
    quantityNeeded: number;
    quantityDonated: number;
  }>;
}
interface EventDetailsPageProps {
  event: Event;
  isLoadingEvent: boolean;
}
function EventDetailsPage({ event, isLoadingEvent }: EventDetailsPageProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { saveEvent, unsaveEvent } = useEventsStore();
  const [showBanner, setShowBanner] = useState(user ? false : true);
  const handleBannerDismiss = () => {
    setShowBanner(false);
  };

  const scrollToSection = () => {
    let sectionId = "";

    switch (event?.type) {
      case "donation":
        sectionId = "donation-section";
        break;
      case "volunteer":
        sectionId = "volunteer-section";
        break;
      case "items":
        sectionId = "donate-items-section";
        break;
      default:
        return; // Do nothing if the event type is invalid
    }

    const sectionElement = document.getElementById(sectionId);

    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Format dates for display
  const formatDate = (dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // This will show AM/PM
    };

    const date = dateString ? new Date(dateString) : null;

    // Return formatted date or an empty string if date is invalid
    return date ? date.toLocaleDateString(undefined, options) : "";
  };
  const startDate = formatDate(event && event.startDate);
  const endDate = formatDate(event && event.endDate);
  // Get CTA button text based on event type
  const getCtaText = () => {
    switch (event?.type) {
      case "donation":
        return "Donate Now";
      case "volunteer":
        return "Volunteer Now";
      case "items":
        return "Donate Items";
      default:
        return "Get Involved";
    }
  };

  const handleShare = () => {
    const eventUrl = `${window.location.origin}/event/${event._id}`;

    navigator.clipboard.writeText(eventUrl).then(() => {
      console.log("Link copied to clipboard!");
    });
  };

  const toggleSaveEvent = async () => {
    const isSaved = user.savedEvents.includes(event._id);

    if (isSaved) {
      await unsaveEvent({ eventId : event._id }); // Unsave the event
    } else {
      await saveEvent({ eventId : event._id }); // Save the event
    }
  };

  useEffect(() => {
    // Scroll to the top of the page when the location changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-full bg-white">
      {showBanner && <FloatingBanner onDismiss={handleBannerDismiss} />}
      <HeroUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className=" w-full" justify="center">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link href="/">
              <img alt="logo" className="w-[180px] h-[50px]" src="/logo.png" />
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </HeroUINavbar>
      {isLoadingEvent ? (
        <EventSkeleton />
      ) : (
        <>
          <EventHeader
          ctaText={getCtaText()}
            description={event?.shortDescription}
            eventId={event?._id}
            mainImage={event?.mainImage}
            title={event?.title}
            onCtaClick={scrollToSection}
            onSave={toggleSaveEvent}
            onShare={handleShare}
          />
          <div className="container mx-auto px-4 py-8">
            <EventDetails
              endDate={endDate}
              event={event}
              startDate={startDate}
            />
            <EventGallery images={event?.images || []} />
            <CallToAction event={event}/>
            {event?.type === "donation" && (
              <DonationSection
                eventId={event._id}
                id="donation-section"
                user={user}
              />
            )}
            {event?.type === "volunteer" && (
              <VolunteerSection
                eventId={event._id}
                id="volunteer-section"
                user={user}
              />
            )}
            {event?.type === "items" && (
              <DonateItemsSection
                eventId={event._id}
                id="donate-items-section"
                items={event?.targetItems || []}
                user={user}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EventDetailsPage;
