import { useGetPublishedFinalDedication } from '../hooks/useQueries';
import ValentineSurface from '../components/ValentineSurface';
import { Heart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FinalDedicationPage() {
  const { data: dedication, isLoading, isPublished, isError } = useGetPublishedFinalDedication();

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
        <Heart className="w-12 h-12 text-primary fill-primary mx-auto mb-4" />
        <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">
          {dedication?.title || 'A Special Dedication'}
        </h1>
      </div>

      {isError && (
        <div className="max-w-2xl mx-auto mb-8">
          <Alert className="border-destructive/30 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Unable to load dedication. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isError && (!isPublished || !dedication) ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {!isPublished 
              ? 'No published content yet. The site owner needs to publish their content first.' 
              : 'No dedication published yet.'}
          </p>
        </div>
      ) : !isError && dedication && (
        <ValentineSurface className="max-w-3xl mx-auto p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-center">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {dedication.message}
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <Heart className="w-8 h-8 text-primary fill-primary animate-heartbeat" />
          </div>
        </ValentineSurface>
      )}
    </div>
  );
}
