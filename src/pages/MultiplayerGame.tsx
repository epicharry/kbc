import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Send, Crown } from 'lucide-react';
import { valorantQuestions } from '../data/questions';
import { 
  supabase, 
  Player, 
  GameRoom, 
  PlayerAnswer,
  ChatMessage,
  getRoomPlayers, 
  submitAnswer, 
  getQuestionAnswers,
  sendChatMessage,
  getChatMessages,
  updatePlayerLastSeen,
  nextQuestion,
  endGame
} from '../lib/supabase';
import QuestionBox from '../components/QuestionBox';
import AnswerButton from '../components/AnswerButton';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';

const MultiplayerGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room: initialRoom, player } = location.state as { room: GameRoom; player: Player };
  
  const [room, setRoom] = useState<GameRoom>(initialRoom);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<PlayerAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [waitingForPlayers, setWaitingForPlayers] = useState(false);
  const [kickTimer, setKickTimer] = useState(0);

  const currentQuestion = valorantQuestions[room.current_question - 1];
  const totalQuestions = valorantQuestions.length;

  useEffect(() => {
    if (!room || !player) {
      navigate('/multiplayer');
      return;
    }

    loadPlayers();
    loadChatMessages();
    
    // Subscribe to room updates
    const roomSubscription = supabase
      .channel(`game-room-${room.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms'
      }, (payload) => {
        setRoom(payload.new as GameRoom);
        if (payload.new.status === 'finished') {
          navigate('/multiplayer-results', { 
            state: { room: payload.new, player, players }
          });
        }
      })
      .subscribe();

    // Subscribe to player updates
    const playersSubscription = supabase
      .channel(`game-players-${room.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `room_id=eq.${room.id}`
      }, () => {
        loadPlayers();
      })
      .subscribe();

    // Subscribe to answers
    const answersSubscription = supabase
      .channel(`game-answers-${room.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'player_answers',
        filter: `room_id=eq.${room.id}`
      }, () => {
        loadQuestionAnswers();
      })
      .subscribe();

    // Subscribe to chat
    const chatSubscription = supabase
      .channel(`game-chat-${room.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${room.id}`
      }, () => {
        loadChatMessages();
      })
      .subscribe();

    // Heartbeat
    const heartbeat = setInterval(() => {
      updatePlayerLastSeen(player.id);
    }, 5000);

    return () => {
      roomSubscription.unsubscribe();
      playersSubscription.unsubscribe();
      answersSubscription.unsubscribe();
      chatSubscription.unsubscribe();
      clearInterval(heartbeat);
    };
  }, [room.id, player.id, navigate]);

  // Load question answers when question changes
  useEffect(() => {
    if (room.current_question > 0) {
      loadQuestionAnswers();
      setHasAnswered(false);
      setSelectedAnswer(null);
      setShowResults(false);
      setWaitingForPlayers(false);
      setKickTimer(0);
    }
  }, [room.current_question]);

  // Check if all players have answered
  useEffect(() => {
    console.log('Checking answer status:', { 
      questionAnswersLength: questionAnswers.length, 
      playersLength: players.length,
      currentQuestion: room.current_question,
      showResults 
    });
    
    if (questionAnswers.length > 0 && players.length > 0) {
      const activePlayers = players.filter(p => p.is_active);
      const answeredPlayers = questionAnswers.filter(a => a.question_number === room.current_question);
      
      console.log('Active players:', activePlayers.length);
      console.log('Answered players:', answeredPlayers.length);
      
      if (answeredPlayers.length === activePlayers.length && !showResults) {
        console.log('All players answered, showing results...');
        setShowResults(true);
        setWaitingForPlayers(false);
        
        // Auto advance after showing results
        setTimeout(() => {
          if (player.is_host) {
            console.log('Host advancing to next question...');
            handleNextQuestion();
          }
        }, 5000);
      } else if (hasAnswered && answeredPlayers.length < activePlayers.length) {
        console.log('Waiting for other players...');
        setWaitingForPlayers(true);
      }
    }
  }, [questionAnswers, players, room.current_question, hasAnswered, showResults, player.is_host]);

  const loadPlayers = async () => {
    try {
      const roomPlayers = await getRoomPlayers(room.id);
      setPlayers(roomPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const loadQuestionAnswers = async () => {
    try {
      console.log('Loading answers for question:', room.current_question);
      const answers = await getQuestionAnswers(room.id, room.current_question);
      console.log('Loaded answers:', answers);
      setQuestionAnswers(answers);
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  const loadChatMessages = async () => {
    try {
      const messages = await getChatMessages(room.id);
      setChatMessages(messages);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleAnswerSelect = async (answerIndex: number) => {
    if (hasAnswered || showResults) return;
    
    console.log('Answer selected:', answerIndex);
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    console.log('Is correct:', isCorrect);
    
    try {
      await submitAnswer(
        room.id,
        player.id,
        room.current_question,
        answerIndex,
        isCorrect
      );
      console.log('Answer submitted successfully');
      
      // Force reload answers after submission
      setTimeout(() => {
        loadQuestionAnswers();
      }, 500);
      
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Reset state on error
      setHasAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const handleNextQuestion = async () => {
    if (!player.is_host) return;
    
    console.log('Moving to next question...');
    if (room.current_question >= totalQuestions) {
      console.log('Game complete, ending game...');
      await endGame(room.id);
    } else {
      console.log('Advancing to question:', room.current_question + 1);
      await nextQuestion(room.id, room.current_question + 1);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    try {
      await sendChatMessage(room.id, player.id, player.nickname, chatInput);
      setChatInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTimeUp = useCallback(() => {
    if (!hasAnswered) {
      setKickTimer(10);
      const kickInterval = setInterval(() => {
        setKickTimer(prev => {
          if (prev <= 1) {
            clearInterval(kickInterval);
            // Kick player logic here
            navigate('/multiplayer-results', { 
              state: { room, player, players, kicked: true }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [hasAnswered, navigate, room, player, players]);

  const getPlayerAnswer = (playerId: string) => {
    return questionAnswers.find(a => 
      a.player_id === playerId && a.question_number === room.current_question
    );
  };

  const getAnswerIcon = (answerIndex: number) => {
    return ['A', 'B', 'C', 'D'][answerIndex];
  };

  const getAnswerColor = (answerIndex: number, isCorrect: boolean) => {
    if (isCorrect) return 'text-green-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="flex">
        {/* Main Game Area */}
        <div className={`${showChat ? 'w-2/3' : 'w-full'} pr-4`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/multiplayer-lobby', { state: { room, player } })}
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Lobby</span>
            </button>
            
            <h1 className="text-2xl font-bold text-yellow-400">
              MULTIPLAYER QUIZ
            </h1>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
          </div>

          {/* Progress Bar */}
          <ProgressBar 
            currentQuestion={room.current_question} 
            totalQuestions={totalQuestions} 
          />

          {/* Timer */}
          <Timer
            duration={60}
            isActive={!hasAnswered && !showResults && kickTimer === 0}
            onTimeUp={handleTimeUp}
            onReset={false}
          />

          {/* Kick Warning */}
          {kickTimer > 0 && (
            <div className="text-center mb-6">
              <div className="inline-block bg-red-900 px-8 py-4 rounded-xl border-2 border-red-500">
                <p className="text-red-300 text-xl font-bold">
                  ⚠️ You will be kicked in {kickTimer} seconds!
                </p>
              </div>
            </div>
          )}

          {/* Question */}
          <QuestionBox
            question={currentQuestion.question}
            questionNumber={room.current_question}
            showHint={false}
          />

          {/* Players Status */}
          <div className="mb-8">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Players ({players.filter(p => p.is_active).length})</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {players.filter(p => p.is_active).map((p) => {
                  const answer = getPlayerAnswer(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`bg-gray-700 rounded-lg p-3 border-2 ${
                        p.id === player.id ? 'border-yellow-400' : 'border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold text-sm">{p.nickname}</span>
                          {p.is_host && <Crown className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-xs">Score: {p.score}</span>
                          {answer && (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                              showResults 
                                ? getAnswerColor(answer.answer_index, answer.is_correct)
                                : 'text-yellow-400 border-yellow-400'
                            }`}>
                              {getAnswerIcon(answer.answer_index)}
                            </div>
                          )}
                          {!answer && !showResults && (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-500 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <AnswerButton
                key={index}
                letter={['A', 'B', 'C', 'D'][index] as 'A' | 'B' | 'C' | 'D'}
                text={option}
                onClick={() => handleAnswerSelect(index)}
                isSelected={selectedAnswer === index}
                isCorrect={showResults && index === currentQuestion.correctAnswer}
                isWrong={showResults && selectedAnswer === index && index !== currentQuestion.correctAnswer}
                isDisabled={hasAnswered || showResults || kickTimer > 0}
                showSuspense={false}
              />
            ))}
          </div>

          {/* Status Messages */}
          {waitingForPlayers && (
            <div className="text-center">
              <div className="inline-block bg-blue-900 px-8 py-4 rounded-xl border border-blue-500">
                <p className="text-blue-300 text-lg font-bold">
                  Waiting for other players to answer...
                </p>
              </div>
            </div>
          )}

          {showResults && (
            <div className="text-center">
              <div className="inline-block bg-green-900 px-8 py-4 rounded-xl border border-green-500 mb-4">
                <p className="text-green-300 text-xl font-bold">
                  Round Complete! Next question in 5 seconds...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-1/3 bg-gray-800 rounded-xl border border-gray-600 flex flex-col h-96">
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-lg font-bold text-white">Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((message) => (
                <div key={message.id} className="text-sm">
                  <span className="text-yellow-400 font-bold">{message.player_nickname}:</span>
                  <span className="text-gray-300 ml-2">{message.message}</span>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-600">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                  maxLength={200}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerGame;