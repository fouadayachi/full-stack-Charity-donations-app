/* eslint-disable jsx-a11y/label-has-associated-control */
import useAuthStore from "@/store/useAuthStore.ts";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import {
  CheckSquareIcon,
  ClockIcon,
  DollarSignIcon,
  PackageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ContributionsTable } from "../components/UserImpact/ContributionsTable";
import { EventProgressSection } from "../components/UserImpact/EventProgressSection";
import { ImpactCard } from "../components/UserImpact/ImpactCard.tsx";
function Impact() {
  const [filterType, setFilterType] = useState("All");
  const [status, setStatus] = useState("All");
  const [filterTime, setFilterTime] = useState("All Time");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { getContributions, contributions,user } = useAuthStore();
  const filteredContributions = contributions &&  contributions.filter((contribution) => {
    const matchesType =
      filterType === "All" || contribution.type === filterType;
    const matchesStatus = status === "All" || (contribution.confirmed && status === "Confirmed") || (!contribution.confirmed && status === "Pending");

    return matchesType && matchesStatus;
  });
  const uniqueEvents = Array.from(
    new Set(contributions.map((c) => c.event._id))
  );
  const sortedContributions = filteredContributions.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime(); 
    const dateB = new Date(b.createdAt).getTime(); 

    return dateB - dateA; 
  });

  useEffect(() => {
    getContributions();
  }, []);
  
  useEffect(() => {
    console.log(contributions); // This will log the updated state
  }, [contributions]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans bg-gradient-to-b from-blue-500/20 to-white">
      <HeroUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className=" w-full" justify="center">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link href="/">
              <img alt="logo" className="w-[180px] h-[50px]" src="/logo.png" />
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </HeroUINavbar>
      <div className="container mx-auto px-4 py-8 ">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Impact & Contributions
          </h1>
          <p className="text-gray-600 mt-2">
            Track your donations, volunteer hours, and item contributions
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ImpactCard
            color="from-blue-500 to-cyan-400"
            icon={<DollarSignIcon />}
            title="Total Donated"
            value={`$${user && user.impact.totalDonations}`}
          />
          <ImpactCard
            color="from-emerald-500 to-green-400"
            icon={<ClockIcon />}
            title="Hours Volunteered"
            value={`${user && user.impact.totalHours} Hours`}
          />
          <ImpactCard
            color="from-amber-500 to-yellow-400"
            icon={<PackageIcon />}
            title="Items Donated"
            value={`${user && user.impact.totalItems} Items`}
          />
          <ImpactCard
            color="from-purple-500 to-violet-400"
            icon={<CheckSquareIcon />}
            title="Total Contributions"
            value={user && user.impact.totalContributions}
          />
        </div>
        <div className="mb-8">
          <ContributionsTable
            contributions={sortedContributions}
            filterTime={filterTime}
            filterType={filterType}
            setFilterTime={setFilterTime}
            setFilterType={setFilterType}
            setStatus={setStatus}
            status={status}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Event Progress</h2>
          <EventProgressSection
            contributions={contributions}
            events={uniqueEvents}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        </div>
      </div>
    </div>
  );
}

export default Impact;
