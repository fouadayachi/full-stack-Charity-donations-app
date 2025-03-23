import { useEffect } from "react";
import { MetricCard } from "./MetricCard";

import { CalendarIcon, InboxIcon, UsersIcon, BanknoteIcon } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import useDashStore from "@/store/useDashStore";

export const Dashboard = () => {
  const { data, getStats } = useDashStore();

  // Animated values for each metric card
  const totalEvents = useMotionValue(0);
  const pendingRequests = useMotionValue(0);
  const totalUsers = useMotionValue(0);
  const totalDonations = useMotionValue(0);

  // Transform the motion values into rounded numbers
  const roundedTotalEvents = useTransform(totalEvents, (latest) => Math.round(latest));
  const roundedPendingRequests = useTransform(pendingRequests, (latest) => Math.round(latest));
  const roundedTotalUsers = useTransform(totalUsers, (latest) => Math.round(latest));
  const roundedTotalDonations = useTransform(totalDonations, (latest) => Math.round(latest));

  // Animate the numbers when data changes
  useEffect(() => {
    if (data) {
      animate(totalEvents, data.totalEvents, { duration: 1 });
      animate(pendingRequests, data.pendingRequests.count, { duration: 1 });
      animate(totalUsers, data.totalUsers.count, { duration: 1 });
      animate(totalDonations, data.totalMoneyRaised.amount, { duration: 1 });
    }
  }, [data]);

  const metricCards = [
    {
      title: "Total Events",
      value: (
        <motion.span>{roundedTotalEvents}</motion.span>
      ),
      icon: <CalendarIcon size={24} />,
      subtext: data?.completedEvents + " events completed",
      gradientFrom: "#3182CE",
      gradientTo: "#48BB78",
    },
    {
      title: "Pending Requests",
      value: (
        <motion.span>{roundedPendingRequests}</motion.span>
      ),
      icon: <InboxIcon size={24} />,
      subtext: data?.pendingRequests.highUrgency + " high urgency",
      gradientFrom: "#F56565",
      gradientTo: "#ED8936",
    },
    {
      title: "Total Users",
      value: (
        <motion.span>{roundedTotalUsers}</motion.span>
      ),
      icon: <UsersIcon size={24} />,
      subtext: data?.totalUsers.increase,
      gradientFrom: "#805AD5",
      gradientTo: "#D53F8C",
    },
    {
      title: "Total Donations",
      value: (
        <motion.span>{roundedTotalDonations}</motion.span>
      ),
      icon: <BanknoteIcon size={24} />,
      subtext: data?.totalMoneyRaised.increase,
      gradientFrom: "#1A365D",
      gradientTo: "#3182CE",
    },
  ];

  const requestsData = [
    {
      id: 1,
      requester: "Maria Gonzalez",
      type: "Shelter",
      urgency: "high",
    },
    {
      id: 2,
      requester: "John Smith",
      type: "Food",
      urgency: "high",
    },
    {
      id: 3,
      requester: "Alex Chen",
      type: "Financial",
      urgency: "medium",
    },
  ];

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1E2D] mb-6">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <MetricCard
            key={index}
            gradientFrom={card.gradientFrom}
            gradientTo={card.gradientTo}
            icon={card.icon}
            subtext={card.subtext}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>
      
    </div>
  );
};