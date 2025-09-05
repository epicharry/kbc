import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Settings, Power } from 'lucide-react';
import { valorantQuestions, Question } from '../data/questions';
import QuestionBox from '../components/QuestionBox';
import AnswerButton from '../components/AnswerButton';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import Lifelines from '../components/Lifelines';
import Confetti from '../components/Confetti';
import { useAudio } from '../hooks/useAudio';

const SoloGame: React.FC = () => {
  const navigate = useNavigate();
  const { playAudio, stopAllAudio, muteAllAudio, unmuteAllAudio } = useAudio();
  
  // Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showSuspense, setShowSuspense] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [currentMusicStage, setCurrentMusicStage] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [backgroundMusicMuted, setBackgroundMusicMuted] = useState(false);
  const [originalVolumes, setOriginalVolumes] = useState<{ [key: string]: number }>({});
  
  // Lifeline State
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [skipUsed, setSkipUsed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [disabledAnswers, setDisabledAnswers] = useState<number[]>([]);
  
  // Audio URLs - Replace with your actual audio file URLs
  const audioUrls = {
    // Stage-based background music
    backgroundMusicStage1: 'https://valradiant.xyz/audios/stage1.mp3',
    backgroundMusicStage2: 'https://valradiant.xyz/audios/stage2.mp3',
    backgroundMusicStage3: 'YOUR_STAGE_3_MUSIC_URL_HERE',
    backgroundMusicStage4: 'YOUR_STAGE_4_MUSIC_URL_HERE',
    backgroundMusicFinal: 'https://valradiant.xyz/audios/stage2.mp3',
    
    // Other audio effects
    timerTick: 'https://valradiant.xyz/audios/timer.mp3',
    timerWarning: 'YOUR_TIMER_WARNING_URL_HERE',
    correctAnswer: 'YOUR_CORRECT_ANSWER_URL_HERE',
    wrongAnswer: 'YOUR_WRONG_ANSWER_URL_HERE',
    suspense: 'YOUR_SUSPENSE_URL_HERE',
    milestone: 'YOUR_MILESTONE_URL_HERE'
  };

  // Volume controls for each audio type (0.0 to 1.0)
  const audioVolumes = {
    // Background music volumes (lower to not overpower other sounds)
    backgroundMusicStage1: 0.05,
    backgroundMusicStage2: 0.18,
    backgroundMusicStage3: 0.20,
    backgroundMusicStage4: 0.25,
    backgroundMusicFinal: 0.30,
    
    // Sound effect volumes
    timerTick: 0.10,
    timerWarning: 0.60,
    correctAnswer: 0.80,
    wrongAnswer: 0.70,
    suspense: 0.50,
    milestone: 0.75
  };

  const currentQuestion = valorantQuestions[currentQuestionIndex];
  const totalQuestions = valorantQuestions.length;
  
  // Get current stage background music
  const getCurrentBackgroundMusic = () => {
    if (currentQuestionIndex < 10) return { music: audioUrls.backgroundMusicStage1, stage: 1 };
    if (currentQuestionIndex < 20) return { music: audioUrls.backgroundMusicStage2, stage: 2 };
    if (currentQuestionIndex < 35) return { music: audioUrls.backgroundMusicStage3, stage: 3 };
    if (currentQuestionIndex < 49) return { music: audioUrls.backgroundMusicStage4, stage: 4 };
    return { music: audioUrls.backgroundMusicFinal, stage: 5 };
  };
  
  // Get current stage background music volume
  const getCurrentBackgroundMusicVolume = () => {
    if (currentQuestionIndex < 10) return audioVolumes.backgroundMusicStage1;
    if (currentQuestionIndex < 20) return audioVolumes.backgroundMusicStage2;
    if (currentQuestionIndex < 35) return audioVolumes.backgroundMusicStage3;
    if (currentQuestionIndex < 49) return audioVolumes.backgroundMusicStage4;
    return audioVolumes.backgroundMusicFinal;
  };
  
  // Dynamic timer duration based on question difficulty
  const getTimerDuration = () => {
    if (currentQuestionIndex < 10) return 60; // Easy questions: 60 seconds
    if (currentQuestionIndex < 20) return 60; // Medium questions: 60 seconds  
    return 30; // Hard questions: 30 seconds
  };
  
  // Dynamic suspense duration based on question difficulty
  const getSuspenseDuration = () => {
    if (currentQuestionIndex < 15) return 1000; // Early: 1 second
    if (currentQuestionIndex < 30) return 2000; // Mid: 2 seconds
    if (currentQuestionIndex < 49) return 3000; // Late: 3 seconds
    return 4000; // Final question: 4 seconds
  };
  
  // Check if current question is a milestone
  const milestones = [5, 10, 20, 35, 50];
  const isAtMilestone = (questionNum: number) => milestones.includes(questionNum);
  
  // Initialize audio on first user interaction
  const initializeAudio = () => {
    if (!audioInitialized) {
      // Start the first stage background music
      const { music: currentMusic } = getCurrentBackgroundMusic();
      const currentVolume = getCurrentBackgroundMusicVolume();
      if (currentMusic) {
        playAudio(currentMusic, currentVolume, true); // Enable looping for background music
      }
      setAudioInitialized(true);
      setGameStarted(true);
    }
  };
  
  // Recharge 50-50 at milestones
  useEffect(() => {
    if (isAtMilestone(currentQuestionIndex + 1) && currentQuestionIndex > 0 && audioInitialized) {
      setFiftyFiftyUsed(false);
      playAudio(audioUrls.milestone, audioVolumes.milestone);
    }
  }, [currentQuestionIndex, playAudio, audioInitialized]);
  
  // Background music management - change music based on stage
  useEffect(() => {
    if (!audioInitialized || !gameStarted) return;
    
    const { music: currentMusic, stage } = getCurrentBackgroundMusic();
    const currentVolume = getCurrentBackgroundMusicVolume();
    
    // Only change music if we've moved to a new stage
    if (stage !== currentMusicStage && currentMusic) {
      console.log(`🎵 Changing to stage ${stage} music`);
      
      // Stop all current audio first
      stopAllAudio();
      
      // Start new stage music after a brief delay
      setTimeout(() => {
        playAudio(currentMusic, currentVolume, true); // Enable looping for background music
        setCurrentMusicStage(stage);
      }, 500);
    }
  }, [currentQuestionIndex, playAudio]);
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || showSuspense || disabledAnswers.includes(answerIndex) || !gameStarted) return;
    
    // Initialize audio on first interaction if not already done
    if (!audioInitialized) {
      initializeAudio();
    }
    
    setSelectedAnswer(answerIndex);
    setShowSuspense(true);
    
    // Play suspense audio
    if (audioInitialized) {
      playAudio(audioUrls.suspense, audioVolumes.suspense);
    }
    
    const suspenseDuration = getSuspenseDuration();
    
    if (currentQuestionIndex >= 30) {
      // Show wrong answers fading out first, then reveal correct
      setTimeout(() => {
        const wrongAnswers = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswer);
        wrongAnswers.forEach((wrongIndex, i) => {
          setTimeout(() => {
            setDisabledAnswers(prev => [...prev, wrongIndex]);
          }, i * 300);
        });
      }, suspenseDuration - 1000);
    }
    
    setTimeout(() => {
      setShowSuspense(false);
      setShowResult(true);
      
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
        setShowConfetti(true);
        if (audioInitialized) {
          playAudio(audioUrls.correctAnswer, audioVolumes.correctAnswer);
        }
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        if (audioInitialized) {
          playAudio(audioUrls.wrongAnswer, audioVolumes.wrongAnswer);
        }
        setGameOver(true);
        setTimeout(() => {
          navigate('/results', { 
            state: { 
              questionsAnswered: currentQuestionIndex + 1,
              correctAnswers,
              totalQuestions,
              reason: 'wrong_answer'
            }
          });
        }, 3000);
        return;
      }
      
      // Auto-advance to next question or end game
      setTimeout(() => {
        if (currentQuestionIndex + 1 >= totalQuestions) {
          navigate('/results', { 
            state: { 
              questionsAnswered: totalQuestions,
              correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
              totalQuestions,
              reason: 'completed'
            }
          });
        } else {
          nextQuestion();
        }
      }, 2000);
    }, suspenseDuration);
  };
  
  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowSuspense(false);
    setShowHint(false);
    setDisabledAnswers([]);
    setResetTimer(true);
    setTimeout(() => setResetTimer(false), 100);
  };
  
  const handleEndGame = () => {
    const confirmed = window.confirm(
      `Are you sure you want to end the game? You will keep your progress up to the last milestone reached.`
    );
    
    if (confirmed) {
      stopAllAudio();
      // Find the last milestone reached
      const lastMilestone = milestones.reduce((prev, curr) => 
        correctAnswers >= curr ? curr : prev, 0
      );
      
      navigate('/results', { 
        state: { 
          questionsAnswered: currentQuestionIndex,
          correctAnswers: lastMilestone, // Keep milestone progress
          totalQuestions,
          reason: 'ended_game'
        }
      });
    }
  };
  
  const handleTimeUp = useCallback(() => {
    if (showResult || showSuspense) return;
    
    setGameOver(true);
    setTimeout(() => {
      navigate('/results', { 
        state: { 
          questionsAnswered: currentQuestionIndex,
          correctAnswers,
          totalQuestions,
          reason: 'timeout'
        }
      });
    }, 1000);
  }, [showResult, showSuspense, currentQuestionIndex, correctAnswers, totalQuestions, navigate]);
  
  // Developer cheat code: H + G to jump to specific question
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if H and G are pressed simultaneously
      if (event.key.toLowerCase() === 'h' || event.key.toLowerCase() === 'g') {
        const otherKey = event.key.toLowerCase() === 'h' ? 'g' : 'h';
        
        // Check if the other key is also currently pressed
        const checkOtherKey = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === otherKey && gameStarted && !showResult && !showSuspense) {
            // Both keys pressed, show cheat dialog
            const questionNumber = prompt('🔧 DEV CHEAT: Enter question number (1-50):');
            if (questionNumber) {
              const num = parseInt(questionNumber);
              if (num >= 1 && num <= totalQuestions) {
                // Jump to the specified question
                setCurrentQuestionIndex(num - 1);
                setSelectedAnswer(null);
                setShowResult(false);
                setShowSuspense(false);
                setShowHint(false);
                setDisabledAnswers([]);
                setResetTimer(true);
                setTimeout(() => setResetTimer(false), 100);
                
                // Update correct answers to match the new question index
                setCorrectAnswers(Math.max(0, num - 1));
                
                console.log(`🔧 DEV CHEAT: Jumped to question ${num}`);
              } else {
                alert('Invalid question number. Please enter a number between 1 and 50.');
              }
            }
            
            // Remove the temporary listener
            document.removeEventListener('keydown', checkOtherKey);
          }
        };
        
        // Add temporary listener for the other key
        document.addEventListener('keydown', checkOtherKey);
        
        // Remove the listener after a short delay if other key wasn't pressed
        setTimeout(() => {
          document.removeEventListener('keydown', checkOtherKey);
        }, 500);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, showResult, showSuspense, totalQuestions]);
  
  // Lifeline Handlers
  const handleFiftyFifty = () => {
    if (fiftyFiftyUsed || showResult || showSuspense || !gameStarted) return;
    
    // Initialize audio on first interaction if not already done
    if (!audioInitialized) {
      initializeAudio();
    }
    
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswer);
    const toDisable = wrongAnswers.slice(0, 2);
    
    setDisabledAnswers(toDisable);
    setFiftyFiftyUsed(true);
  };
  
  const handleSkip = () => {
    if (skipUsed || showResult || showSuspense || !gameStarted) return;
    
    // Initialize audio on first interaction if not already done
    if (!audioInitialized) {
      initializeAudio();
    }
    
    setSkipUsed(true);
    if (currentQuestionIndex + 1 >= totalQuestions) {
      navigate('/results', { 
        state: { 
          questionsAnswered: currentQuestionIndex,
          correctAnswers,
          totalQuestions,
          reason: 'completed'
        }
      });
    } else {
      nextQuestion();
    }
  };
  
  const handleHint = () => {
    if (hintUsed || showResult || showSuspense || !gameStarted) return;
    
    // Initialize audio on first interaction if not already done
    if (!audioInitialized) {
      initializeAudio();
    }
    
    setHintUsed(true);
    setShowHint(true);
  };
  
  const getHintText = (question: Question) => {
    const hints: Record<string, string> = {
      1: "This agent is known for healing teammates and has a wall ability.",
      2: "Think about the standard team size in most competitive FPS games.",
      3: "This map is known for having teleporters instead of rotates.",
      4: "Every agent starts with this weapon at the beginning of rounds.",
      5: "This agent is a controller who can create one-way smokes.",
    };
    
    return hints[question.id.toString()] || "Think carefully about the question category.";
  };
  
  const handleQuestionAudioPlay = () => {
    if (!backgroundMusicMuted) {
      // Store original volumes before muting
      const volumes: { [key: string]: number } = {};
      Object.entries(audioUrls).forEach(([key, url]) => {
        if (key.includes('backgroundMusic')) {
          volumes[url] = audioVolumes[key as keyof typeof audioVolumes];
        }
      });
      setOriginalVolumes(volumes);
      
      // Mute background music
      muteAllAudio();
      setBackgroundMusicMuted(true);
    }
  };

  const handleQuestionAudioStop = () => {
    if (backgroundMusicMuted) {
      // Restore original volumes
      unmuteAllAudio(originalVolumes);
      setBackgroundMusicMuted(false);
    }
  };
  
  return (
    <div className="min-h-screen tv-show-bg p-4 md:p-6">
      {/* Premium Spotlight Effects */}
      <div className="spotlight spotlight-1"></div>
      <div className="spotlight spotlight-2"></div>
      <div className="spotlight spotlight-3"></div>
      
      <Confetti isActive={showConfetti} />
      
      {/* Game Start Overlay */}
      {!gameStarted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 border-4 border-yellow-500 shadow-2xl max-w-lg mx-4">
              <h2 className="text-4xl font-bold text-yellow-400 mb-6 tracking-wider">
                🎮 READY TO PLAY?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Click below to start your journey through 50 challenging Valorant questions!
              </p>
              <button
                onClick={initializeAudio}
                className="px-12 py-6 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-2xl rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 border-2 border-yellow-400 tracking-wider"
              >
                🚀 START QUIZ
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Audio will be enabled for the full experience
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleEndGame}
          className={`nav-btn-premium flex items-center space-x-3 px-6 py-3 text-white hover:text-yellow-400 transition-all duration-300 rounded-xl ${!gameStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!gameStarted}
        >
          <Power className="w-5 h-5" />
          <span className="font-semibold tracking-wider">END GAME</span>
        </button>
        
        <div className="text-center">
          <h1 className="title-premium text-2xl md:text-4xl font-bold">
            VALORANT KBC
          </h1>
          <div className="text-sm text-gray-300 tracking-widest mt-1">QUIZ CHAMPIONSHIP</div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="nav-btn-premium p-3 rounded-xl text-white hover:text-yellow-400 transition-all duration-300">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="nav-btn-premium p-3 rounded-xl text-white hover:text-yellow-400 transition-all duration-300">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <ProgressBar 
        currentQuestion={currentQuestionIndex + 1} 
        totalQuestions={totalQuestions} 
      />
      
      {/* Timer */}
      <Timer
        duration={getTimerDuration()}
        isActive={!showResult && !showSuspense && !gameOver && gameStarted}
        onTimeUp={handleTimeUp}
        onReset={resetTimer}
        timerAudioUrl={audioUrls.timerTick}
        warningAudioUrl={audioUrls.timerWarning}
        audioVolume={{
          timer: audioVolumes.timerTick,
          warning: audioVolumes.timerWarning
        }}
      />
      
      {/* Question Box */}
      <QuestionBox
        question={currentQuestion.question}
        questionNumber={currentQuestionIndex + 1}
        hint={getHintText(currentQuestion)}
        showHint={showHint}
        imageUrl={currentQuestion.imageUrl}
        audioUrl={currentQuestion.audioUrl}
        onAudioPlay={handleQuestionAudioPlay}
        onAudioStop={handleQuestionAudioStop}
      />
      
      {/* Lifelines */}
      <Lifelines
        fiftyFiftyUsed={fiftyFiftyUsed}
        skipUsed={skipUsed}
        hintUsed={hintUsed}
        onFiftyFifty={handleFiftyFifty}
        onSkip={handleSkip}
        onHint={handleHint}
        disabled={showResult || showSuspense || gameOver || !gameStarted}
      />
      
      {/* Answer Buttons */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {currentQuestion.options.map((option, index) => (
          <AnswerButton
            key={index}
            letter={['A', 'B', 'C', 'D'][index] as 'A' | 'B' | 'C' | 'D'}
            text={option}
            onClick={() => handleAnswerSelect(index)}
            isSelected={selectedAnswer === index}
            isCorrect={showResult && index === currentQuestion.correctAnswer}
            isWrong={showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer}
            isDisabled={showResult || showSuspense || gameOver || disabledAnswers.includes(index) || !gameStarted}
            showSuspense={showSuspense && selectedAnswer === index}
          />
        ))}
      </div>
      
      {/* Game Status Messages */}
      {showSuspense && (
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-yellow-900/70 to-yellow-800/70 px-12 py-6 rounded-3xl border-2 border-yellow-400/70 backdrop-blur-lg shadow-2xl">
            <p className="text-3xl md:text-4xl font-bold text-yellow-300 animate-pulse tracking-wider mb-3">
              {currentQuestionIndex >= 30 ? 'FINAL ANSWER?' : 'IS THAT YOUR FINAL ANSWER?'}
            </p>
            {currentQuestionIndex >= 30 && (
              <p className="text-lg text-yellow-200 animate-pulse">
                Eliminating wrong answers...
              </p>
            )}
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
      
      {showResult && !gameOver && (
        <div className="text-center mt-12">
          <div className={`inline-block px-12 py-6 rounded-3xl border-2 backdrop-blur-lg shadow-2xl ${
            selectedAnswer === currentQuestion.correctAnswer 
              ? 'bg-gradient-to-r from-green-900/70 to-green-800/70 border-green-400/70' 
              : 'bg-gradient-to-r from-red-900/70 to-red-800/70 border-red-400/70'
          }`}>
            <p className={`text-4xl md:text-5xl font-bold tracking-wider mb-2 ${
              selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedAnswer === currentQuestion.correctAnswer ? '🎉 CORRECT!' : '💥 INCORRECT!'}
            </p>
            {isAtMilestone(currentQuestionIndex + 1) && selectedAnswer === currentQuestion.correctAnswer && (
              <p className="text-xl text-yellow-300 font-bold animate-pulse">
                🏆 MILESTONE REACHED! 50-50 RECHARGED!
              </p>
            )}
          </div>
          {currentQuestionIndex + 1 < totalQuestions && (
            <p className="text-xl text-gray-300 mt-6 tracking-wide animate-pulse">
              Advancing to next question...
            </p>
          )}
        </div>
      )}
      
      {gameOver && (
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-red-900/70 to-red-800/70 px-12 py-8 rounded-3xl border-2 border-red-400/70 backdrop-blur-lg shadow-2xl">
            <p className="text-5xl md:text-6xl font-bold text-red-400 mb-4 tracking-wider">
              💀 GAME OVER
            </p>
            <p className="text-xl text-gray-300 tracking-wide mb-4">
              Calculating final results...
            </p>
            <div className="flex justify-center">
              <div className="loading-premium w-32 h-1 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoloGame;