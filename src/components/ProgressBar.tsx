import React from 'react';
import { Trophy, Star, Crown } from 'lucide-react';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestion, totalQuestions }) => {
  const milestones = [5, 10, 20, 35, 50];
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto mb-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-yellow-300 tracking-wider">
          QUESTION {currentQuestion} OF {totalQuestions}
        </span>
        <span className="text-lg font-bold text-yellow-300 tracking-wider">
          {Math.round(progressPercentage)}% COMPLETE
        </span>
      </div>
      
      <div className="progress-premium relative h-4 rounded-full overflow-hidden shadow-inner">
        <div 
          className="progress-fill absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Milestone markers */}
        {milestones.map((milestone) => {
          const position = (milestone / totalQuestions) * 100;
          const isReached = currentQuestion >= milestone;
          const isFinal = milestone === 50;
          
          return (
            <div
              key={milestone}
              className="absolute top-0 h-full flex items-center justify-center transform -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <div className={`milestone-marker w-8 h-8 md:w-10 md:h-10 rounded-full border-3 flex items-center justify-center transition-all duration-500 ${
                isReached 
                  ? isFinal 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-lg shadow-yellow-400/70 scale-110' 
                    : 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400 shadow-lg shadow-yellow-400/50'
                  : 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500 opacity-50'
              }`}>
                {isReached ? (
                  isFinal ? (
                    <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-900 animate-pulse" />
                  ) : (
                    <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-900 animate-pulse" />
                  )
                ) : (
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                )}
              </div>
              
              {/* Milestone label */}
              <div className={`absolute -bottom-10 text-center transition-all duration-300 ${
                isReached ? 'text-yellow-400 scale-110' : 'text-gray-500'
              }`}>
                <div className="text-sm md:text-base font-bold">{milestone}</div>
                {isFinal && (
                  <div className="text-xs text-yellow-300 font-semibold tracking-wider">CHAMPION</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress description */}
      <div className="text-center mt-6">
        <p className="text-gray-300 text-sm md:text-base font-medium">
          {currentQuestion < 5 && "🔥 Building momentum..."}
          {currentQuestion >= 5 && currentQuestion < 10 && "⭐ First milestone reached!"}
          {currentQuestion >= 10 && currentQuestion < 20 && "🚀 You're on fire!"}
          {currentQuestion >= 20 && currentQuestion < 35 && "💎 Elite territory!"}
          {currentQuestion >= 35 && currentQuestion < 50 && "👑 Championship level!"}
          {currentQuestion >= 50 && "🏆 PERFECT GAME!"}
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;