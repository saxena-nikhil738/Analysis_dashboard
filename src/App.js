import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AnalysisPage from "./components/AnalysisPage";
import Login from "./components/Account/Login";
import Signup from "./components/Account/Signup";
import { ToastContainer, toast } from "react-toastify";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<AnalysisPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
