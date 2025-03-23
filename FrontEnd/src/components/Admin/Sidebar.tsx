/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import {
  CalendarIcon,
  ChevronLeftIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  MenuIcon,
  UsersIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation(); // Get the current location to determine the active item

  const navItems = [
    {
      key: "home",
      label: "Home",
      icon: <HomeIcon size={20} />,
      path: "/admin/", // Path for the Home item
    },
    {
      key: "events",
      label: "Events",
      icon: <CalendarIcon size={20} />,
      path: "/admin/events", // Path for the Events item
    },
    {
      key: "showcases",
      label: "Showcases",
      icon: <ImageIcon size={20} />,
      path: "/admin/showcases", // Path for the Showcases item
    },
    {
      key: "requests",
      label: "Requests",
      icon: <InboxIcon size={20} />,
      path: "/admin/requests", // Path for the Requests item
    },
    {
      key: "users",
      label: "Users",
      icon: <UsersIcon size={20} />,
      path: "/admin/users", // Path for the Users item
    },
  ];

  
  const activeItem = navItems.find((item) => {
    if (item.key === "home") {
    
      return location.pathname === item.path;
    } else {
      
      return location.pathname.startsWith(item.path);
    }
  })?.key;

  return (
    <div
      className={`bg-[#1A1E2D] fixed left-0 top-0 bottom-0 text-white transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold">Admin</h1>}
        <button
          className={`rounded-full p-1 hover:bg-gray-700 transition-colors ${
            collapsed ? "mx-auto" : ""
          }`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuIcon size={20} /> : <ChevronLeftIcon size={20} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto pt-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.key} className="mb-1">
              <Link
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors hover:bg-gray-700 ${
                  activeItem === item.key
                    ? "border-l-4 border-[#6C5CE7] bg-gray-800"
                    : ""
                }`}
                to={item.path}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className={`${collapsed ? "mx-auto" : "mr-3"}`}>
                      {item.icon}
                    </div>
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
