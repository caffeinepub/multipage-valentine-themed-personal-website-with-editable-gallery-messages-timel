import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import type { GalleryItem } from '../backend';

interface GalleryCarouselProps {
  items: GalleryItem[];
}

export default function GalleryCarousel({ items }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => new Set(prev).add(itemId));
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];
  const hasImageError = imageErrors.has(currentItem.id);

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="relative bg-card rounded-2xl shadow-romantic overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted">
          {hasImageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <ImageOff className="w-12 h-12 mb-2" />
              <p className="text-sm">Image unavailable</p>
            </div>
          ) : (
            <img
              src={currentItem.image.getDirectURL()}
              alt={currentItem.caption}
              className="w-full h-full object-contain"
              onError={() => handleImageError(currentItem.id)}
            />
          )}
          
          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card p-3 rounded-full shadow-soft transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card p-3 rounded-full shadow-soft transition-all hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        <div className="p-6 text-center">
          <p className="text-lg text-foreground font-serif">{currentItem.caption}</p>
          {items.length > 1 && (
            <p className="text-sm text-muted-foreground mt-2">
              {currentIndex + 1} / {items.length}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {items.map((item, index) => {
            const thumbHasError = imageErrors.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-primary shadow-romantic scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {thumbHasError ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageOff className="w-6 h-6 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={item.image.getDirectURL()}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(item.id)}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
