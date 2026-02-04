import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";

export function CallToAction({ event }: { event: any }) {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;
  const shareText = `Check out this event: ${event?.title}`;
  const hashtags = "CharityEvent,GoodCause";

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}&hashtags=${hashtags}`;

    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = () => {
    // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
    navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
    alert('Link copied to clipboard! You can now paste it in your Instagram post.');
  };

  const shareViaNative = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: shareText,
        url: currentUrl,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <section className="py-10 my-8 bg-blue-50 rounded-xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Ready to Make a Difference?
        </h2>
        <div>
          <p className="text-gray-700 mb-3">Share this event:</p>
          <div className="flex justify-center gap-4">
            <button 
              aria-label="Share on Facebook"
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={shareOnFacebook}
            >
              <FacebookIcon className="text-blue-600" size={20} />
            </button>
            <button 
              aria-label="Share on Twitter"
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={shareOnTwitter}
            >
              <TwitterIcon className="text-blue-600" size={20} />
            </button>
            <button 
              aria-label="Share on LinkedIn"
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={shareOnLinkedIn}
            >
              <LinkedinIcon className="text-blue-600" size={20} />
            </button>
            <button 
              aria-label="Share on Instagram"
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={shareOnInstagram}
            >
              <InstagramIcon className="text-blue-600" size={20} />
            </button>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            onClick={shareViaNative}
          >
            Share via other apps
          </button>
        </div>
      </div>
    </section>
  );
}