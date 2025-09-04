import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Send, Crown, X } from 'lucide-react';
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
import Confetti from '../components/Confetti';

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
  const [showSuspense, setShowSuspense] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [waitingForPlayers, setWaitingForPlayers] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  const currentQuestion = valorantQuestions[room.current_question - 1];
  const totalQuestions = valorantQuestions.length;

  useEffect(() => {
    if (!room || !player) {
      navigate('/multiplayer');
      return;
    }

    loadPlayers();
    loadChatMessages();
    loadQuestionAnswers();
    
    // Subscribe to room updates
    const roomChannel = supabase
      .channel(`multiplayer-room-${room.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `id=eq.${room.id}`
      }, (payload) => {
        console.log('Room updated:', payload.new);
        const newRoom = payload.new as GameRoom;
        setRoom(newRoom);
        
        if (newRoom.status === 'finished') {
          navigate('/multiplayer-results', { 
            state: { room: newRoom, player, players }
          });
        }
      })
      .subscribe();

    // Subscribe to player updates
    const playersChannel = supabase
      .channel(`multiplayer-players-${room.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `room_id=eq.${room.id}`
      }, () => {
        console.log('Players updated');
        loadPlayers();
      })
      .subscribe();

    // Subscribe to answers
    const answersChannel = supabase
      .channel(`multiplayer-answers-${room.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'player_answers',
        filter: `room_id=eq.${room.id}`
      }, (payload) => {
        console.log('New answer received:', payload.new);
        loadQuestionAnswers();
      })
      .subscribe();

    // Subscribe to chat
    const chatChannel = supabase
      .channel(`multiplayer-chat-${room.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${room.id}`
      }, (payload) => {
        console.log('New chat message:', payload.new);
        setChatMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    // Heartbeat
    const heartbeat = setInterval(() => {
      updatePlayerLastSeen(player.id);
    }, 5000);

    return () => {
      roomChannel.unsubscribe();
      playersChannel.unsubscribe();
      answersChannel.unsubscribe();
      chatChannel.unsubscribe();
      clearInterval(heartbeat);
    };
  }, [room.id, player.id, navigate]);

  // Reset state when question changes
  useEffect(() => {
    console.log('Question changed to:', room.current_question);
    setHasAnswered(false);
    setSelectedAnswer(null);
    setShowResults(false);
    setShowSuspense(false);
    setShowConfetti(false);
    setWaitingForPlayers(false);
    setResetTimer(true);
    setTimeout(() => setResetTimer(false), 100);
    
    // Load answers for new question
    if (room.current_question > 0) {
      loadQuestionAnswers();
    }
  }, [room.current_question]);

  // Check if all players have answered
  useEffect(() => {
    if (questionAnswers.length > 0 && players.length > 0 && !showResults) {
      const activePlayers = players.filter(p => p.is_active);
      const answeredPlayers = questionAnswers.filter(a => a.question_number === room.current_question);
      
      console.log('Checking answers:', {
        activePlayers: activePlayers.length,
        answeredPlayers: answeredPlayers.length,
        currentQuestion: room.current_question
      });
      
      if (answeredPlayers.length === activePlayers.length) {
        console.log('All players answered, showing results...');
        setShowResults(true);
        setWaitingForPlayers(false);
        
        // Show confetti for correct answers
        const myAnswer = answeredPlayers.find(a => a.player_id === player.id);
        if (myAnswer && myAnswer.is_correct) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        
        // Auto advance after showing results (only host)
        if (player.is_host) {
          setTimeout(() => {
            handleNextQuestion();
          }, 5000);
        }
      } else if (hasAnswered && answeredPlayers.length < activePlayers.length) {
        setWaitingForPlayers(true);
      }
    }
  }, [questionAnswers, players, room.current_question, hasAnswered, showResults, player.is_host, player.id]);

  const loadPlayers = async () => {
    try {
      const roomPlayers = await getRoomPlayers(room.id);
      console.log('Loaded players:', roomPlayers);
      setPlayers(roomPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const loadQuestionAnswers = async () => {
    try {
      const answers = await getQuestionAnswers(room.id, room.current_question);
      console.log('Loaded answers for question', room.current_question, ':', answers);
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
    if (hasAnswered || showResults || showSuspense) return;
    
    console.log('Answer selected:', answerIndex);
    setSelectedAnswer(answerIndex);
    setShowSuspense(true);
    
    // Show suspense for 2 seconds
    setTimeout(async () => {
      setShowSuspense(false);
      setHasAnswered(true);
      
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      console.log('Submitting answer:', { answerIndex, isCorrect });
      
      try {
        await submitAnswer(
          room.id,
          player.id,
          room.current_question,
          answerIndex,
          isCorrect
        );
        console.log('Answer submitted successfully');
      } catch (error) {
        console.error('Error submitting answer:', error);
        // Reset state on error
        setHasAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleNextQuestion = async () => {
    if (!player.is_host) return;
    
    console.log('Host advancing to next question...');
    if (room.current_question >= totalQuestions) {
      console.log('Game complete, ending game...');
      await endGame(room.id);
    } else {
      console.log('Moving to question:', room.current_question + 1);
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
    if (!hasAnswered && !showResults) {
      // Auto-submit a random answer or handle timeout
      console.log('Time up! Player did not answer');
      // For now, we'll just mark as answered without submitting
      setHasAnswered(true);
    }
  }, [hasAnswered, showResults]);

  const getPlayerAnswer = (playerId: string) => {
    return questionAnswers.find(a => 
      a.player_id === playerId && a.question_number === room.current_question
    );
  };

  const getAnswerIcon = (answerIndex: number) => {
    return ['A', 'B', 'C', 'D'][answerIndex];
  };

  const getAnswerColor = (answerIndex: number, isCorrect: boolean) => {
    if (isCorrect) return 'text-green-400 bg-green-500';
    return 'text-red-400 bg-red-500';
  };

  return (
    <div className="min-h-screen tv-show-bg relative overflow-hidden">
      {/* Premium Spotlight Effects */}
      <div className="spotlight spotlight-1"></div>
      <div className="spotlight spotlight-2"></div>
      <div className="spotlight spotlight-3"></div>
      
      <Confetti isActive={showConfetti} />
      
      <div className="flex h-screen">
        {/* Main Game Area */}
        <div className={`${showChat ? 'w-3/4' : 'w-4/5'} p-4 overflow-y-auto`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/multiplayer-lobby', { state: { room, player } })}
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Lobby</span>
            </button>
            
            <div className="text-center">
              <h1 className="title-premium text-2xl md:text-3xl font-bold">
                MULTIPLAYER QUIZ
              </h1>
              <div className="text-sm text-gray-300 tracking-widest">Room: {room.room_code}</div>
            </div>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="nav-btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl transition-all duration-300"
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
            isActive={!hasAnswered && !showResults && !showSuspense}
            onTimeUp={handleTimeUp}
            onReset={resetTimer}
          />

          {/* Question */}
          <QuestionBox
            question={currentQuestion.question}
            questionNumber={room.current_question}
            showHint={false}
          />

          {/* Answer Buttons */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {currentQuestion.options.map((option, index) => (
              <AnswerButton
                key={index}
                letter={['A', 'B', 'C', 'D'][index] as 'A' | 'B' | 'C' | 'D'}
                text={option}
                onClick={() => handleAnswerSelect(index)}
                isSelected={selectedAnswer === index}
                isCorrect={showResults && index === currentQuestion.correctAnswer}
                isWrong={showResults && selectedAnswer === index && index !== currentQuestion.correctAnswer}
                isDisabled={hasAnswered || showResults}
                showSuspense={showSuspense && selectedAnswer === index}
              />
            ))}
          </div>

          {/* Status Messages */}
          {showSuspense && (
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-yellow-900/70 to-yellow-800/70 px-12 py-6 rounded-3xl border-2 border-yellow-400/70 backdrop-blur-lg shadow-2xl">
                <p className="text-3xl md:text-4xl font-bold text-yellow-300 animate-pulse tracking-wider">
                  IS THAT YOUR FINAL ANSWER?
                </p>
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" 
                        style={{animationDelay: `${i * 0.15}s`}}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {waitingForPlayers && !showResults && (
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-900/70 px-8 py-4 rounded-xl border border-blue-500 backdrop-blur-lg">
                <p className="text-blue-300 text-lg font-bold animate-pulse">
                  Waiting for other players to answer...
                </p>
              </div>
            </div>
          )}

          {showResults && (
            <div className="text-center mb-8">
              <div className="inline-block bg-green-900/70 px-8 py-4 rounded-xl border border-green-500 backdrop-blur-lg">
                <p className="text-green-300 text-xl font-bold">
                  {selectedAnswer === currentQuestion.correctAnswer ? '🎉 CORRECT!' : '💥 WRONG ANSWER!'}
                </p>
                {player.is_host && (
                  <p className="text-green-200 text-sm mt-2">
                    Next question in 5 seconds...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Players Sidebar */}
        <div className={`${showChat ? 'w-1/4' : 'w-1/5'} bg-gray-900/90 backdrop-blur-sm border-l border-gray-700 p-4 overflow-y-auto`}>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-yellow-400" />
              <span>Players ({players.filter(p => p.is_active).length})</span>
            </h3>
            
            <div className="space-y-3">
              {players.filter(p => p.is_active).map((p) => {
                const answer = getPlayerAnswer(p.id);
                const isCurrentPlayer = p.id === player.id;
                
                return (
                  <div
                    key={p.id}
                    className={`bg-gray-800 rounded-xl p-4 border-2 transition-all duration-300 ${
                      isCurrentPlayer ? 'border-yellow-400 bg-yellow-900/20' : 'border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-sm ${isCurrentPlayer ? 'text-yellow-400' : 'text-white'}`}>
                          {p.nickname}
                        </span>
                        {p.is_host && <Crown className="w-4 h-4 text-yellow-400" />}
                        {isCurrentPlayer && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">YOU</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Score: {p.score}</span>
                      
                      {/* Answer Status */}
                      <div className="flex items-center space-x-2">
                        {answer ? (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                            showResults 
                              ? getAnswerColor(answer.answer_index, answer.is_correct)
                              : 'text-yellow-400 border-yellow-400 bg-yellow-400/20'
                          }`}>
                            {getAnswerIcon(answer.answer_index)}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-500 animate-pulse bg-gray-500/20"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-1/3 bg-gray-800/90 backdrop-blur-sm border-l border-gray-600 flex flex-col">
            <div className="p-4 border-b border-gray-600 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((message) => (
                <div key={message.id} className="text-sm">
                  <span className={`font-bold ${
                    message.player_id === player.id ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {message.player_nickname}:
                  </span>
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
                  disabled={!chatInput.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    chatInput.trim()
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
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