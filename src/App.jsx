import React from "react";
import Navbar from "./components/Navbar";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import axios from "axios";

function App() {
  return (
    <div className="app">
      <Navbar />
      <ResumeAnalyzer />
    </div>
  );
}

export default App;
