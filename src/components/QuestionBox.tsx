import React from 'react';
import { HelpCircle, Lightbulb } from 'lucide-react';

interface QuestionBoxProps {
  question: string;
  questionNumber: number;
  hint?: string;
  showHint: boolean;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ 
  question, 
  questionNumber, 
  hint, 
  showHint 
}) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mb-12">
      <div className="question-box-premium relative p-10 md:p-12 rounded-3xl shadow-2xl">
        {/* Premium corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-yellow-400 opacity-60"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-yellow-400 opacity-60"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-yellow-400 opacity-60"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-yellow-400 opacity-60"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black px-8 py-3 rounded-full font-bold text-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-6 h-6" />
                  <span className="tracking-wider">QUESTION {questionNumber}</span>
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-30 blur animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-relaxed mb-6 tracking-wide">
            {question}
          </h2>
          
          {showHint && hint && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/60 to-purple-900/60 rounded-2xl border-2 border-blue-400/50 animate-fadeIn backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mr-3 animate-pulse" />
                <span className="text-yellow-300 font-bold text-lg tracking-wider">LIFELINE HINT</span>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed font-medium">{hint}</p>
            </div>
          )}
        </div>
        
        {/* Ambient glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default QuestionBox;