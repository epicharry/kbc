import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, BookOpen, Crown, Sparkles, Users } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen tv-show-bg flex items-center justify-center relative overflow-hidden">
      {/* Premium Spotlight Effects */}
      <div className="spotlight spotlight-1"></div>
      <div className="spotlight spotlight-2"></div>
      <div className="spotlight spotlight-3"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 px-4 max-w-4xl mx-auto">
        {/* Main Title */}
        <div className="mb-16 relative">
          {/* Crown Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Crown className="w-20 h-20 text-yellow-400 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Crown className="w-20 h-20 text-yellow-400 opacity-30" />
              </div>
            </div>
          </div>
          
          <h1 className="title-premium text-5xl md:text-7xl lg:text-8xl mb-6 relative">
            VALORANT
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 tracking-wider mb-4">
            KAUN BANEGA CROREPATI
          </h2>
          <div className="flex items-center justify-center space-x-2 text-yellow-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-lg font-semibold tracking-widest">QUIZ CHAMPIONSHIP</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-6 max-w-lg mx-auto">
          <button
            onClick={() => navigate('/solo')}
            className="nav-btn-premium w-full px-10 py-6 text-white font-bold text-xl rounded-2xl transform transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden"
          >
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <Play className="w-7 h-7 group-hover:animate-pulse" />
              <span className="tracking-wider">SOLO QUIZ</span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </button>

          <button
            onClick={() => navigate('/multiplayer')}
            className="nav-btn-premium w-full px-10 py-6 text-white font-bold text-xl rounded-2xl transform transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden"
          >
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <Users className="w-7 h-7 group-hover:animate-pulse" />
              <span className="tracking-wider">MULTIPLAYER</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="nav-btn-premium w-full px-10 py-6 text-white font-bold text-xl rounded-2xl transform transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden"
          >
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <Trophy className="w-7 h-7 group-hover:animate-bounce" />
              <span className="tracking-wider">HALL OF FAME</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </button>

          <button
            onClick={() => navigate('/rules')}
            className="nav-btn-premium w-full px-10 py-6 text-white font-bold text-xl rounded-2xl transform transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden"
          >
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <BookOpen className="w-7 h-7 group-hover:animate-pulse" />
              <span className="tracking-wider">GAME RULES</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </button>
        </div>

        {/* Subtitle */}
        <p className="mt-12 text-gray-300 text-lg md:text-xl font-light tracking-wide leading-relaxed max-w-2xl mx-auto">
          Step into the spotlight and test your <span className="text-yellow-400 font-semibold">Valorant mastery</span> 
          <br className="hidden md:block" />
          in this premium quiz experience
        </p>
        
        {/* Prize Ladder Preview */}
        <div className="mt-12 grid grid-cols-5 gap-2 max-w-md mx-auto">
          {[5, 10, 20, 35, 50].map((milestone, index) => (
            <div key={milestone} className="text-center">
              <div className="milestone-marker w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-yellow-900" />
              </div>
              <div className="text-xs text-yellow-400 font-bold">{milestone}</div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;