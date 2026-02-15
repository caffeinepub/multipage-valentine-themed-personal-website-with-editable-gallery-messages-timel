import { useGetPublishedInteractiveSurpriseConfig } from '../hooks/useQueries';
import LoveQuiz from '../components/LoveQuiz';
import FlipCard from '../components/FlipCard';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function InteractiveSurprisePage() {
  const { data: config, isLoading, isPublished, isError } = useGetPublishedInteractiveSurpriseConfig();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fadeIn">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">Interactive Surprise</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test your knowledge and discover hidden messages
        </p>
      </div>

      {isError && (
        <div className="max-w-2xl mx-auto mb-8">
          <Alert className="border-destructive/30 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Unable to load surprise content. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isError && (!isPublished || !config) ? (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {!isPublished 
              ? 'No published content yet. The site owner needs to publish their content first.' 
              : 'No surprise content published yet.'}
          </p>
        </div>
      ) : !isError && config && (
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Quiz Section */}
          {config.quizQuestions && config.quizQuestions.length > 0 && (
            <section>
              <h2 className="font-script text-3xl text-primary text-center mb-8">Love Quiz</h2>
              <LoveQuiz questions={config.quizQuestions} />
            </section>
          )}

          {/* Flip Cards Section */}
          {config.flipCards && config.flipCards.length > 0 && (
            <section>
              <h2 className="font-script text-3xl text-primary text-center mb-8">Flip the Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.flipCards.map((card, index) => (
                  <FlipCard key={index} front={card.front} back={card.back} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
