// src/components/Header.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentInterface } = useAppStore();

  const isManagement = location.pathname.startsWith("/management");
  const isPublic = location.pathname === "/" || location.pathname.startsWith("/public");

  // Do NOT render the purple/top header on public pages. Public page has its own hero.
  if (isPublic) return null;

  const handleInterfaceSwitch = () => {
    setCurrentInterface("public");
    navigate("/public");
  };

  return (
    <header className="shadow-md backdrop-blur-sm border-b bg-gradient-to-r from-corporateBlue-600 to-corporateBlue-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/management" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-corporateBlue-100 group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-8 md:w-8 text-corporateBlue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L15 12l-5.25-5" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-corporateBlue-100 group-hover:scale-105 transition-transform duration-300">
                Event Management
              </h1>
              <p className="text-sm md:text-base text-corporateBlue-200 hidden sm:block">
                Manage your events professionally
              </p>
            </div>
          </Link>

          <nav className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 text-sm text-corporateBlue-200">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-corporateBlue-100 text-corporateBlue-700">
                Management Mode
              </span>
            </div>

            <button
              onClick={handleInterfaceSwitch}
              className="px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-corporateBlue-500 text-white hover:bg-corporateBlue-700 text-sm md:text-base"
            >
              <span className="hidden sm:inline">Switch to Public</span>
              <span className="sm:hidden">Public</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
