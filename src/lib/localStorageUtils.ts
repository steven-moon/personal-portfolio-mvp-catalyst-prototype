/**
 * Utilities for managing local storage of images and other data
 * Used primarily by the mock API for development purposes
 */

// Keys used in localStorage
export const STORAGE_KEYS = {
  PROFILE_IMAGE: 'portfolio_profile_image',
  PROFILE_IMAGE_PATH: 'portfolio_profile_image_path',
  IMAGES: 'portfolio_images'
};

// Maximum dimensions for stored images to reduce storage size
const MAX_IMAGE_DIMENSION = 1200;
const IMAGE_QUALITY = 0.85; // Increased from 0.7 for better quality JPEG compression

/**
 * Resize and compress an image file to reduce its size
 * @param file Original image file
 * @returns Promise resolving to a compressed and resized image blob
 */
const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        // Get original dimensions
        const originalWidth = img.width;
        const originalHeight = img.height;
        const aspectRatio = originalWidth / originalHeight;
        
        // Calculate new dimensions while preserving aspect ratio
        let newWidth = originalWidth;
        let newHeight = originalHeight;
        
        // Only resize if the image exceeds our maximum dimension
        if (originalWidth > MAX_IMAGE_DIMENSION || originalHeight > MAX_IMAGE_DIMENSION) {
          if (originalWidth > originalHeight) {
            // Landscape orientation
            newWidth = Math.min(originalWidth, MAX_IMAGE_DIMENSION);
            newHeight = Math.round(newWidth / aspectRatio);
          } else {
            // Portrait or square orientation
            newHeight = Math.min(originalHeight, MAX_IMAGE_DIMENSION);
            newWidth = Math.round(newHeight * aspectRatio);
          }
        }
        
        // Create a canvas with the desired dimensions
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw the image on the canvas with the new dimensions
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`Image compressed from ${file.size} to ${blob.size} bytes`);
              console.log(`Original dimensions: ${originalWidth}x${originalHeight}, New dimensions: ${newWidth}x${newHeight}`);
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          IMAGE_QUALITY
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Store an image in local storage as base64, with compression
 * @param file The file to store
 * @param key Optional storage key, defaults to generic images storage
 * @param useFixedPath Optional flag to use a fixed path instead of generating a unique one
 * @param fixedFilename Optional fixed filename to use instead of generating one
 * @returns A promise resolving to the path to access the image
 */
export const storeImageLocally = async (
  file: File,
  key = STORAGE_KEYS.IMAGES,
  useFixedPath = false,
  fixedFilename?: string
): Promise<string> => {
  try {
    // Compress the image before storing
    const compressedImage = await compressImage(file);
    console.log(`Compressed image from ${file.size} bytes to ${compressedImage.size} bytes`);
    
    // Generate a filename - either fixed or unique
    let filename: string;
    
    if (useFixedPath && fixedFilename) {
      filename = fixedFilename;
    } else {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      filename = `${timestamp}-${safeName}`;
    }
    
    // Use a smaller async function to read and store compressed image data
    return await storeCompressedImage(compressedImage, filename, key);
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

/**
 * Helper function to store the compressed image data
 */
const storeCompressedImage = async (
  imageBlob: Blob, 
  filename: string, 
  key: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // Get the base64 data
        const base64Data = reader.result as string;
        
        // Check the size of the data before attempting to store it
        const estimatedSize = base64Data.length * 2; // Rough estimate of storage size in bytes
        console.log(`Estimated storage size: ${(estimatedSize / 1024 / 1024).toFixed(2)} MB`);
        
        // Try to store the image safely by first checking storage limits
        try {
          // First, clean storage if we have too many images
          cleanupOldImages(key, 3); // Keep only the 3 most recent images
          
          // Store the specific image
          let imageStorage: Record<string, string> = {};
          const existingStorage = localStorage.getItem(key);
          
          if (existingStorage) {
            imageStorage = JSON.parse(existingStorage);
          }
          
          // Add the new image
          imageStorage[filename] = base64Data;
          
          // Save back to localStorage
          localStorage.setItem(key, JSON.stringify(imageStorage));
          
          // Return the path that can be used to access the image
          const localPath = `/images/${filename}`;
          
          // If it's the profile image, store the path for future reference
          if (key === STORAGE_KEYS.PROFILE_IMAGE) {
            localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE_PATH, localPath);
          }
          
          console.log(`Image stored locally with path: ${localPath}`);
          resolve(localPath);
        } catch (storageError) {
          console.error('Storage error:', storageError);
          
          // If we hit quota issues, try more aggressive cleanup
          if (storageError.name === 'QuotaExceededError') {
            console.log('Storage quota exceeded, attempting cleanup...');
            try {
              // Clear everything except the current key
              Object.values(STORAGE_KEYS).forEach(storageKey => {
                if (storageKey !== key) {
                  localStorage.removeItem(storageKey);
                }
              });
              
              // Create a new storage with just this image
              const newStorage: Record<string, string> = {
                [filename]: base64Data
              };
              
              localStorage.setItem(key, JSON.stringify(newStorage));
              
              const localPath = `/images/${filename}`;
              if (key === STORAGE_KEYS.PROFILE_IMAGE) {
                localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE_PATH, localPath);
              }
              
              console.log('Successfully stored image after cleanup');
              resolve(localPath);
            } catch (finalError) {
              console.error('Failed even after cleanup:', finalError);
              reject(new Error('Image too large for local storage even after compression and cleanup'));
            }
          } else {
            reject(storageError);
          }
        }
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read compressed image'));
    };
    
    // Start the reading process
    reader.readAsDataURL(imageBlob);
  });
};

