import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OTPPage from "./components/OtpPage";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";



const App = () => {
 

  return (
    <Router>
      <div className="app-container">
        {/* Define Routes */}
        <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/verify"  element={<OTPPage/>} />
        <Route path="/profile"  element={<ProfilePage/>} />
       
       
        </Routes>

      
      </div>
    </Router>
  );
};

export default App;
