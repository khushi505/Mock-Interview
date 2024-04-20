import React from "react";
import Navbar from "./components/Navbar";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [isLooking, setIsLooking] = useState(true); // New state variable

  useEffect(() => {
    const webgazer = window.webgazer;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    webgazer
      .setGazeListener((data, clock) => {
        if (!data || data.x === null || data.y === null) {
          setIsLooking(false); // User is not looking at the screen
          if (count >= 3) {
            alert("Test ended, malpractice detected");
          }
        } else {
          setIsLooking(true); // User is looking at the screen
          const distanceFromCenterX = Math.abs(data.x - centerX);
          const distanceFromCenterY = Math.abs(data.y - centerY);
          if (distanceFromCenterX > centerX || distanceFromCenterY > centerY) {
            setCount((prevCount) => prevCount + 1); // Use callback for updating count
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
  }, []); // Add count to the dependency array
  return (
    <div className="app">
      <Navbar />
      <ResumeAnalyzer />
    </div>
  );
}

export default App;
