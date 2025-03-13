/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";


 function EventGallery({event} : {event : any}) {
  const [selectedImage, setSelectedImage] = useState<number | null >(null);
  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev === 0 ? event.images.length - 1 : (prev as number) - 1));
    }
  };
  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev === event.images.length - 1 ? 0 : (prev as number) + 1));
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Event Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {event && event.images && event.images.map((image : string, index : number) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-xl"
            onClick={() => setSelectedImage(index)}
          >
            <img
              alt={image}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              src={image}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
        ))}
      </div>
      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={handlePrevious}
          >
            <ChevronLeft size={40} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={handleNext}
          >
            <ChevronRight size={40} />
          </button>
          <div className="max-w-5xl max-h-[80vh] mx-auto">
            <img
              alt={event.images[selectedImage]}
              className="max-h-full max-w-full object-contain"
              src={event.images[selectedImage]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EventGallery;
