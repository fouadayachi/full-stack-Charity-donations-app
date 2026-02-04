import { XIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
interface FloatingBannerProps {
  onDismiss: () => void;
}
export function FloatingBanner({ onDismiss }: FloatingBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-100 p-4 transform transition-transform duration-300 ease-in-out z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-gray-700">
          Log in to save this event and track your contributions.
        </p>
        <div className="flex items-center gap-3">
        <Button
            as={Link}
            className="text-sm font-normal "
            color="primary"
            href="/login"
            variant="shadow"
          >
            Log in
          </Button>
          <button
            aria-label="Dismiss banner"
            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
            onClick={onDismiss}
          >
            <XIcon className="text-gray-500" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
