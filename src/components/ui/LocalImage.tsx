import React, { useState, useEffect } from 'react';
import { getLocalImage, getProfileImage } from '@/lib/localStorageUtils';

interface LocalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  isProfileImage?: boolean;
}

/**
 * Component that can display images stored in local storage
 * Falls back to the provided fallback or the original src if not found locally
 */
const LocalImage: React.FC<LocalImageProps> = ({ 
  src, 
  alt, 
  fallbackSrc, 
  isProfileImage = false,
  ...imgProps 
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setImageSrc(src);
    setIsError(false);
  }, [src]);

  useEffect(() => {
    // Only process if the path looks like a local image path
    if (src.startsWith('/images/')) {
      // Try to get the image from local storage
      const localImage = isProfileImage ? getProfileImage(src) : getLocalImage(src);
      
      if (localImage) {
        setImageSrc(localImage);
      } else {
        // If not found in local storage but it's a local path, set error state
        setIsError(true);
      }
    }
  }, [src, isProfileImage]);

  // Handle error case - use fallback or original src
  const handleError = () => {
    if (!isError && fallbackSrc) {
      setIsError(true);
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      onError={handleError}
      {...imgProps}
    />
  );
};

export default LocalImage;

 