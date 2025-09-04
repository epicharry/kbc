import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, Star } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'alltime'>('daily');
  
  // Placeholder data
  const leaderboardData = {
    daily: [
      { rank: 1, name: "ValorantPro", score: 50, milestone: 50, accuracy: 100, badge: "🏆" },
      { rank: 2, name: "RadiantPlayer", score: 47, milestone: 47, accuracy: 95, badge: "🥈" },
      { rank: 3, name: "DuelistMain", score: 45, milestone: 45, accuracy: 92, badge: "🥉" },
      { rank: 4, name: "SmokeGod", score: 42, milestone: 42, accuracy: 89, badge: "⭐" },
      { rank: 5, name: "FlashMaster", score: 38, milestone: 35, accuracy: 86, badge: "⭐" },
      { rank: 6, name: "SentinelKing", score: 35, milestone: 35, accuracy: 83, badge: "⭐" },
      { rank: 7, name: "InitiatorPro", score: 32, milestone: 20, accuracy: 80, badge: "🔥" },
      { rank: 8, name: "WallBanger", score: 28, milestone: 20, accuracy: 77, badge: "🔥" },
      { rank: 9, name: "EcoFrag", score: 25, milestone: 20, accuracy: 74, badge: "🔥" },
      { rank: 10, name: "RushBPlayer", score: 22, milestone: 20, accuracy: 71, badge: "💎" },
    ],
    weekly: [
      { rank: 1, name: "ValorantGOAT", score: 50, milestone: 50, accuracy: 98, badge: "🏆" },
      { rank: 2, name: "TacShooter", score: 49, milestone: 49, accuracy: 96, badge: "🥈" },
      { rank: 3, name: "ClutchKing", score: 48, milestone: 48, accuracy: 94, badge: "🥉" },
      { rank: 4, name: "AimBot", score: 46, milestone: 46, accuracy: 92, badge: "⭐" },
      { rank: 5, name: "StratCaller", score: 44, milestone: 44, accuracy: 90, badge: "⭐" },
      { rank: 6, name: "PeekerAdv", score: 41, milestone: 35, accuracy: 88, badge: "⭐" },
      { rank: 7, name: "AntiEco", score: 39, milestone: 35, accuracy: 86, badge: "🔥" },
      { rank: 8, name: "CrossPlacement", score: 36, milestone: 35, accuracy: 84, badge: "🔥" },
      { rank: 9, name: "UtilityGod", score: 33, milestone: 20, accuracy: 82, badge: "🔥" },
      { rank: 10, name: "RetakeSpecialist", score: 30, milestone: 20, accuracy: 80, badge: "💎" },
    ],
    alltime: [
      { rank: 1, name: "LegendaryPlayer", score: 50, milestone: 50, accuracy: 100, badge: "👑" },
      { rank: 2, name: "ValorantSensei", score: 50, milestone: 50, accuracy: 99, badge: "🏆" },
      { rank: 3, name: "QuizMaster", score: 50, milestone: 50, accuracy: 98, badge: "🥈" },
      { rank: 4, name: "KnowledgeBank", score: 49, milestone: 49, accuracy: 97, badge: "🥉" },
      { rank: 5, name: "StudyHard", score: 48, milestone: 48, accuracy: 96, badge: "⭐" },
      { rank: 6, name: "GameSense", score: 47, milestone: 47, accuracy: 95, badge: "⭐" },
      { rank: 7, name: "MetaKnower", score: 46, milestone: 46, accuracy: 94, badge: "⭐" },
      { rank: 8, name: "ValorantEncy", score: 45, milestone: 45, accuracy: 93, badge: "🔥" },
      { rank: 9, name: "DataMiner", score: 44, milestone: 44, accuracy: 92, badge: "🔥" },
      { rank: 10, name: "TriviaMaster", score: 43, milestone: 43, accuracy: 91, badge: "🔥" },
    ]
  };
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-blue-400" />;
    }
  };
  
  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-400";
      case 2: return "bg-gradient-to-r from-gray-600 to-gray-500 border-gray-400";
      case 3: return "bg-gradient-to-r from-amber-700 to-amber-600 border-amber-500";
      default: return "bg-gray-800 border-gray-600";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Home</span>
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
          🏆 LEADERBOARD
        </h1>
        
        <div className="w-24"></div>
      </div>
      
      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-center space-x-1 bg-gray-800 rounded-xl p-1">
          {[
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'alltime', label: 'All Time' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Leaderboard List */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3">
          {leaderboardData[activeTab].map((player) => (
            <div
              key={`${activeTab}-${player.rank}`}
              className={`rounded-xl p-4 border-2 shadow-lg transition-all duration-300 hover:scale-105 ${getRankColors(player.rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(player.rank)}
                    <span className="text-2xl font-bold text-white">
                      #{player.rank}
                    </span>
                  </div>
                  
                  <div className="text-2xl">{player.badge}</div>
                  
                  <div>
                    <div className="text-lg font-bold text-white">
                      {player.name}
                    </div>
                    <div className="text-sm text-gray-300">
                      Milestone: {player.milestone}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {player.score}/50
                  </div>
                  <div className="text-sm text-gray-300">
                    {player.accuracy}% accuracy
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-500"
                    style={{ width: `${(player.score / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Your Rank Placeholder */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl border-2 border-purple-500 shadow-lg">
          <div className="text-center">
            <h3 className="text-xl font-bold text-purple-300 mb-2">Your Best Score</h3>
            <div className="text-lg text-gray-300">
              Play a quiz to see your ranking!
            </div>
            <button
              onClick={() => navigate('/solo')}
              className="mt-4 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;