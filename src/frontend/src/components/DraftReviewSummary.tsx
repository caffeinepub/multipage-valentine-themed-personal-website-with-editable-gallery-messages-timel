import { useGetAllGalleryItems, useGetAllLoveMessages } from '../hooks/useQueries';
import { Heart, Image, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DraftReviewSummary() {
  const { data: galleryItems, isLoading: galleryLoading, isFetched: galleryFetched } = useGetAllGalleryItems();
  const { data: loveMessages, isLoading: messagesLoading, isFetched: messagesFetched } = useGetAllLoveMessages();
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);

  const isLoading = galleryLoading || messagesLoading;
  const isFetched = galleryFetched && messagesFetched;

  useEffect(() => {
    if (isFetched && !lastLoaded) {
      setLastLoaded(new Date());
    }
  }, [isFetched, lastLoaded]);

  const galleryCount = galleryItems?.length ?? 0;
  const messagesCount = loveMessages?.length ?? 0;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Draft Review</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          <span>Loading your content...</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">{galleryCount}</span>
              <span className="text-muted-foreground">photo{galleryCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">{messagesCount}</span>
              <span className="text-muted-foreground">message{messagesCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {lastLoaded && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/30">
              <Clock className="w-4 h-4" />
              <span>
                Last loaded: {lastLoaded.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
