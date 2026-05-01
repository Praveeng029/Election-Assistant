import React, { useState } from 'react';
import quizzesData from '../data/quizzes.json';
import { CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerOptionClick = (index) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === quizzesData[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizzesData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <div className="quiz-section fade-in">
      <div className="section-header">
        <h2>Knowledge Check</h2>
        <p>Test your understanding of the Indian Electoral System.</p>
      </div>

      <div className="quiz-container">
        {showScore ? (
          <div className="score-section fade-in">
            <Award size={64} className="score-icon" />
            <h2>Quiz Completed!</h2>
            <p className="score-text">
              You scored {score} out of {quizzesData.length}
            </p>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ width: `${(score / quizzesData.length) * 100}%` }}
              ></div>
            </div>
            <button onClick={restartQuiz} className="primary-btn mt-4">
              <RotateCcw size={18} className="mr-2" /> Retake Quiz
            </button>
          </div>
        ) : (
          <div className="question-section fade-in" key={currentQuestion}>
            <div className="quiz-header">
              <span className="question-count">
                Question {currentQuestion + 1}/{quizzesData.length}
              </span>
              <span className="score-tracker">Score: {score}</span>
            </div>
            
            <h3 className="question-text">{quizzesData[currentQuestion].question}</h3>
            
            <div className="answer-options">
              {quizzesData[currentQuestion].options.map((option, index) => {
                let buttonClass = "answer-btn";
                if (isAnswered) {
                  if (index === quizzesData[currentQuestion].answer) {
                    buttonClass += " correct";
                  } else if (index === selectedAnswer) {
                    buttonClass += " incorrect";
                  }
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerOptionClick(index)}
                    disabled={isAnswered}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                    {isAnswered && index === quizzesData[currentQuestion].answer && (
                      <CheckCircle2 className="result-icon correct-icon" size={20} />
                    )}
                    {isAnswered && index === selectedAnswer && index !== quizzesData[currentQuestion].answer && (
                      <XCircle className="result-icon incorrect-icon" size={20} />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="explanation-box slide-up">
                <h4>Explanation:</h4>
                <p>{quizzesData[currentQuestion].explanation}</p>
                <button onClick={handleNextQuestion} className="primary-btn next-btn">
                  {currentQuestion === quizzesData.length - 1 ? "Finish Quiz" : "Next Question"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
