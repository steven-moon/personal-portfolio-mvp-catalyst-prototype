import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { getLocalImage, STORAGE_KEYS } from '@/lib/localStorageUtils';

interface LocalImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  isProfileImage?: boolean;
}

/**
 * LocalImage component to handle images with fallback
 * Can handle both remote URLs and local storage paths
 */
const LocalImage: React.FC<LocalImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  width,
  height,
  isProfileImage = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [attemptedSrc, setAttemptedSrc] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when src changes
    setLoading(true);
    setError(false);
    setResolvedSrc('');
    
    // Don't process empty sources
    if (!src) {
      // console.log('🔍 DEBUG - LocalImage - Empty src provided');
      setError(true);
      setLoading(false);
      return;
    }
    
    // console.log('🔍 DEBUG - LocalImage - Processing new src:', src);
    handleImageSource(src);
  }, [src]);

  // This function is called when the image can't be loaded
  useEffect(() => {
    // Special handling for debugging a failed image load
    if (error && !resolvedSrc && !fallbackSrc) {
      // console.log('🔍 DEBUG - LocalImage - No image could be loaded for:', src);
      
      // Try to list all localStorage keys related to images for debugging
      try {
        // console.log('🔍 DEBUG - LocalImage - Dumping all localStorage image keys:');
        const allKeys = Object.keys(localStorage);
        const imageKeys = allKeys.filter(key => key.includes('portfolio_'));
        
        // console.log('🔍 DEBUG - LocalImage - Found', imageKeys.length, 'image keys:');
        imageKeys.forEach(key => {
          // console.log('  >', key);
        });
      } catch (e) {
        // console.error('🔍 DEBUG - LocalImage - Error dumping localStorage keys:', e);
      }
    }
  }, [error, resolvedSrc, fallbackSrc, src]);

  // Function to handle different types of image sources
  const handleImageSource = (source: string) => {
    // If it's a remote URL or data URL, use directly
    if (source.startsWith('http') || source.startsWith('data:')) {
      // console.log('🔍 DEBUG - LocalImage - Using direct URL:', source.substring(0, 30) + '...');
      setResolvedSrc(source);
      setLoading(false);
      return;
    }
    
    // Clean the source path by removing any query parameters
    const cleanSource = source.split('?')[0];
    // console.log('🔍 DEBUG - LocalImage - Clean source:', cleanSource);
    
    // Extract filename for direct key lookup
    const filename = cleanSource.split('/').pop();
    // console.log('🔍 DEBUG - LocalImage - Extracted filename:', filename);
    
    // Try direct localStorage lookup first with multiple formats (most reliable)
    if (cleanSource) {
      const directKey = `portfolio_images_${cleanSource}`;
      const imageData = localStorage.getItem(directKey);
      
      if (imageData && imageData.startsWith('data:')) {
        // console.log('🔍 DEBUG - LocalImage - Found image with primary key:', directKey);
        setResolvedSrc(imageData);
        setLoading(false);
        return;
      }
    }
    
    // If not found, try by filename (which works for newly uploaded images)
    if (filename) {
      const filenameKey = `portfolio_image_${filename}`;
      const filenameData = localStorage.getItem(filenameKey);
      
      if (filenameData && filenameData.startsWith('data:')) {
        // console.log('🔍 DEBUG - LocalImage - Found image with filename key:', filenameKey);
        
        // Also store it under the direct key for faster lookup next time
        try {
          const directKey = `portfolio_images_${cleanSource}`;
          localStorage.setItem(directKey, filenameData);
          // console.log('🔍 DEBUG - LocalImage - Copied image data to direct key for future use');
        } catch (e) {
          // console.warn('🔍 DEBUG - LocalImage - Error copying to direct key:', e);
        }
        
        setResolvedSrc(filenameData);
        setLoading(false);
        return;
      }
    }
    
    // For local images from storage - try the general object format as a last resort
    const key = isProfileImage ? STORAGE_KEYS.PROFILE_IMAGE : STORAGE_KEYS.IMAGES;
    // console.log('🔍 DEBUG - LocalImage - Looking for image in JSON storage with key:', key);
    
    try {
      const storageData = localStorage.getItem(key);
      if (storageData) {
        const storage = JSON.parse(storageData);
        
        // Check if the image exists in storage
        if (storage[cleanSource]) {
          // console.log('🔍 DEBUG - LocalImage - Found image in JSON storage:', cleanSource);
          
          const imageData = storage[cleanSource];
          
          // Also store it under direct key for faster lookup next time
          try {
            const directKey = `portfolio_images_${cleanSource}`;
            localStorage.setItem(directKey, imageData);
            // console.log('🔍 DEBUG - LocalImage - Copied image data to direct key from JSON storage');
          } catch (e) {
            // console.warn('🔍 DEBUG - LocalImage - Error copying to direct key:', e);
          }
          
          setResolvedSrc(imageData);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      // console.warn('🔍 DEBUG - LocalImage - Error parsing storage:', e);
    }
    
    // If image not found but filename exists, try one more direct approach
    if (filename) {
      try {
        // console.log('🔍 DEBUG - LocalImage - Last resort: searching all localStorage keys for filename:', filename);
        // Try to find any key in localStorage that contains our filename
        const allKeys = Object.keys(localStorage);
        
        for (const key of allKeys) {
          if ((key.includes(filename) || key.includes(filename.replace(/\.[^/.]+$/, ""))) && 
              key.includes('portfolio_')) {
            const value = localStorage.getItem(key);
            if (value && value.startsWith('data:')) {
              // console.log('🔍 DEBUG - LocalImage - Found image by key search:', key);
              
              // Also store it under direct key for faster lookup next time
              try {
                const directKey = `portfolio_images_${cleanSource}`;
                localStorage.setItem(directKey, value);
                // console.log('🔍 DEBUG - LocalImage - Copied image data to direct key from search');
              } catch (e) {
                // console.warn('🔍 DEBUG - LocalImage - Error copying to direct key:', e);
              }
              
              setResolvedSrc(value);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // console.warn('🔍 DEBUG - LocalImage - Error during localStorage key search:', e);
      }
    }
    
    // NEW: If not found in localStorage, try accessing from public folder directly
    if (source.startsWith('/') && !source.startsWith('//')) {
      console.log('🔍 DEBUG - LocalImage - Trying to load from public folder:', source);
      setResolvedSrc(source);
      setLoading(false);
      return;
    }
    
    if (fallbackSrc) {
      // console.log('🔍 DEBUG - LocalImage - Using fallback src:', fallbackSrc);
      setResolvedSrc(fallbackSrc);
    } else {
      // console.log('🔍 DEBUG - LocalImage - No fallback available, setting error state');
      setError(true);
    }
    setLoading(false);
  };

  const handleError = () => {
    // console.warn('🔍 DEBUG - LocalImage - Error loading image:', src);
    
    // If we have a fallback and aren't already using it
    if (fallbackSrc && resolvedSrc !== fallbackSrc) {
      // console.log('🔍 DEBUG - LocalImage - Falling back to:', fallbackSrc);
      setResolvedSrc(fallbackSrc);
      // Don't set error yet, give the fallback a chance
    } else {
      // console.error('🔍 DEBUG - LocalImage - No fallback available or fallback also failed');
      setError(true);
    }
    setLoading(false);
  };

  const handleLoad = () => {
    // console.log('🔍 DEBUG - LocalImage - Image loaded successfully:', src);
    setLoading(false);
    setError(false);
  };

  // Update the render section to better handle image loading and errors
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="animate-pulse">Loading...</span>
        </div>
      )}
      
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-sm text-gray-500">Image not available</span>
        </div>
      )}
      
      {resolvedSrc && (
        <img
          src={resolvedSrc}
          alt={alt}
          className={`object-cover w-full h-full ${error && fallbackSrc ? 'hidden' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: loading ? 'none' : 'block' }}
        />
      )}
    </div>
  );
};

export default LocalImage;

 