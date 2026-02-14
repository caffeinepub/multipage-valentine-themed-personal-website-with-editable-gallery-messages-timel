import { useGetAllGalleryItems } from '../hooks/useQueries';
import GalleryCarousel from '../components/GalleryCarousel';
import { Heart, Image as ImageIcon } from 'lucide-react';

export default function MemoriesGalleryPage() {
  const { data: galleryItems, isLoading } = useGetAllGalleryItems();

  const sortedItems = galleryItems
    ? [...galleryItems].sort((a, b) => Number(a.order) - Number(b.order))
    : [];

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
        <ImageIcon className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">Our Memories</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A beautiful collection of moments we've shared together
        </p>
      </div>

      {sortedItems.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No memories yet. Start adding photos to create your gallery!</p>
        </div>
      ) : (
        <GalleryCarousel items={sortedItems} />
      )}
    </div>
  );
}
