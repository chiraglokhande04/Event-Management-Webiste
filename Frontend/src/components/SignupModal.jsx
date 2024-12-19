import React, { useState,useEffect } from 'react';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., make an API call)
    console.log(formData);
    closeModal();
  };

  if (!isOpen) return null;


  useEffect(()=>{

  },[])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeModal} // Close modal when overlay is clicked
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all hover:scale-105">
        {/* Close Button */}
        <button
          onClick={closeModal} // Close modal on button click
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal Title */}
        <h1 className="text-4xl font-bold text-center text-blue-300 mb-6">
          Sign Up
        </h1>
        <p className="text-center text-blue-400 text-lg mb-8">
          Create a new account
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-blue-600 text-sm font-bold mb-2"
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
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
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
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
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
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-300 to-blue-300 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105"
          >
            Sign Up
          </button>
          <p className='w-full flex justify-center'>---------or--------</p>
          <button
            type="submit"
            className="w-full py-3 bg-white text-blue-300 font-bold rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-center">
              <img
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                alt="Google Icon"
                className="w-9 h-9 object-contain" // Adjusts the size of the image
              />
              <span>Sign Up with Google</span>
            </div>

          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
