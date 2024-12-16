import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png" 
            alt="Logo"
            className="h-10 w-auto"
          />
          <span className="ml-2 text-xl font-bold text-gray-700">BrandName</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-gray-700 hover:text-white border border-gray-300 hover:bg-gray-700 rounded-md transition">
            Login
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
