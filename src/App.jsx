import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import Landing from "./components/Landing";

function App() {
  const handleResumeUpload = () => {
    console.log("Resume is being uploaded...");
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app"
          element={<ResumeAnalyzer onResumeUpload={handleResumeUpload} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
