import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';

export default function SurpriseReveal() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="max-w-2xl mx-auto text-center">
      {!isRevealed ? (
        <button
          onClick={() => setIsRevealed(true)}
          className="group relative rose-gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-medium hover:shadow-romantic transition-all hover:scale-105"
        >
          <Gift className="w-8 h-8 mx-auto mb-2 group-hover:animate-heartbeat" />
          Click for a Surprise!
        </button>
      ) : (
        <div className="bg-card rounded-2xl p-8 shadow-romantic animate-fadeIn">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-heartbeat" />
          <h3 className="font-script text-3xl text-primary mb-4">You're Amazing!</h3>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Every moment with you is a treasure. Your smile lights up my world, 
            and your love makes every day special. Thank you for being you! 💕
          </p>
        </div>
      )}
    </div>
  );
}
