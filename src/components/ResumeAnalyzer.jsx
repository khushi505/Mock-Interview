import React, { useState } from "react";
import axios from "axios";
import "./ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);
  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      console.error("Please select a resume file.");
      return;
    }

    fetchQuestionsFromBackend();
  };
  const data = {
    techStack: "from resume",
    difficultyLevel: 2,
    questionCount: 5,
  };
  const fetchQuestionsFromBackend = async () => {
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      const response = await axios.post(
        `https://candidai-2.onrender.com/questions?data=${JSON.stringify(
          data
        )}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowSubmit(true);
      if (response.status === 200) {
        setQuestions(response.data.questions);
        console.log(response.data);
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
    console.log(JSON.stringify(userResponses));

    try {
      const response = await axios.post(
        "https://candidai-2.onrender.com/check-answers",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        setScore(response.data.score);
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
            questions.map((question, index) => (
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
