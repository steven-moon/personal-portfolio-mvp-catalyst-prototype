import React from 'react';
import { FileImage, Trash } from 'lucide-react';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicButton from './NeumorphicButton';
import LocalImage from './LocalImage';

interface ImageCardProps {
  imageUrl: string;
  isMain: boolean;
  index: number;
  onSetAsMain: (index: number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

/**
 * A card component for displaying project images with controls
 */
const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  isMain,
  index,
  onSetAsMain,
  onRemove,
  canRemove = true
}) => {
  console.log(`🖼️ DEBUG - ImageCard - Rendering image ${index}:`, imageUrl);
  
  return (
    <NeumorphicCard className="aspect-square overflow-hidden">
      <div className="w-full h-full relative">
        <LocalImage 
          src={imageUrl} 
          alt={`Project image ${index + 1}`} 
          className="w-full h-full object-cover object-center"
          fallbackSrc="/images/default-placeholder.jpg"
        />
        
        {isMain && (
          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded">
            Main
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 flex space-x-2">
          {!isMain && (
            <NeumorphicButton 
              onClick={() => onSetAsMain(index)}
              aria-label="Set as main image"
              className="p-2"
              variant="primary"
            >
              <FileImage className="w-4 h-4" />
            </NeumorphicButton>
          )}
          
          <NeumorphicButton 
            onClick={() => onRemove(index)}
            aria-label="Remove image"
            className="p-2"
            variant="secondary"
            disabled={!canRemove}
          >
            <Trash className="w-4 h-4" />
          </NeumorphicButton>
        </div>
      </div>
    </NeumorphicCard>
  );
};

export default ImageCard; 