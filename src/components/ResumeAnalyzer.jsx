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
  const [warningIssued, setWarningIssued] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [outOfBoundsCount, setOutOfBoundsCount] = useState(0); // New state to track out-of-bounds frames
  const navigate = useNavigate();

  const initializeWebGazer = () => {
    const webgazer = window.webgazer;

    // Adjusted bounding box with added tolerance
    const greenBox = {
      minX: 100, // Boundary adjustment
      maxX: 900, // Boundary adjustment
      minY: 100, // Boundary adjustment
      maxY: 900, // Boundary adjustment
    };

    webgazer
      .setGazeListener((data) => {
        if (isMonitoring && data) {
          const { x, y } = data;

          console.log(`Gaze coordinates: X: ${x}, Y: ${y}`);
          console.log(
            `Green Box: minX: ${greenBox.minX}, maxX: ${greenBox.maxX}, minY: ${greenBox.minY}, maxY: ${greenBox.maxY}`
          );

          const isOutsideGreenBox =
            x < greenBox.minX ||
            x > greenBox.maxX ||
            y < greenBox.minY ||
            y > greenBox.maxY;

          if (isOutsideGreenBox) {
            setOutOfBoundsCount(outOfBoundsCount + 1);
          } else {
            setOutOfBoundsCount(0);
          }

          // Trigger alert only if out of bounds for more than 5 frames consecutively
          if (outOfBoundsCount > 5) {
            if (warningIssued) {
              alert("Test ended, malpractice detected");
              webgazer.pause();
              navigate("/");
            } else {
              alert(
                "Warning: Please ensure your face stays within the green box."
              );
              setWarningIssued(true);
            }
            setOutOfBoundsCount(0); // Reset the count after triggering the alert
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
  }, [warningIssued, navigate, isMonitoring, outOfBoundsCount]);

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
        `http://206.1.53.31:8000/questions?data=${JSON.stringify(data)}`,
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
        "http://206.1.53.31:8000/check-answers",
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
