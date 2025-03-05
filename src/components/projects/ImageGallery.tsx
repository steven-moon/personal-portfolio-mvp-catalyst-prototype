import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LocalImage from '@/components/ui/LocalImage';

// Default gallery images to use when none are provided
const DEFAULT_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&auto=format",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&auto=format"
];

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Check if we have valid images or need to use defaults
  const hasValidImages = images && images.length > 0 && !images.every(img => img === "/placeholder.svg");
  const displayImages = hasValidImages ? images : DEFAULT_GALLERY_IMAGES;
  
  const handlePrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden neu-pressed dark:shadow-dark-neu-pressed">
        <LocalImage 
          src={displayImages[currentIndex]} 
          alt={`Project image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          fallbackSrc="/placeholder.svg"
        />
        
        {displayImages.length > 1 && (
          <>
            <button 
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 text-black dark:text-white hover:bg-white dark:hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 text-black dark:text-white hover:bg-white dark:hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {displayImages.length > 1 && (
        <div className="flex overflow-x-auto gap-2 py-2 px-1">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                index === currentIndex ? 'ring-2 ring-primary' : 'opacity-80'
              }`}
            >
              <LocalImage 
                src={image} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                fallbackSrc="/placeholder.svg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
