
import { Award, Calendar, MapPin } from "lucide-react";
 function EventHeader({event} : {event : any}) {
  return (
    <section className="relative bg-blue-700 text-white py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            `url(${event.mainImage})`,
        }}
       />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-800/50 rounded-full mb-6 backdrop-blur-sm">
            <Award className="w-5 h-5 mr-2" />
            <span>Event Completed Successfully</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {event.title}
          </h1>
          <p className="text-xl text-blue-100 mb-8 animate-fade-in-delay">
            {event.shortDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-blue-100">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{event && event.startDate && event.startDate.split("T")[0]}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{event && event.endDate && event.endDate.split("T")[0]}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventHeader;
