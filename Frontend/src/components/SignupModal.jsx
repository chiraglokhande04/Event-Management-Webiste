import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();  // Initialize the navigate function
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Signup successful!');
        setFormData({ username: '', email: '', password: '' }); 
        
        // Redirect to the '/verify' page after successful signup
        navigate('/verify');
        
      } else {
        alert(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please check your connection and try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeModal}  // This closes the SignupModal when the overlay is clicked
        aria-label="Close Signup Modal"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Escape' && closeModal()}  // Closes the modal on pressing Escape
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={closeModal}  // This closes the SignupModal when clicked
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close Signup Modal"
        >
          ✕
        </button>

        {/* Modal Title */}
        <h1 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Sign Up
        </h1>
        <p className="text-center text-blue-500 text-sm mb-6">
          Create your account to get started
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-blue-600 text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-blue-600 text-sm font-medium mb-1"
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
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-blue-600 text-sm font-medium mb-1"
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
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-transform duration-300"
          >
            Sign Up
          </button>

          {/* Separator */}
          <div className="my-4 text-center text-gray-400">or</div>

          {/* Google Sign Up */}
          <button
            type="button"
            className="w-full py-3 bg-white text-blue-500 font-bold rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-transform duration-300"
          >
            <img
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              alt="Google Icon"
              className="w-6 h-6 mr-2"
            />
            Sign Up with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
