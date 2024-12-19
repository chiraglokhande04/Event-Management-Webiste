import React, { useState } from "react";
import { Link} from 'react-router-dom'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-300 shadow-lg">
      <div className="container mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 w-auto transition-transform duration-500 ease-in-out transform hover:scale-110 hover:rotate-6"
          />
          <span className="text-white text-2xl md:text-3xl font-extrabold tracking-wide">
            BrandName
          </span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to='/login'>
          <button className="px-6 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Login
          </button>
          </Link>
         
          <button className="px-6 py-2 bg-white text-blue-300 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-400 shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <button className="px-6 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Login
              </button>
            </li>
            <li>
              <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
