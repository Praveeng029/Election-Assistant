import React, { useState } from 'react';
import flashcardsData from '../data/flashcards.json';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const Flashcard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcardsData.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length);
    }, 150);
  };

  const currentCard = flashcardsData[currentIndex];

  return (
    <div className="flashcards-section fade-in">
      <div className="section-header">
        <h2>Key Terminology</h2>
        <p>Flip the cards to learn essential terms used in Indian Elections.</p>
      </div>

      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <h3>{currentCard.term}</h3>
              <div className="flip-hint">
                <RefreshCw size={16} /> Tap to flip
              </div>
            </div>
            <div className="flashcard-back">
              <p>{currentCard.definition}</p>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button onClick={handlePrev} className="control-btn">
            <ChevronLeft size={24} />
          </button>
          <span className="card-counter">
            {currentIndex + 1} / {flashcardsData.length}
          </span>
          <button onClick={handleNext} className="control-btn">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
