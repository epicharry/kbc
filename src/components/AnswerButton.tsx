import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerButtonProps {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  onClick: () => void;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isDisabled: boolean;
  showSuspense: boolean;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({
  letter,
  text,
  onClick,
  isSelected,
  isCorrect,
  isWrong,
  isDisabled,
  showSuspense
}) => {
  const getButtonStyles = () => {
    let baseClasses = "answer-btn-premium w-full p-6 md:p-8 text-left rounded-2xl font-bold text-lg md:text-2xl transition-all duration-500 transform relative";
    
    if (isDisabled && !isSelected && !isCorrect) {
      return `${baseClasses} opacity-30 cursor-not-allowed filter grayscale`;
    }
    
    if (isCorrect) {
      return `${baseClasses} answer-correct text-white scale-105`;
    }
    
    if (isWrong) {
      return `${baseClasses} answer-wrong text-white scale-105`;
    }
    
    if (isSelected && showSuspense) {
      return `${baseClasses} answer-selected suspense-glow text-black scale-105`;
    }
    
    if (isSelected) {
      return `${baseClasses} answer-selected text-black scale-105`;
    }
    
    return `${baseClasses} text-white hover:scale-105 active:scale-95`;
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={getButtonStyles()}
    >
      <div className="flex items-center space-x-6 relative z-10">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-3 flex items-center justify-center font-bold text-xl relative ${
          isCorrect 
            ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-lg shadow-green-400/50' 
            : isWrong 
              ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-300 text-white shadow-lg shadow-red-400/50'
              : isSelected 
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-black shadow-lg shadow-yellow-400/50' 
                : getLetterColors(letter)
        }`}>
          {isCorrect ? (
            <CheckCircle className="w-6 h-6" />
          ) : isWrong ? (
            <XCircle className="w-6 h-6" />
          ) : (
            <span className="tracking-wider">{letter}</span>
          )}
          
          {/* Letter option glow */}
          {!isCorrect && !isWrong && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 animate-pulse"></div>
          )}
        </div>
        
        <span className="flex-1 tracking-wide leading-relaxed font-semibold">
          {text}
        </span>
        
        {/* Answer selection indicator */}
        {isSelected && <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>}
      </div>
    </button>
  );
};

const getLetterColors = (letter: 'A' | 'B' | 'C' | 'D') => {
  const colors = {
    A: 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400 text-white shadow-lg shadow-blue-400/30',
    B: 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-400 text-white shadow-lg shadow-purple-400/30',
    C: 'bg-gradient-to-br from-orange-500 to-orange-700 border-orange-400 text-white shadow-lg shadow-orange-400/30',
    D: 'bg-gradient-to-br from-pink-500 to-pink-700 border-pink-400 text-white shadow-lg shadow-pink-400/30'
  };
  return colors[letter];
};

export default AnswerButton;