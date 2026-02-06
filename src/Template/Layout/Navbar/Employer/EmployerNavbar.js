import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiBell, HiUserCircle } from "react-icons/hi";
import { PiBellBold } from "react-icons/pi";
import ConfirmLogoutModal from "../ConfirmLogoutModal/ConfirmLogoutModal";


const EmployerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       profileRef.current &&
  //       !profileRef.current.contains(event.target)
  //     ) {
  //       setIsProfileOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const navLinks = [
    { name: "Home", path: "/employer-dashboard/home" },
    { name: "My Jobs", path: "/employer-dashboard/jobs" },
    { name: "My Projects", path: "/employer-dashboard/projects" },
    { name: "Chat", path: "/chat" },
    { name: "View Roofer", path: "/employer-dashboard/view-roofer" },
  ];

  const handleLogout = () => {
    console.log("LOgout click")
    localStorage.clear();
    sessionStorage.clear()

    setIsProfileOpen(false);
    setIsMenuOpen(false);
    // Redirect to login / home
    navigate("/select-role", { replace: true });


    // logout logic here
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">

      <div className="w-full px-4 sm:px-6 lg:px-8">

        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="./assets/logo.png" alt="Hire Roofer" className="h-[5rem] w-auto" />
          </div>

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

            {/* <button className="p-1 hover:bg-gray-100 rounded-full">
              <HiUserCircle className="h-10 w-10 text-gray-700" />
            </button> */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <HiUserCircle className="h-10 w-10 text-gray-700" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                  <NavLink
                    to="/employer-dashboard/employer-profile"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    View Profile
                  </NavLink>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLogoutModal(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
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

            <div className="flex gap-4 ">


              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(true);
                  }}
                  className="flex items-center gap-2 text-gray-700 w-full"
                >
                  <HiUserCircle className="h-8 w-8" />
                  Profile
                </button>

                {isProfileOpen && (
                  <div
                    className="ml-10 mt-2 space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <NavLink
                      to="/employer-dashboard/employer-profile"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-blue-600"
                    >
                      View Profile
                    </NavLink>

                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setIsProfileOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="block text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      <ConfirmLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default EmployerNavbar;