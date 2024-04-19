import React, { useState } from "react";
import axios from "axios";
import "./ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if resume file is selected
    if (!resumeFile) {
      console.error("Please select a resume file.");
      return;
    }

    // Call fetchQuestionsFromBackend
    fetchQuestionsFromBackend();
  };
  // ?data={"techStack": "Node JS MongoDB", "difficultyLevel": 2, "questionCount":5}

  const data = {
    techStack: "Node JS MongoDB",
    difficultyLevel: 2,
    questionCount: 5,
  };

  const fetchQuestionsFromBackend = async () => {
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      const response = await axios.post(
        `http://192.168.140.1:8000/questions?data=${data}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setQuestions(response.data);
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerChange = (index, selectedOption) => {
    const newAnswers = [...answers];
    newAnswers[index] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleScoreCalculation = async () => {
    try {
      const response = await axios.post("http://192.168.140.1:8000/questions", {
        techStack: "Node JS MongoDB",
        difficultyLevel: 2,
        questionCount: 5,
      });

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
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question.question}</p>
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <input
                      type="radio"
                      id={`option_${index}_${optionIndex}`}
                      name={`question_${index}`}
                      value={option}
                      onChange={() => handleAnswerChange(index, optionIndex)}
                    />
                    <label htmlFor={`option_${index}_${optionIndex}`}>
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={handleScoreCalculation}>Submit Answers</button>
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
