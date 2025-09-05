import React from 'react';
import { Zap, SkipForward, Lightbulb, Users, Phone, HelpCircle } from 'lucide-react';

interface LifelinesProps {
  fiftyFiftyUsed: boolean;
  skipUsed: boolean;
  hintUsed: boolean;
  onFiftyFifty: () => void;
  onSkip: () => void;
  onHint: () => void;
  disabled: boolean;
}

const Lifelines: React.FC<LifelinesProps> = ({
  fiftyFiftyUsed,
  skipUsed,
  hintUsed,
  onFiftyFifty,
  onSkip,
  onHint,
  disabled
}) => {
  return (
    <div className="flex lg:flex-col justify-center lg:justify-start space-x-6 lg:space-x-0 lg:space-y-6 md:space-x-8">
      {/* 50-50 */}
      <button
        onClick={onFiftyFifty}
        disabled={fiftyFiftyUsed || disabled}
        className={`lifeline-btn p-4 md:p-6 rounded-2xl font-bold transition-all duration-500 transform ${
          fiftyFiftyUsed 
            ? 'opacity-30 cursor-not-allowed filter grayscale' 
            : disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'text-white hover:scale-110 active:scale-95'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <Zap className="w-6 h-6 md:w-8 md:h-8" />
            {!fiftyFiftyUsed && !disabled && (
              <div className="absolute inset-0 animate-ping">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-purple-400 opacity-30" />
              </div>
            )}
          </div>
          <span className="text-sm md:text-base font-bold tracking-wider">50:50</span>
          <div className="text-xs text-gray-300 text-center leading-tight">
            ELIMINATE<br />TWO WRONG
          </div>
        </div>
      </button>

      {/* Skip */}
      <button
        onClick={onSkip}
        disabled={skipUsed || disabled}
        className={`lifeline-btn p-4 md:p-6 rounded-2xl font-bold transition-all duration-500 transform ${
          skipUsed 
            ? 'opacity-30 cursor-not-allowed filter grayscale' 
            : disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'text-white hover:scale-110 active:scale-95'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <SkipForward className="w-6 h-6 md:w-8 md:h-8" />
            {!skipUsed && !disabled && (
              <div className="absolute inset-0 animate-ping">
                <SkipForward className="w-6 h-6 md:w-8 md:h-8 text-blue-400 opacity-30" />
              </div>
            )}
          </div>
          <span className="text-sm md:text-base font-bold tracking-wider">SKIP</span>
          <div className="text-xs text-gray-300 text-center leading-tight">
            MOVE TO<br />NEXT QUESTION
          </div>
        </div>
      </button>

      {/* Hint */}
      <button
        onClick={onHint}
        disabled={hintUsed || disabled}
        className={`lifeline-btn p-4 md:p-6 rounded-2xl font-bold transition-all duration-500 transform ${
          hintUsed 
            ? 'opacity-30 cursor-not-allowed filter grayscale' 
            : disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'text-white hover:scale-110 active:scale-95'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <Lightbulb className="w-6 h-6 md:w-8 md:h-8" />
            {!hintUsed && !disabled && (
              <div className="absolute inset-0 animate-ping">
                <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-orange-400 opacity-30" />
              </div>
            )}
          </div>
          <span className="text-sm md:text-base font-bold tracking-wider">HINT</span>
          <div className="text-xs text-gray-300 text-center leading-tight">
            GET A<br />HELPFUL CLUE
          </div>
        </div>
      </button>
    </div>
  );
};

export default Lifelines;