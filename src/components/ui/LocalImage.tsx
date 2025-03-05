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
  className?: string;
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
  className,
  ...imgProps 
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isError, setIsError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  // Determine the appropriate fallback based on image type
  const defaultFallback = isProfileImage ? DEFAULT_PROFILE_IMAGE : DEFAULT_IMAGE;
  const effectiveFallback = fallbackSrc || defaultFallback;

  useEffect(() => {
    // Reset states when src changes
    setImageSrc(src);
    setIsError(false);
    setImageLoaded(false);
  }, [src]);

  useEffect(() => {
    // Handle different types of image sources
    if (src.startsWith('data:')) {
      // Already a data URL, use it directly
      console.log('Image source is a data URL, using directly');
      setImageSrc(src);
    } else if (src.startsWith('/images/')) {
      // Local image path, get from storage
      console.log('Image source is a local path, retrieving from storage');
      const localImage = isProfileImage ? getProfileImage(src) : getLocalImage(src);
      
      if (localImage) {
        console.log(`Retrieved local image from storage: ${src.substring(0, 30)}...`);
        if (!localImage.startsWith('data:')) {
          console.warn('Local image data is not in expected data URL format, attempting to fix');
          // Try to fix the format
          setImageSrc(`data:image/jpeg;base64,${localImage.split(',')[1] || localImage}`);
        } else {
          setImageSrc(localImage);
        }
      } else {
        // If not found in local storage, set error state
        console.warn(`Local image not found in storage: ${src}`);
        setIsError(true);
        setImageSrc(effectiveFallback);
      }
    } else {
      // External URL or unknown format, use as is
      console.log(`Using external image source: ${src.substring(0, 30)}...`);
    }
  }, [src, isProfileImage, effectiveFallback]);

  // Handle error case - use fallback
  const handleError = () => {
    if (!isError) {
      console.warn(`Image failed to load: ${imageSrc?.substring(0, 30)}...`);
      setIsError(true);
      setImageSrc(effectiveFallback);
    }
  };

  // Handle successful image load
  const handleLoad = () => {
    console.log(`Image loaded successfully: ${imageSrc?.substring(0, 30)}...`);
    setImageLoaded(true);
  };

  // Combine classes for profile image styling
  const combinedClassName = `${className || ''} ${
    isProfileImage 
      ? 'profile-image object-cover w-full h-full object-center' 
      : ''
  }`.trim();

  // For profile images, we want to add inline styles to ensure proper display
  const profileImageStyle = isProfileImage 
    ? { 
        objectFit: 'cover' as const, 
        objectPosition: 'center center',
        width: '100%',
        height: '100%',
        display: 'block'
      }
    : {};
    
  // Merge styles
  const styleProps = {
    ...(imgProps.style || {}),
    ...profileImageStyle
  };

  // Apply special handling for profile images based on their data type
  useEffect(() => {
    if (isProfileImage && imageSrc) {
      // Check if image source is a proper data URL
      if (typeof imageSrc === 'string' && imageSrc.startsWith('data:')) {
        // Data URL is already properly formatted, nothing to do
        console.log('Profile image is using a properly formatted data URL');
      } else if (typeof imageSrc === 'string' && !imageSrc.startsWith('data:') && !imageSrc.startsWith('http')) {
        // If it's not a data URL or external URL, it may need to be fixed
        console.warn('Profile image has an incorrectly formatted source');
      }
    }
  }, [isProfileImage, imageSrc]);

  // Remove style from imgProps to avoid duplication
  const { style, ...restImgProps } = imgProps;

  return (
    <>
      {isProfileImage ? (
        // For profile images, use special styling to ensure proper display in circular containers
        <img
          src={imageSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          className={`${className || ''} ${!imageLoaded ? 'animate-pulse bg-muted' : ''}`}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            display: 'block',
          }}
          {...imgProps}
        />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          className={`${className || ''} ${!imageLoaded ? 'animate-pulse bg-muted' : ''}`}
          {...imgProps}
        />
      )}
    </>
  );
};

export default LocalImage;

 