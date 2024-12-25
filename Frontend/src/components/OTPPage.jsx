import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isValid, setIsValid] = useState(true);

  const navigate = useNavigate()

  // Handle OTP input changes
  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if the current one is filled
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const verificationToken = otp.join(""); // Concatenate the OTP array into a single string
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/verifyEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure the server knows you're sending JSON
        },
        body: JSON.stringify({ verificationToken }), // Stringify the object to send JSON
      });
  
      const data = await response.json(); // Parse the JSON response
  
      if (response.ok) {
        alert(data.message || "User Verified Successfully!");
        navigate('/');
      } else {
        alert(data.error || "Verification failed!");
      }
    } catch (err) {
      console.log("Error in handleSubmit", err);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-auto max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Enter OTP</h1>
        <p className="text-sm text-gray-600 mb-6">Enter the 6-digit OTP sent to your E-mail</p>

        {/* Error message for invalid OTP */}
        {!isValid && (
          <p className="text-red-500 text-sm mb-4">Please enter a valid OTP</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6 space-x-2">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={otp[index]}
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl border-2 border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out"
                  onChange={(e) => handleChange(e, index)}
                  onKeyUp={(e) => e.key === "Backspace" && index > 0 && document.getElementById(`otp-input-${index - 1}`).focus()} // Handle backspace to focus on previous input
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
