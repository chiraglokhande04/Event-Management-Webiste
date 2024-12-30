import React, { useState, useEffect } from "react";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Utility function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Check cookies on component mount
  useEffect(() => {
    const loggedInStatus = getCookie("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    document.cookie = "isLoggedIn=true; path=/;"; // Mock setting a cookie
    closeLoginModal();
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Clear the cookie
  };

  const renderButtons = () =>
    isLoggedIn ? (
      <div className="flex items-center space-x-6">
        {/* Profile Icon */}
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-200 transition-all duration-300"
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded-full"
          />
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div>
    ) : (
      <>
        <button
          onClick={openLoginModal}
          className="px-6 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </button>
        <LoginModal
          isOpen={isLoginModalOpen}
          closeModal={closeLoginModal}
          onLogin={handleLogin} // Pass login handler
        />

        <button
          onClick={openSignupModal}
          className="px-6 py-2 bg-white text-blue-300 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Sign Up
        </button>
        <SignupModal isOpen={isSignupModalOpen} closeModal={closeSignupModal} />
      </>
    );

  return (
    <header className="bg-blue-300 shadow-lg">
      <div className="container mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnu4KS9zdJvd4KUKkV3EawuU0UYD-nwxH9Gw&s"
            alt="Logo"
            className="h-12 w-auto transition-transform duration-500 ease-in-out transform hover:scale-110 hover:rotate-6"
          />
          <span className="text-white text-2xl md:text-3xl font-extrabold tracking-wide">
            Connecto
          </span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {renderButtons()}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
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
            <li>{renderButtons()}</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
