import { siteConfig } from "@/config/site";
import {
  ArrowUp,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Youtube,
} from "lucide-react";
import NewsletterForm from "./NewsletterForm";
export const AboutUs = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#003366] text-gray-100 w-full pt-12 pb-6" id="aboutUs">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Who We Are</h3>
            <p className="text-gray-300 leading-relaxed">
              We are a non-profit organization dedicated to helping
              underprivileged communities access education, healthcare, and
              basic necessities. Since 2010, we have impacted over 50,000 lives
              through your generous donations.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {siteConfig.footerItems.map(
                (item) => (
                  <li key={item.label} className=" list-none">
                    <a
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                      href={item.href}
                      onClick={item.scroll}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              )}
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-6">
                {[FacebookIcon, TwitterIcon, InstagramIcon, Youtube].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      aria-label={`Visit our ${Icon.name}`}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                      href="#a"
                    >
                      <Icon size={24} />
                    </a>
                  )
                )}
              </div>
            </div>
            <NewsletterForm />
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">
          <p>© 2025 Charity Name. All Rights Reserved.</p>
        </div>
      </div>
      {/* Back to Top Button */}
      <button
        aria-label="Back to top"
        className="fixed bottom-8 right-8 bg-yellow-400 p-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-200"
        onClick={scrollToTop}
      >
        <ArrowUp className="text-[#003366]" size={24} />
      </button>
    </footer>
  );
};

export default AboutUs;
