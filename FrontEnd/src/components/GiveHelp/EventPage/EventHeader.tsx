import { Button } from "@heroui/button";
import { Share2Icon, BookmarkIcon } from "lucide-react";
interface EventHeaderProps {
  title: string;
  description: string;
  mainImage: string;
  ctaText: string;
  onCtaClick?: () => void
}
export function EventHeader({
  title,
  description,
  mainImage,
  ctaText,
  onCtaClick
}: EventHeaderProps) {
  return (
    <header className="relative w-full">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/20 to-white z-0" />
      <div className="container mx-auto px-4 pt-8 pb-4 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            {title}
          </h1>
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <Share2Icon className="text-blue-600" size={20} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <BookmarkIcon className="text-blue-600" size={20} />
            </button>
          </div>
        </div>
        <p className="text-xl text-gray-700 mb-6">{description}</p>
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full mb-8 overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
          <img
            alt={title}
            className="w-full h-full object-cover"
            src={mainImage}
          />
          <div className="absolute bottom-0 left-0 w-full p-6 z-20">
            <Button
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg shadow-lg transition-colors"
              onPress={onCtaClick}
              
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
