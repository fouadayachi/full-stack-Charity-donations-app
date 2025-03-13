
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from "lucide-react";
export function CallToAction() {
  return (
    <section className="py-10 my-8 bg-blue-50 rounded-xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Ready to Make a Difference?
        </h2>
        <div>
          <p className="text-gray-700 mb-3">Share this event:</p>
          <div className="flex justify-center gap-4">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <FacebookIcon className="text-blue-600" size={20} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <TwitterIcon className="text-blue-600" size={20} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <LinkedinIcon className="text-blue-600" size={20} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <InstagramIcon className="text-blue-600" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
