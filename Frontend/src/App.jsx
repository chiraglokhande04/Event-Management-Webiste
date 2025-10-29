import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OTPPage from "./components/OtpPage";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";
import VerifyEmail from "./components/VerifyEmail";
import Login from "./components/Login";



const App = () => {
 

  return (
    <Router>
      <div className="app-container">
        {/* Define Routes */}
        <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/verify-email"  element={<VerifyEmail />} />
        <Route path="/profile"  element={<Profile/>} />
        <Route path="/login"  element={<Login />} />
       
       
        </Routes>

      
      </div>
    </Router>
  );
};

export default App;
