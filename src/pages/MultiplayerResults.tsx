import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Crown, Users } from 'lucide-react';
import { Player, GameRoom } from '../lib/supabase';

interface MultiplayerResultsState {
  room: GameRoom;
  player: Player;
  players: Player[];
  kicked?: boolean;
}

const MultiplayerResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as MultiplayerResultsState;
  
  const { room, player, players, kicked = false } = state || {};
  
  if (!room || !player || !players) {
    navigate('/multiplayer');
    return null;
  }
  
  // Sort players by score (descending)
  const sortedPlayers = [...players]
    .filter(p => p.is_active)
    .sort((a, b) => b.score - a.score);
  
  const playerRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
  const winner = sortedPlayers[0];
  const isWinner = winner?.id === player.id;
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-8 h-8 text-yellow-400" />;
      case 2: return <Trophy className="w-8 h-8 text-gray-300" />;
      case 3: return <Trophy className="w-8 h-8 text-amber-600" />;
      default: return <Users className="w-8 h-8 text-blue-400" />;
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
  
  const getResultMessage = () => {
    if (kicked) {
      return { title: '⏰ TIME OUT!', subtitle: 'You were kicked for inactivity', color: 'text-red-400' };
    } else if (isWinner) {
      return { title: '🏆 VICTORY!', subtitle: 'You are the Valorant Champion!', color: 'text-yellow-400' };
    } else if (playerRank <= 3) {
      return { title: `🎯 ${playerRank === 2 ? '2ND PLACE!' : '3RD PLACE!'}`, subtitle: 'Great performance!', color: 'text-green-400' };
    } else {
      return { title: '🎮 GOOD GAME!', subtitle: `You finished ${playerRank}${getOrdinalSuffix(playerRank)}`, color: 'text-blue-400' };
    }
  };
  
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };
  
  const result = getResultMessage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
            🏁 GAME COMPLETE
          </h1>
          <p className="text-xl text-gray-300">Room: {room.room_code}</p>
        </div>
        
        {/* Player Result */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl mb-8">
          <div className="text-center">
            <h2 className={`text-3xl md:text-4xl font-bold ${result.color} mb-2`}>
              {result.title}
            </h2>
            <p className="text-xl text-gray-300 mb-6">{result.subtitle}</p>
            
            {!kicked && (
              <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-8 py-4 rounded-2xl border-4 border-yellow-400 shadow-lg">
                <div className="text-4xl font-bold mb-1">
                  {player.score}/50
                </div>
                <div className="text-lg font-semibold">
                  Your Score
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-3xl p-8 border-2 border-gray-600 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span>FINAL LEADERBOARD</span>
          </h3>
          
          <div className="space-y-4">
            {sortedPlayers.map((p, index) => {
              const rank = index + 1;
              return (
                <div
                  key={p.id}
                  className={`rounded-xl p-6 border-2 shadow-lg transition-all duration-300 ${getRankColors(rank)} ${
                    p.id === player.id ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(rank)}
                        <span className="text-2xl font-bold text-white">
                          #{rank}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-white">
                          {p.nickname}
                        </span>
                        {p.is_host && <Crown className="w-6 h-6 text-yellow-400" />}
                        {p.id === player.id && (
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        {p.score}/50
                      </div>
                      <div className="text-sm text-gray-300">
                        {Math.round((p.score / 50) * 100)}% accuracy
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/multiplayer')}
            className="flex items-center justify-center space-x-3 px-8 py-6 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-xl rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-green-500/50"
          >
            <RotateCcw className="w-6 h-6" />
            <span>PLAY AGAIN</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-3 px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold text-xl rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            <Home className="w-6 h-6" />
            <span>HOME</span>
          </button>
        </div>
        
        {/* Winner Celebration */}
        {isWinner && !kicked && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-900 to-yellow-800 border-2 border-yellow-500 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Crown className="w-10 h-10 text-yellow-400 animate-pulse" />
                <div>
                  <div className="font-bold text-yellow-400 text-lg">🎉 CHAMPION! 🎉</div>
                  <div className="text-sm text-yellow-200">
                    You dominated the competition with {player.score} correct answers!
                  </div>
                </div>
                <Crown className="w-10 h-10 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerResults;