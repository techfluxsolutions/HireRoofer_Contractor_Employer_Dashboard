import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX, HiBell, HiUserCircle } from "react-icons/hi";
import { PiBellBold } from "react-icons/pi";


const WorkerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/employer-dashboard/home" },
    { name: "Jobs Request", path: "/employer-dashboard/jobs" },
    // { name: "My Projects", path: "/employer-dashboard/projects" },
    { name: "Chat", path: "/chat" },
    { name: "View Roofer", path: "/employer-dashboard/view-roofer" }, 
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">

      <div className="w-full px-4 sm:px-6 lg:px-8">

        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="./assets/logo.png" alt="Hire Roofer" className="h-[5rem] w-auto" />
          </div>

          {/* Desktop Menu
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `text-lg font-semibold transition-colors ${isActive
                    ? "text-blue-600"
                    : "text-gray-800 hover:text-blue-600"
                  }`
                }
              >
                {link.name}
              </NavLink>

            ))}
          </div> */}

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-6">
              {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `text-lg font-semibold transition-colors ${isActive
                    ? "text-blue-600"
                    : "text-gray-800 hover:text-blue-600"
                  }`
                }
              >
                {link.name}
              </NavLink>

            ))}
          </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <PiBellBold className="h-6 w-6 text-gray-700" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <button className="p-1 hover:bg-gray-100 rounded-full">
              <HiUserCircle className="h-10 w-10 text-gray-700" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <HiX className="h-7 w-7" />
              ) : (
                <HiMenu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg z-50 transform transition-all duration-300 ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
          }`}

      >

        <div className="px-4 pt-4 pb-6 space-y-2 bg-white border-t">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg font-semibold ${isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Icons */}
          <div className="flex gap-4 pt-4 border-t">
            <button className="flex items-center gap-2 text-gray-700">
              <HiBell className="h-6 w-6" />
              Notifications
            </button>
            <button className="flex items-center gap-2 text-gray-700">
              <HiUserCircle className="h-8 w-8 rounded-full" />
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WorkerNavbar;