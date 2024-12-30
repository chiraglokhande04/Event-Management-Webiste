import React, { useState } from "react";

const LoginModal = ({ isOpen, closeModal, onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to handle error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear errors when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Login successful!");
        setFormData({ email: "", password: "" }); // Clear form
        onLogin(); // Call the onLogin function passed from props
        closeModal(); // Close the modal
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  if (!isOpen) return null;

  // Shared input styles
  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md ">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal Title */}
        <h1 className="text-4xl font-bold text-center text-blue-300 mb-2">
          Log In
        </h1>
        <p className="text-center text-blue-400 text-lg mb-6">
          Access your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-blue-600 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={inputStyle}
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-blue-600 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={inputStyle}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105"
          >
            Log in
          </button>

          {/* Divider */}
          <p className="my-4 text-center text-gray-400">--------- or ---------</p>

          {/* Google Login Button */}
          <button
            type="button"
            className="w-full py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex items-center justify-center space-x-3"
          >
            <img
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              alt="Google Icon"
              className="w-6 h-6"
            />
            <span>Log in with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
