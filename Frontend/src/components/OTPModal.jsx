import React, { useState } from 'react';

const OTPModal = ({ isOpen, closeModal, onSubmit }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));


    console.log('hehe',isOpen)
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/\d/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move focus to next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onSubmit(otpValue);
      setOtp(new Array(6).fill(''));
      closeModal();
    } else {
      alert('Please enter a 6-digit OTP.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal Title */}
        <h1 className="text-4xl font-bold text-center text-blue-300 mb-6">
          Enter OTP
        </h1>
        <p className="text-center text-blue-400 text-lg mb-8">
          Enter the 6-digit code sent to your email/phone
        </p>

        {/* OTP Input Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-gray-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-300 to-blue-300 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;
