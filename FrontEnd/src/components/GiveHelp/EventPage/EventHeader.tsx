import { Button } from "@heroui/button";
import {  BookmarkIcon, Share2 } from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover';
import useAuthStore from "@/store/useAuthStore";
import { Link } from "@heroui/link";
interface EventHeaderProps {
  eventId : string | undefined;
  title: string;
  description: string;
  mainImage: string;
  ctaText: string;
  onCtaClick?: () => void;
  onShare : () => void
  onSave : () => void
}
export function EventHeader({
  eventId,
  title,
  description,
  mainImage,
  ctaText,
  onCtaClick,
  onShare,
  onSave
}: EventHeaderProps) {
  const {user} = useAuthStore();

  return (
    <header className="relative w-full">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/20 to-white z-0" />
      <div className="container mx-auto px-4 pt-8 pb-4 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            {title}
          </h1>
          <div className="flex gap-2">
            <Popover placement="bottom">
                <PopoverTrigger>
                  <Button
                    isIconOnly
                    className="p-2 bg-transparent hover:bg-gray-100 rounded-full"
                    onPress={() => onShare()}
                  >
                    <Share2 className="text-primary-500" size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2 text-center">
                    <p className="text-sm text-gray-700">
                      Link copied to clipboard!
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
              {user ? (
                <Button
                  isIconOnly
                  className="p-2 bg-transparent hover:bg-gray-100 rounded-full"
                  onPress={() => onSave()}
                >
                  {user?.savedEvents.includes(eventId) ? (
                    <BookmarkIcon
                      className="text-primary-500"
                      fill="#006FEE"
                      size={20}
                    />
                  ) : (
                    <BookmarkIcon className="text-primary-500" size={20} />
                  )}
                </Button>
              ) : (
                <Popover placement="left">
                  <PopoverTrigger>
                    <Button
                      isIconOnly
                      className="p-2  bg-transparent hover:bg-gray-100 rounded-full"
                    >
                      <BookmarkIcon className="text-primary-500" size={20} />
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
