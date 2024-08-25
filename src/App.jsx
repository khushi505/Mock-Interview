import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import Landing from "./components/Landing";
import axios from "axios";
import { useEffect, useState } from "react";

function InterviewPage() {
  const [count, setCount] = useState(0);
  const [isLooking, setIsLooking] = useState(true);

  useEffect(() => {
    const webgazer = window.webgazer;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    webgazer
      .setGazeListener((data, clock) => {
        if (!data || data.x === null || data.y === null) {
          setIsLooking(false);
          if (count >= 3) {
            alert("Test ended, malpractice detected");
          }
        } else {
          setIsLooking(true);
          const distanceFromCenterX = Math.abs(data.x - centerX);
          const distanceFromCenterY = Math.abs(data.y - centerY);
          if (distanceFromCenterX > centerX || distanceFromCenterY > centerY) {
            setCount((prevCount) => prevCount + 1);
            if (count >= 3) {
              alert("Test ended, malpractice detected");
            }
          }
        }
      })
      .begin();

    return () => {
      alert("Test is restarting.");
      webgazer.pause();
    };
  }, [count]);

  return (
    <div className="interview-page">
      <Navbar />
      <ResumeAnalyzer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<InterviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
