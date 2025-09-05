import React from 'react';
import { HelpCircle, Lightbulb, Image, Volume2, VolumeX } from 'lucide-react';

interface QuestionBoxProps {
  question: string;
  questionNumber: number;
  hint?: string;
  showHint: boolean;
  imageUrl?: string;
  audioUrl?: string;
  onAudioPlay?: () => void;
  onAudioStop?: () => void;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ 
  question, 
  questionNumber, 
  hint, 
  showHint,
  imageUrl,
  audioUrl,
  onAudioPlay,
  onAudioStop
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleAudioToggle = () => {
    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
      onAudioStop?.();
    } else {
      audioRef.current.play();
      setIsAudioPlaying(true);
      onAudioPlay?.();
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsAudioPlaying(false);
      onAudioStop?.();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [onAudioStop]);

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
          
          {/* Image Display */}
          {imageUrl && (
            <div className="mt-8 mb-8 flex justify-center">
              <div className="relative bg-gray-800 rounded-2xl p-4 border-2 border-blue-400/50 shadow-lg">
                <div className="flex items-center mb-3">
                  <Image className="w-6 h-6 text-blue-400 mr-3" />
                  <span className="text-blue-300 font-bold text-lg tracking-wider">QUESTION IMAGE</span>
                </div>
                <img 
                  src={imageUrl} 
                  alt="Question visual" 
                  className="max-w-full max-h-96 rounded-xl shadow-lg border border-gray-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <div className="mt-8 mb-8 flex justify-center">
              <div className="bg-gray-800 rounded-2xl p-6 border-2 border-purple-400/50 shadow-lg">
                <div className="flex items-center mb-4">
                  <Volume2 className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-purple-300 font-bold text-lg tracking-wider">QUESTION AUDIO</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAudioToggle}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      isAudioPlaying 
                        ? 'bg-red-600 hover:bg-red-500 text-white' 
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    {isAudioPlaying ? (
                      <>
                        <VolumeX className="w-5 h-5" />
                        <span>STOP AUDIO</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-5 h-5" />
                        <span>PLAY AUDIO</span>
                      </>
                    )}
                  </button>
                  {isAudioPlaying && (
                    <div className="flex items-center space-x-2 text-purple-300">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 h-6 bg-purple-400 rounded animate-pulse" 
                            style={{animationDelay: `${i * 0.2}s`}}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">Playing...</span>
                    </div>
                  )}
                </div>
                <audio ref={audioRef} src={audioUrl} preload="metadata" />
              </div>
            </div>
          )}
          
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