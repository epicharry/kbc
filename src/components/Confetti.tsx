import React, { useEffect, useState } from 'react';
import { Star, Sparkles, Trophy } from 'lucide-react';

interface ConfettiProps {
  isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    color: string; 
    delay: number; 
    type: 'circle' | 'star' | 'sparkle';
    size: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const colors = ['#ffd700', '#ffed4e', '#ffa500', '#ff6b35', '#00d4ff', '#4ecdc4', '#45b7d1', '#96ceb4'];
    const types: Array<'circle' | 'star' | 'sparkle'> = ['circle', 'star', 'sparkle'];
    
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      type: types[Math.floor(Math.random() * types.length)],
      size: 4 + Math.random() * 8
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle absolute flex items-center justify-center"
          style={{
            left: `${particle.x}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s',
          }}
        >
          {particle.type === 'circle' && (
            <div 
              className="w-full h-full rounded-full"
              style={{ backgroundColor: particle.color }}
            />
          )}
          {particle.type === 'star' && (
            <Star 
              className="w-full h-full"
              style={{ color: particle.color }}
              fill={particle.color}
            />
          )}
          {particle.type === 'sparkle' && (
            <Sparkles 
              className="w-full h-full"
              style={{ color: particle.color }}
            />
          )}
        </div>
      ))}
      
      {/* Additional celebration effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-ping">
          <Trophy className="w-20 h-20 text-yellow-400 opacity-30" />
        </div>
      </div>
    </div>
  );
};

export default Confetti;