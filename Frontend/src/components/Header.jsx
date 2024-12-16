import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <div className="container mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-14 w-auto transition-transform duration-500 ease-in-out transform hover:scale-110 hover:rotate-6"
          />
          <span className="text-white text-3xl font-extrabold tracking-wide">
            BrandName
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-6">
          <button className="px-6 py-3 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110">
            Login
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