/**
 * Remove older images to free up space in storage
 * @param key The storage key
 * @param keepCount Number of most recent images to keep
 */
const cleanupOldImages = (key: string, keepCount: number): void => {
  try {
    const storageString = localStorage.getItem(key);
    if (!storageString) return;
    
    const storage = JSON.parse(storageString) as Record<string, string>;
    const entries = Object.entries(storage);
    
    // If we have more images than the keep count
    if (entries.length > keepCount) {
      console.log(`Cleaning up storage, keeping ${keepCount} of ${entries.length} images`);
      
      // Sort by filename (which includes timestamp) to find the most recent
      const sortedEntries = entries.sort((a, b) => b[0].localeCompare(a[0]));
      
      // Keep only the most recent images
      const newStorage = Object.fromEntries(sortedEntries.slice(0, keepCount));
      
      // Save the cleaned storage
      localStorage.setItem(key, JSON.stringify(newStorage));
      console.log(`Storage cleaned, removed ${entries.length - keepCount} old images`);
    }
  } catch (error) {
    console.error('Error during storage cleanup:', error);
  }
};

/**
 * Get an image from local storage by its path
 * @param path The path of the image to retrieve
 * @param key Optional storage key, defaults to generic images storage
 * @returns The base64 data of the image, or null if not found
 */
export const getLocalImage = (
  path: string,
  key = STORAGE_KEYS.IMAGES
): string | null => {
  // Extract the filename from the path
  const filename = path.split('/').pop();
  if (!filename) return null;
  
  // Get the storage
  const storageString = localStorage.getItem(key);
  if (!storageString) return null;
  
  try {
    const storage = JSON.parse(storageString) as Record<string, string>;
    return storage[filename] || null;
  } catch (e) {
    console.error('Failed to parse image storage', e);
    return null;
  }
};

/**
 * Store a profile image, overwriting any existing profile image
 * @param file The profile image file
 * @returns The path to the stored profile image
 */
export const storeProfileImage = (file: File): Promise<string> => {
  // Get the existing profile image path if it exists
  const existingPath = localStorage.getItem(STORAGE_KEYS.PROFILE_IMAGE_PATH);
  let fixedFilename: string | undefined;
  
  if (existingPath) {
    // Extract the filename from the existing path
    fixedFilename = existingPath.split('/').pop();
    console.log('Overwriting existing profile image:', fixedFilename);
    
    // Clean up existing entry if needed
    clearProfileImage();
  }
  
  // Use the fixed filename if it exists, otherwise generate a new one
  const useFixedPath = !!fixedFilename;
  return storeImageLocally(file, STORAGE_KEYS.PROFILE_IMAGE, useFixedPath, fixedFilename);
};

/**
 * Clear only the profile image
 */
export const clearProfileImage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
  localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE_PATH);
};

/**
 * Get the profile image if it exists
 * @param path The path to the profile image
 * @returns The base64 data of the profile image, or null if not found
 */
export const getProfileImage = (path: string): string | null => {
  return getLocalImage(path, STORAGE_KEYS.PROFILE_IMAGE);
};

/**
 * Reset all stored images
 */
export const clearAllStoredImages = (): void => {
  localStorage.removeItem(STORAGE_KEYS.IMAGES);
  localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
  localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE_PATH);
};