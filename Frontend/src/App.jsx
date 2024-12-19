import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";



const App = () => {
 

  return (
    <Router>
      <div className="app-container">
        {/* Define Routes */}
        <Routes>
        <Route path="/"  element={<Home />} />
       
       
        </Routes>

      
      </div>
    </Router>
  );
};

export default App;
