import EventDetailsPage from "@/components/GiveHelp/EventPage/Event";
import useEventsStore from "@/store/useEventsStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EventPage = () => {
  const { event, getEvent,isLoadingEvent } = useEventsStore();
  const { id } = useParams();

  useEffect(() => {
    getEvent(id);
  }, [id]);

  return <EventDetailsPage event={event} isLoadingEvent={isLoadingEvent} />;
};

export default EventPage;
