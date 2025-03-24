import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import EventHeader from "./EventHeader";
import ResultsOverview from "./ResultsOverview";
import EventGallery from "./EventGallery";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useShowCases from "@/store/useShowCaseStore";
function ShowCaseDetailsPage() {
  const { id } = useParams();
  const { getEvent, event } = useShowCases();

  useEffect(() => {
    getEvent(id);
  }, [id]);

  useEffect(() => {
    // Scroll to the top of the page when the location changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <HeroUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className=" w-full" justify="center">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link href="/">
              <img alt="logo" className="w-[180px] h-[50px]" src="/logo.png" />
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </HeroUINavbar>
      <main>
        <EventHeader event={event} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div>
              <ResultsOverview event={event} />
              <EventGallery event={event} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ShowCaseDetailsPage;
