
import AboutUs from "@/components/AboutUs/AboutUs";
import ContactUs from "@/components/ContactUs/ContactUs";
import GiveHelp from "@/components/GiveHelp/GiveHelp";
import HeroSection from "@/components/hero";
import OurWork from "@/components/OurWork/OurWork";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="w-full min-h-screen bg-gray-100">
        <HeroSection />
        <GiveHelp />
        <OurWork />
        <ContactUs />
        <AboutUs />
      </div>
    </DefaultLayout>
  );
}
