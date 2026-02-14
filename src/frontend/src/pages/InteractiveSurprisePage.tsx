import { useGetInteractiveSurpriseConfig } from '../hooks/useQueries';
import SurpriseReveal from '../components/SurpriseReveal';
import LoveQuiz from '../components/LoveQuiz';
import FlipCard from '../components/FlipCard';
import HeartParticles from '../components/HeartParticles';
import { Heart, Sparkles } from 'lucide-react';

export default function InteractiveSurprisePage() {
  const { data: config, isLoading } = useGetInteractiveSurpriseConfig();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <HeartParticles />
      
      <div className="text-center mb-12 animate-fadeIn relative z-10">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">Interactive Surprise</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fun activities and surprises just for you!
        </p>
      </div>

      <div className="space-y-16 relative z-10">
        {/* Surprise Reveal */}
        <SurpriseReveal />

        {/* Love Quiz */}
        {config?.quizQuestions && config.quizQuestions.length > 0 && (
          <LoveQuiz questions={config.quizQuestions} />
        )}

        {/* Flip Cards */}
        {config?.flipCards && config.flipCards.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="font-script text-3xl text-primary text-center mb-8">Flip the Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.flipCards.map((card, index) => (
                <FlipCard key={index} front={card.front} back={card.back} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
