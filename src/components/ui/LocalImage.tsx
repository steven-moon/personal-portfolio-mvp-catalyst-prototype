import React, { useState, useEffect } from 'react';
import { getLocalImage, getProfileImage } from '@/lib/localStorageUtils';

// Default images
const DEFAULT_PROFILE_IMAGE = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&auto=format";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&auto=format";

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
  
  // Determine the appropriate fallback based on image type
  const defaultFallback = isProfileImage ? DEFAULT_PROFILE_IMAGE : DEFAULT_IMAGE;
  const effectiveFallback = fallbackSrc || defaultFallback;

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
        setImageSrc(effectiveFallback);
      }
    }
  }, [src, isProfileImage, effectiveFallback]);

  // Handle error case - use fallback
  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImageSrc(effectiveFallback);
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

 