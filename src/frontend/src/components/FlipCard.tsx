import { useState } from 'react';

interface FlipCardProps {
  front: string;
  back: string;
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <button
      onClick={() => setIsFlipped(!isFlipped)}
      className="relative h-64 w-full perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-card rounded-2xl p-6 shadow-romantic border border-border/50 flex items-center justify-center backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-lg text-foreground text-center font-serif">{front}</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rose-gold-gradient rounded-2xl p-6 shadow-romantic flex items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-lg text-white text-center font-serif">{back}</p>
        </div>
      </div>
    </button>
  );
}
