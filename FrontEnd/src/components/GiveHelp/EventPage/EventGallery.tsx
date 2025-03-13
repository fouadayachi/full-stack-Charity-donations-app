/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import  { useState } from "react";
import { XIcon } from "lucide-react";
interface EventGalleryProps {
  images: string[];
}
export function EventGallery({ images }: EventGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const openLightbox = (image: string) => {
    setSelectedImage(image);
  };
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section className="py-8 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Event Gallery</h2>
      {images.length === 0 ? (
        <p className="text-gray-500 italic">
          No additional images available for this event.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="h-48 rounded-lg overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(image)}
            >
              <img
                alt={`Event image ${index + 1}`}
                className="w-full h-full object-cover"
                src={image}
              />
            </div>
          ))}
        </div>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            <XIcon className="text-white" size={24} />
          </button>
          <img
            alt="Enlarged event image"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            src={selectedImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
