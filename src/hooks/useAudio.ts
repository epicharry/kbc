import { useRef, useCallback } from 'react';

export const useAudio = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playAudio = useCallback((audioUrl: string, volume: number = 0.5) => {
    if (!audioUrl) return;
    
    try {
      if (!audioRefs.current[audioUrl]) {
        audioRefs.current[audioUrl] = new Audio(audioUrl);
        audioRefs.current[audioUrl].preload = 'auto';
      }
      
      const audio = audioRefs.current[audioUrl];
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const stopAudio = useCallback((audioUrl: string) => {
    if (audioRefs.current[audioUrl]) {
      audioRefs.current[audioUrl].pause();
      audioRefs.current[audioUrl].currentTime = 0;
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return { playAudio, stopAudio, stopAllAudio };
};