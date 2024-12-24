import React from "react";

const OTPPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Enter OTP</h1>
        <p className="text-sm text-gray-600 mb-6">Enter the 6-digit OTP sent to your mobile</p>
        <form>
          <div className="flex justify-between mb-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-10 h-10 text-center text-lg border-2 border-blue-400 rounded focus:outline-none focus:border-blue-800"
                />
              ))}
          </div>
          <button
            type="submit"
            className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
