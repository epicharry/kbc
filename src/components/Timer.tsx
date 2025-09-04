import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface TimerProps {
  duration: number;
  isActive: boolean;
  onTimeUp: () => void;
  onReset?: boolean;
  timerAudioUrl?: string;
  warningAudioUrl?: string;
  audioVolume?: {
    timer: number;
    warning: number;
  };
}

const Timer: React.FC<TimerProps> = ({ 
  duration, 
  isActive, 
  onTimeUp, 
  onReset, 
  timerAudioUrl, 
  warningAudioUrl,
  audioVolume
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const { playAudio, stopAudio } = useAudio();
  const [warningPlayed, setWarningPlayed] = useState(false);

  useEffect(() => {
    if (onReset) {
      setTimeLeft(duration);
      setWarningPlayed(false);
      if (timerAudioUrl) {
        stopAudio(timerAudioUrl);
      }
    }
  }, [onReset, duration, timerAudioUrl, stopAudio]);

  useEffect(() => {
    if (!isActive) {
      if (timerAudioUrl) {
        stopAudio(timerAudioUrl);
      }
      return;
    }

    // Start timer audio when timer becomes active
    if (timerAudioUrl && timeLeft === duration && audioVolume) {
      playAudio(timerAudioUrl, audioVolume.timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // Play warning sound at 10 seconds
        if (prev === 11 && !warningPlayed && warningAudioUrl && audioVolume) {
          playAudio(warningAudioUrl, audioVolume.warning);
          setWarningPlayed(true);
        }
        
        if (prev <= 1) {
          if (timerAudioUrl) {
            stopAudio(timerAudioUrl);
          }
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, timerAudioUrl, warningAudioUrl, playAudio, stopAudio, timeLeft, duration, warningPlayed]);

  const percentage = (timeLeft / duration) * 100;
  const strokeColor = timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? '#f97316' : '#eab308';
  
  return (
    <div className="timer-premium relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
      {/* Outer decorative ring */}
      <div className="absolute inset-0 rounded-full border-2 border-yellow-400/20 animate-pulse"></div>
      
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
        {/* Background circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(255, 215, 0, 0.1)"
          strokeWidth="1.5"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={strokeColor}
          strokeWidth="2.5"
          fill="transparent"
          strokeDasharray={`${2 * Math.PI * 10}`}
          strokeDashoffset={`${2 * Math.PI * 10 * (1 - percentage / 100)}`}
          className="transition-all duration-1000 ease-linear"
          style={{
            filter: `drop-shadow(0 0 12px ${strokeColor})`
          }}
        />
      </svg>
      
      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {timeLeft <= 10 && (
          <AlertTriangle className="w-6 h-6 text-red-400 animate-bounce mb-1" />
        )}
        <div className="flex items-center space-x-1">
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`} />
          <span className={`text-2xl md:text-3xl font-bold tracking-wider ${
            timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
          }`}>
            {timeLeft}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1 tracking-widest">SECONDS</div>
      </div>
      
      {/* Warning pulse effect for low time */}
      {timeLeft <= 10 && (
        <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-30"></div>
      )}
    </div>
  );
};

export default Timer;