import { useGetFinalDedication } from '../hooks/useQueries';
import { Heart, BookHeart } from 'lucide-react';

export default function FinalDedicationPage() {
  const { data: dedication, isLoading } = useGetFinalDedication();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <BookHeart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">
            {dedication?.title || 'Final Dedication'}
          </h1>
        </div>

        {dedication ? (
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-romantic border border-border/50 animate-fadeIn">
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground/90 whitespace-pre-wrap font-serif leading-relaxed text-lg">
                {dedication.message}
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="font-script text-3xl text-primary text-right">
                With all my love ❤️
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <BookHeart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No dedication message yet. Add one to complete your site!</p>
          </div>
        )}

        {/* Divider */}
        <div className="mt-12 flex items-center justify-center">
          <img
            src="/assets/generated/rose-gold-divider.dim_1600x200.png"
            alt=""
            className="w-full max-w-xl h-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
