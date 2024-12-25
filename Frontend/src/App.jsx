import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OTPPage from "./components/OtpPage";



const App = () => {
 

  return (
    <Router>
      <div className="app-container">
        {/* Define Routes */}
        <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/verify"  element={<OTPPage/>} />
       
       
        </Routes>

      
      </div>
    </Router>
  );
};

export default App;
