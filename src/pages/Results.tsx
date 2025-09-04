import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Share2, Star } from 'lucide-react';

interface ResultsState {
  questionsAnswered: number;
  correctAnswers: number;
  totalQuestions: number;
  reason: 'completed' | 'wrong_answer' | 'timeout' | 'ended_game';
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsState;
  
  // Default values if state is not available
  const {
    questionsAnswered = 0,
    correctAnswers = 0,
    totalQuestions = 50,
    reason = 'completed'
  } = state || {};
  
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Determine milestone reached
  const milestones = [5, 10, 20, 35, 50];
  const milestoneReached = milestones.reduce((prev, curr) => 
    correctAnswers >= curr ? curr : prev, 0
  );
  
  const getResultMessage = () => {
    if (reason === 'completed' && correctAnswers === totalQuestions) {
      return { title: '🏆 PERFECT GAME!', subtitle: 'You are a Valorant Master!', color: 'text-yellow-400' };
    } else if (correctAnswers >= 40) {
      return { title: '🎯 EXCEPTIONAL!', subtitle: 'Outstanding Valorant Knowledge!', color: 'text-green-400' };
    } else if (correctAnswers >= 30) {
      return { title: '⭐ EXCELLENT!', subtitle: 'Great Valorant Skills!', color: 'text-blue-400' };
    } else if (correctAnswers >= 20) {
      return { title: '👍 GOOD JOB!', subtitle: 'Solid Performance!', color: 'text-purple-400' };
    } else if (correctAnswers >= 10) {
      return { title: '📈 NOT BAD!', subtitle: 'Keep Learning!', color: 'text-orange-400' };
    } else {
      return { title: '🎮 GAME OVER', subtitle: 'Try Again!', color: 'text-red-400' };
    }
  };
  
  const result = getResultMessage();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Valorant KBC Quiz Results',
        text: `I scored ${correctAnswers}/${totalQuestions} on the Valorant KBC Quiz! Can you beat my score?`,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers without Web Share API
      const text = `I scored ${correctAnswers}/${totalQuestions} on the Valorant KBC Quiz! Can you beat my score? ${window.location.origin}`;
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Result Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10">
            {/* Result Header */}
            <div className="text-center mb-8">
              <h1 className={`text-4xl md:text-5xl font-bold ${result.color} mb-2 animate-pulse`}>
                {result.title}
              </h1>
              <p className="text-xl text-gray-300">{result.subtitle}</p>
            </div>
            
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-8 py-4 rounded-2xl border-4 border-yellow-400 shadow-lg">
                <div className="text-6xl font-bold mb-2">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-xl font-semibold">
                  {percentage}% Score
                </div>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{questionsAnswered}</div>
                  <div className="text-sm text-gray-400">Questions Answered</div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{milestoneReached}</div>
                  <div className="text-sm text-gray-400">Milestone Reached</div>
                </div>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">{accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy Rate</div>
                <div className="text-xs text-gray-500 mt-1">
                  ({correctAnswers} correct out of {questionsAnswered} attempted)
                </div>
              </div>
            </div>
            
            {/* Reason Display */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
                <span className="text-sm text-gray-400">
                  {reason === 'completed' ? 'Quiz Completed' : 
                   reason === 'wrong_answer' ? 'Wrong Answer' : 
                   reason === 'timeout' ? 'Time Up' :
                   'Game Ended Early'}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/solo')}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-green-500/50"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Play Again</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Performance Message */}
        {milestoneReached >= 20 && (
          <div className="mt-6 bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-500 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="font-bold text-yellow-400">Milestone Achievement!</div>
                <div className="text-sm text-yellow-200">
                  You've reached the {milestoneReached}-question milestone! 
                  {milestoneReached >= 35 && " You're in the elite tier!"}
                  {milestoneReached === 50 && " Perfect score achieved!"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;