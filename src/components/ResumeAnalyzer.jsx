import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ResumeAnalyzer.css";
import { useNavigate } from "react-router-dom";

function ResumeAnalyzer({ onResumeUpload }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [warningIssued, setWarningIssued] = useState(false); // New state
  const [isMonitoring, setIsMonitoring] = useState(false); // New state
  const navigate = useNavigate();

  const initializeWebGazer = () => {
    const webgazer = window.webgazer;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    webgazer
      .setGazeListener((data) => {
        if (isMonitoring) {
          if (!data || data.x === null || data.y === null) {
            if (warningIssued) {
              alert("Test ended, malpractice detected");
              webgazer.pause();
              navigate("/");
            } else {
              alert("Warning: Test is restarting.");
              setWarningIssued(true);
            }
          } else {
            const distanceFromCenterX = Math.abs(data.x - centerX);
            const distanceFromCenterY = Math.abs(data.y - centerY);
            if (
              distanceFromCenterX > centerX ||
              distanceFromCenterY > centerY
            ) {
              if (warningIssued) {
                alert("Test ended, malpractice detected");
                webgazer.pause();
                navigate("/");
              } else {
                alert("Warning: Test is restarting.");
                setWarningIssued(true);
              }
            }
          }
        }
      })
      .begin();
  };

  useEffect(() => {
    initializeWebGazer();
    return () => {
      window.webgazer.pause();
    };
  }, [warningIssued, navigate, isMonitoring]);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
    console.log("File selected:", event.target.files[0]);
    if (onResumeUpload) {
      onResumeUpload();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    if (!resumeFile) {
      console.error("Please select a resume file.");
      return;
    }

    fetchQuestionsFromBackend();
    setIsMonitoring(true); // Start monitoring after resume upload
  };

  const data = {
    techStack: "from resume",
    difficultyLevel: 2,
    questionCount: 6,
  };

  const fetchQuestionsFromBackend = async () => {
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      const response = await axios.post(
        // `http://206.1.53.31:8000/apis/questions?data=${JSON.stringify(data)}`,
        `https://candidai.onrender.com/questions?data=${JSON.stringify(data)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const fetchedQuestions = response.data.questions.slice(0, 6);
        setQuestions(fetchedQuestions);
        setShowSubmit(true);
        console.log("Questions fetched:", response.data.questions);
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerChange = (question, answer) => {
    const updatedUserResponses = {
      ...userResponses,
      [question]: answer,
    };
    setUserResponses(updatedUserResponses);
  };

  const handleScoreCalculation = async () => {
    const userData = JSON.stringify(userResponses);
    console.log("User responses:", userData);

    try {
      const response = await axios.post(
        // "http://206.1.53.31:8000/apis/check-answers",
        "https://candidai.onrender.com/check-answers",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        setScore(response.data.score);
        console.log("Score received:", response.data.score);
      } else {
        throw new Error("Failed to calculate score");
      }
    } catch (error) {
      console.error("Error calculating score:", error);
    }
  };

  return (
    <div className="resume-analyzer">
      <div className="left-section">
        <p>
          1. Upload your resume <br /> 2. Receive personalized questions <br />
          3. No cheating <br />
          4. Let's enhance your career journey
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
          <button type="submit" className="upload">
            Upload Resume
          </button>
        </form>
        <div id="questionsContainer">
          {questions &&
            questions.slice(0, 6).map((question, index) => (
              <div key={index}>
                <p>{question}</p>
                <textarea
                  rows="4"
                  cols="60"
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(question, e.target.value)}
                />
              </div>
            ))}

          {showSubmit && (
            <button onClick={handleScoreCalculation}>Submit Answers</button>
          )}
        </div>
        {score !== null && (
          <div id="scoreContainer">
            <p>Your Score: {score}%</p>
          </div>
        )}
      </div>
      <div className="right-section">
        <img src="/assets/img.webp" alt="Man Image" />
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
