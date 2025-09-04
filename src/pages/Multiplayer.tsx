import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, LogIn, Gamepad2 } from 'lucide-react';
import { createRoom, joinRoom } from '../lib/supabase';

const Multiplayer: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { room, player } = await createRoom(nickname.trim());
      navigate('/multiplayer-lobby', { state: { room, player } });
    } catch (error) {
      setError('Failed to create room. Please try again.');
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !roomCode.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { room, player } = await joinRoom(roomCode.trim(), nickname.trim());
      // Small delay to ensure the player is properly inserted before navigating
      setTimeout(() => {
        navigate('/multiplayer-lobby', { state: { room, player } });
      }, 200);
    } catch (error: any) {
      setError(error.message || 'Failed to join room. Please try again.');
      console.error('Error joining room:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNickname('');
    setRoomCode('');
    setError('');
    setMode('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => mode === 'menu' ? navigate('/') : resetForm()}
          className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
          🎮 MULTIPLAYER MODE
        </h1>
        
        <div className="w-24"></div>
      </div>

      <div className="max-w-2xl mx-auto">
        {mode === 'menu' && (
          <div className="space-y-8">
            {/* Mode Selection */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl">
              <div className="text-center mb-8">
                <Gamepad2 className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Mode</h2>
                <p className="text-gray-300">Play with friends in real-time multiplayer</p>
              </div>
              
              <div className="space-y-6">
                <button
                  onClick={() => setMode('create')}
                  className="w-full p-6 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <Plus className="w-8 h-8" />
                    <span>CREATE ROOM</span>
                  </div>
                  <p className="text-sm mt-2 opacity-90">Start a new game and invite friends</p>
                </button>
                
                <button
                  onClick={() => setMode('join')}
                  className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <LogIn className="w-8 h-8" />
                    <span>JOIN ROOM</span>
                  </div>
                  <p className="text-sm mt-2 opacity-90">Enter a room code to join a game</p>
                </button>
              </div>
            </div>

            {/* How to Play */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
              <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>How Multiplayer Works</span>
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• 2-6 players per room</li>
                <li>• Everyone gets the same question simultaneously</li>
                <li>• Lock in your answer within the time limit</li>
                <li>• See what others chose after everyone answers</li>
                <li>• Chat with other players during the game</li>
                <li>• Highest score wins!</li>
              </ul>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-green-500 shadow-2xl">
            <div className="text-center mb-8">
              <Plus className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Create Room</h2>
              <p className="text-gray-300">Set up a new multiplayer game</p>
            </div>
            
            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">Your Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-green-400 focus:outline-none"
                  maxLength={20}
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-900 border border-red-500 rounded-xl p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || !nickname.trim()}
                className={`w-full py-4 font-bold text-xl rounded-xl transition-all duration-300 ${
                  loading || !nickname.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:scale-105 shadow-lg hover:shadow-green-500/50'
                }`}
              >
                {loading ? 'CREATING ROOM...' : 'CREATE ROOM'}
              </button>
            </form>
          </div>
        )}

        {mode === 'join' && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-blue-500 shadow-2xl">
            <div className="text-center mb-8">
              <LogIn className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Join Room</h2>
              <p className="text-gray-300">Enter a room code to join an existing game</p>
            </div>
            
            <form onSubmit={handleJoinRoom} className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character room code"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-400 focus:outline-none text-center text-2xl font-bold tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-bold mb-2">Your Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-400 focus:outline-none"
                  maxLength={20}
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-900 border border-red-500 rounded-xl p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || !nickname.trim() || !roomCode.trim()}
                className={`w-full py-4 font-bold text-xl rounded-xl transition-all duration-300 ${
                  loading || !nickname.trim() || !roomCode.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-105 shadow-lg hover:shadow-blue-500/50'
                }`}
              >
                {loading ? 'JOINING ROOM...' : 'JOIN ROOM'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Multiplayer;