import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Play, Copy, Check } from 'lucide-react';
import { supabase, Player, GameRoom, getRoomPlayers, startGame, updatePlayerLastSeen } from '../lib/supabase';

const MultiplayerLobby: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room: initialRoom, player } = location.state as { room: GameRoom; player: Player };
  
  const [room, setRoom] = useState<GameRoom>(initialRoom);
  const [players, setPlayers] = useState<Player[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!room || !player) {
      navigate('/multiplayer');
      return;
    }

    loadPlayers();
    
    // Poll for room status changes every second
    const statusInterval = setInterval(async () => {
      try {
        const { data: currentRoom, error } = await supabase
          .from('game_rooms')
          .select('*')
          .eq('id', room.id)
          .single();
          
        if (!error && currentRoom) {
          console.log('Polling room status:', currentRoom.status);
          setRoom(currentRoom);
          
          if (currentRoom.status === 'playing') {
            console.log('Game started! Navigating to game...');
            clearInterval(statusInterval);
            navigate('/multiplayer-game', { 
              state: { room: currentRoom, player }
            });
          }
        }
      } catch (error) {
        console.error('Error polling room status:', error);
      }
    }, 1000);

    // Poll for player changes every 3 seconds
    const playersInterval = setInterval(() => {
      loadPlayers();
    }, 3000);

    // Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      updatePlayerLastSeen(player.id);
    }, 5000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(playersInterval);
      clearInterval(heartbeat);
    };
  }, [room.id, player.id, navigate]);

  const loadPlayers = async () => {
    try {
      const roomPlayers = await getRoomPlayers(room.id);
      console.log('Loaded players:', roomPlayers.length);
      setPlayers(roomPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const handleStartGame = async () => {
    if (!player.is_host || players.length < 2) return;
    
    setLoading(true);
    try {
      console.log('Starting game for room:', room.id);
      const updatedRoom = await startGame(room.id);
      console.log('Game start response:', updatedRoom);
      
      // Immediately navigate after successful start
      setTimeout(() => {
        navigate('/multiplayer-game', { 
          state: { room: updatedRoom, player }
        });
      }, 500);
      
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game: ' + (error as Error).message);
      setLoading(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.room_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlayerStatusColor = (player: Player) => {
    const lastSeen = new Date(player.last_seen);
    const now = new Date();
    const diffSeconds = (now.getTime() - lastSeen.getTime()) / 1000;
    
    if (diffSeconds < 10) return 'bg-green-500';
    if (diffSeconds < 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/multiplayer')}
          className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
          🎮 MULTIPLAYER LOBBY
        </h1>
        
        <div className="w-24"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Room Info */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Room Code</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-4xl tracking-widest">
                {room.room_code}
              </div>
              <button
                onClick={copyRoomCode}
                className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
            <p className="text-gray-300 mt-4">
              Share this code with friends to join the game
            </p>
          </div>

          {/* Players List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Players ({players.length}/{room.max_players})</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`bg-gray-800 rounded-xl p-4 border-2 ${
                    p.id === player.id ? 'border-yellow-400' : 'border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getPlayerStatusColor(p)}`}></div>
                      <span className="text-white font-bold">{p.nickname}</span>
                      {p.is_host && <Crown className="w-5 h-5 text-yellow-400" />}
                      {p.id === player.id && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">YOU</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Score: {p.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="text-center">
            {player.is_host ? (
              <div>
                <button
                  onClick={handleStartGame}
                  disabled={players.length < 2 || loading}
                  className={`px-12 py-6 font-bold text-2xl rounded-2xl transition-all duration-300 ${
                    players.length >= 2 && !loading
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:scale-105 shadow-lg hover:shadow-green-500/50'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Play className="w-8 h-8" />
                    <span>{loading ? 'STARTING...' : 'START GAME'}</span>
                  </div>
                </button>
                {players.length < 2 && (
                  <p className="text-yellow-400 mt-4">
                    Need at least 2 players to start
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-block bg-blue-900 px-8 py-4 rounded-xl border border-blue-500">
                  <p className="text-blue-300 text-lg font-bold">
                    Waiting for host to start the game...
                  </p>
                  <p className="text-blue-400 text-sm mt-2">
                    Room Status: {room.status}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">🎯 Multiplayer Rules</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Everyone gets the same question at the same time</li>
            <li>• Lock in your answer within the timer</li>
            <li>• See what others chose after everyone answers</li>
            <li>• Taking too long (extra 10s) will kick you from the game</li>
            <li>• Use the chat to communicate with other players</li>
            <li>• Highest score wins!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerLobby;