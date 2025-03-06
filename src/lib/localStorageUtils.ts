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
        
        console.log(`Original image dimensions: ${originalWidth}x${originalHeight}`);
        
        // Determine target dimensions - maintain aspect ratio but limit max dimension to 1200px
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;
        
        // Scale down large images while maintaining aspect ratio
        const maxDimension = 1200;
        if (originalWidth > maxDimension || originalHeight > maxDimension) {
          if (originalWidth > originalHeight) {
            targetWidth = maxDimension;
            targetHeight = Math.round((originalHeight / originalWidth) * maxDimension);
          } else {
            targetHeight = maxDimension;
            targetWidth = Math.round((originalWidth / originalHeight) * maxDimension);
          }
        }
        
        // Create a canvas with the target dimensions (maintaining aspect ratio)
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Get the context for drawing
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Clear the canvas with a transparent background
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        
        // Draw the image at the calculated dimensions
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        console.log(`Resized image to: ${targetWidth}x${targetHeight}`);
        
        // Convert to blob with JPEG format
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`Image compressed from ${file.size} to ${blob.size} bytes`);
              console.log(`Output dimensions: ${targetWidth}x${targetHeight}`);
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.92 // High quality
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
 * @param skipTimestamp Optional flag to skip adding a timestamp to the filename
 * @returns A promise resolving to the path to access the image
 */
export const storeImageLocally = async (
  file: File,
  key = STORAGE_KEYS.IMAGES,
  useFixedPath = false,
  fixedFilename?: string,
  skipTimestamp = false
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
      // Use a clean filename that won't cause path issues
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      
      // Add timestamp only if not skipped
      if (skipTimestamp) {
        filename = safeName;
      } else {
        const timestamp = Date.now();
        filename = `${timestamp}-${safeName}`;
      }
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
export const storeCompressedImage = async (
  imageBlob: Blob, 
  filename: string, 
  key: string
): Promise<string> => {
  console.log('🔍 DEBUG - storeCompressedImage - Starting for file:', filename, 'key:', key);
  
  try {
    // Clean the filename to remove any timestamps or query params
    const cleanFilename = filename.split('?')[0];
    
    // Construct local path for image
    const localPath = `/images/${cleanFilename}`;
    
    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
    
    const base64Data = await base64Promise;
    console.log('🔍 DEBUG - storeCompressedImage - Base64 conversion complete, length:', base64Data.length);
    
    // Make sure base64 data is properly formatted with MIME type
    let imageData = base64Data;
    if (!imageData.startsWith('data:')) {
      console.warn('🔍 DEBUG - storeCompressedImage - Base64 data missing prefix, adding default');
      imageData = `data:image/jpeg;base64,${base64Data}`;
    }
    
    // Create unique keys for storing this specific image
    
    // 1. Create a direct path key for easier access - this is the main storage
    const directPathKey = `${key}_${localPath}`;
    localStorage.setItem(directPathKey, imageData);
    console.log('🔍 DEBUG - storeCompressedImage - Image stored with direct path key:', directPathKey);
    
    // 2. Create a direct filename key as a backup
    const directFilenameKey = `portfolio_image_${cleanFilename}`;
    localStorage.setItem(directFilenameKey, imageData);
    console.log('🔍 DEBUG - storeCompressedImage - Image stored with direct filename key:', directFilenameKey);
    
    // 3. Also store in the traditional JSON storage format as a fallback
    // Get existing storage or create new
    let storage: Record<string, string> = {};
    const storageString = localStorage.getItem(key);
    
    if (storageString) {
      try {
        storage = JSON.parse(storageString);
      } catch (error) {
        console.error('🔍 DEBUG - storeCompressedImage - Error parsing storage, creating new:', error);
        storage = {};
      }
    }
    
    // Add the new image and save back to localStorage
    storage[localPath] = imageData;
    localStorage.setItem(key, JSON.stringify(storage));
    
    // For profile images, also save the path for later reference
    if (key === STORAGE_KEYS.PROFILE_IMAGE) {
      localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE_PATH, localPath);
    }
    
    // Update the index of image paths
    try {
      const pathsKey = `${key}_paths`;
      const existingPathsStr = localStorage.getItem(pathsKey) || '[]';
      const existingPaths = JSON.parse(existingPathsStr);
      
      // Add new path if not already in the list
      if (!existingPaths.includes(localPath)) {
        existingPaths.push(localPath);
        localStorage.setItem(pathsKey, JSON.stringify(existingPaths));
      }
      
      console.log('🔍 DEBUG - storeCompressedImage - Updated image paths index:', existingPaths);
    } catch (error) {
      console.error('🔍 DEBUG - storeCompressedImage - Error updating paths index:', error);
    }
    
    console.log('🔍 DEBUG - storeCompressedImage - Success! Image stored locally with path:', localPath);
    return localPath;
  } catch (error) {
    console.error('🔍 DEBUG - storeCompressedImage - Error storing image:', error);
    throw new Error(`Failed to store image: ${error.message}`);
  }
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
  console.log('🔍 DEBUG - getLocalImage - Fetching image with path:', path, 'key:', key);
  
  try {
    // If we get an empty path or a data URL, handle it appropriately
    if (!path) {
      console.log('🔍 DEBUG - getLocalImage - No path provided');
      return null;
    }
    
    if (path.startsWith('data:')) {
      console.log('🔍 DEBUG - getLocalImage - Path is already a data URL, returning as is');
      return path;
    }
    
    if (path.startsWith('http')) {
      console.log('🔍 DEBUG - getLocalImage - Path is a remote URL, returning as is');
      return path;
    }

    // Clean the path by removing any query parameters
    let cleanPath = path.split('?')[0];
    console.log('🔍 DEBUG - getLocalImage - Clean path without query params:', cleanPath);
    
    // Remove timestamp from path if present (for consistency)
    if (cleanPath.includes('/images/')) {
      const parts = cleanPath.split('/images/');
      if (parts.length > 1) {
        const filename = parts[1];
        // If filename has timestamp pattern (numbers followed by dash)
        if (/^\d+-/.test(filename)) {
          // Remove the timestamp prefix from the filename
          const cleanFilename = filename.replace(/^\d+-/, '');
          const timestampFreePath = `/images/${cleanFilename}`;
          console.log('🔍 DEBUG - getLocalImage - Removed timestamp, clean path:', timestampFreePath);
          
          // Try both paths - with and without timestamp
          const directPaths = [cleanPath, timestampFreePath];
          
          for (const testPath of directPaths) {
            // Try direct key lookup first (most efficient)
            const directKey = `portfolio_images_${testPath}`;
            console.log('🔍 DEBUG - getLocalImage - Trying direct key:', directKey);
            const directValue = localStorage.getItem(directKey);
            if (directValue && directValue.startsWith('data:')) {
              console.log('🔍 DEBUG - getLocalImage - Found direct match with key:', directKey);
              return directValue;
            }
          }
          
          // Update the clean path for further processing
          cleanPath = timestampFreePath;
        }
      }
    }
    
    // Get the filename to use in multiple strategies
    const filename = cleanPath.split('/').pop();
    if (!filename) {
      console.error('🔍 DEBUG - getLocalImage - Invalid path format:', path);
      return null;
    }
    
    // STRATEGY 1: Try direct keys with the exact key format used in storage
    const directStorageKeys = [
      // Match the exact key structure in storage
      `${key}_${cleanPath}`,
      `portfolio_images_${cleanPath}`,
      `portfolio_image_${filename}`,
      `portfolio_images_/images/${filename}`
    ];
    
    for (const directKey of directStorageKeys) {
      console.log('🔍 DEBUG - getLocalImage - Trying direct key:', directKey);
      const directImage = localStorage.getItem(directKey);
      if (directImage) {
        console.log('🔍 DEBUG - getLocalImage - Found image with direct key:', directKey);
        return directImage;
      }
    }
    
    // STRATEGY 2: Try a brute force search for any key containing the filename
    try {
      console.log('🔍 DEBUG - getLocalImage - Attempting brute force search for filename:', filename);
      const allKeys = Object.keys(localStorage);
      
      // Look for any key that contains our filename (without extension if possible)
      const filenameWithoutExt = filename.includes('.') 
        ? filename.substring(0, filename.lastIndexOf('.')) 
        : filename;
        
      console.log('🔍 DEBUG - getLocalImage - Searching for filename pattern:', filenameWithoutExt);
      
      // Try exact paths first before fuzzy matching
      for (const storageKey of allKeys) {
        if (storageKey.includes(filename) && storageKey.includes('portfolio_')) {
          console.log('🔍 DEBUG - getLocalImage - Found exact filename match:', storageKey);
          const potentialImage = localStorage.getItem(storageKey);
          if (potentialImage && potentialImage.startsWith('data:')) {
            console.log('🔍 DEBUG - getLocalImage - Found valid image data with exact match');
            return potentialImage;
          }
        }
      }
      
      // Now try partial matches
      for (const storageKey of allKeys) {
        if (storageKey.includes('portfolio_') && 
           (storageKey.includes(filenameWithoutExt))) {
          console.log('🔍 DEBUG - getLocalImage - Found potential key by partial match:', storageKey);
          const potentialImage = localStorage.getItem(storageKey);
          if (potentialImage && potentialImage.startsWith('data:')) {
            console.log('🔍 DEBUG - getLocalImage - Found image by partial match');
            return potentialImage;
          }
        }
      }
    } catch (e) {
      console.error('🔍 DEBUG - getLocalImage - Error during brute force search:', e);
    }
    
    // STRATEGY 3: Try the traditional JSON storage method
    console.log('🔍 DEBUG - getLocalImage - Trying JSON storage lookup with key:', key);
    const storageString = localStorage.getItem(key);
    if (storageString) {
      try {
        const storage = JSON.parse(storageString);
        // Check multiple possible keys in the storage
        const possibleStorageKeys = [
          // The exact path
          cleanPath,
          // Just the filename
          filename,
          // /images/ + filename pattern
          `/images/${filename}`
        ];
        
        // Try all possible storage keys
        for (const storageKey of possibleStorageKeys) {
          if (storage[storageKey]) {
            console.log('🔍 DEBUG - getLocalImage - Found image in JSON storage with key:', storageKey);
            let imageData = storage[storageKey];
            if (!imageData.startsWith('data:')) {
              console.warn('🔍 DEBUG - getLocalImage - Image data missing prefix, adding default');
              imageData = `data:image/jpeg;base64,${imageData}`;
            }
            return imageData;
          }
        }
        
        // Last attempt: look for any key in storage that ends with our filename
        const storageKeys = Object.keys(storage);
        const filenameWithoutExt = filename.includes('.') 
          ? filename.substring(0, filename.lastIndexOf('.')) 
          : filename;
          
        for (const storageKey of storageKeys) {
          if (storageKey.endsWith(filename) || storageKey.includes(filenameWithoutExt)) {
            console.log('🔍 DEBUG - getLocalImage - Found image in JSON storage by partial match:', storageKey);
            let imageData = storage[storageKey];
            if (!imageData.startsWith('data:')) {
              console.warn('🔍 DEBUG - getLocalImage - Image data missing prefix, adding default');
              imageData = `data:image/jpeg;base64,${imageData}`;
            }
            return imageData;
          }
        }
        
        console.log('🔍 DEBUG - getLocalImage - Image not found in JSON storage');
      } catch (error) {
        console.error('🔍 DEBUG - getLocalImage - Error parsing JSON storage:', error);
      }
    } else {
      console.log('🔍 DEBUG - getLocalImage - No JSON storage found for key:', key);
    }
    
    console.log('🔍 DEBUG - getLocalImage - Image not found with any method:', path);
    return null;
  } catch (error) {
    console.error('🔍 DEBUG - getLocalImage - Unexpected error:', error);
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
  console.log(`Retrieving profile image from path: ${path}`);
  const result = getLocalImage(path, STORAGE_KEYS.PROFILE_IMAGE);
  
  if (result) {
    console.log(`Retrieved profile image with data length: ${result.length}`);
    
    // Extra validation for profile images
    if (!result.startsWith('data:')) {
      console.warn('Profile image data missing data URL prefix, attempting to fix');
      return `data:image/jpeg;base64,${result.split(',')[1] || result}`;
    }
  } else {
    console.warn(`Failed to retrieve profile image from path: ${path}`);
  }
  
  return result;
};

/**
 * Reset all stored images
 */
export const clearAllStoredImages = (): void => {
  localStorage.removeItem(STORAGE_KEYS.IMAGES);
  localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
  localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE_PATH);
};

/**
 * Debugging utility to dump all image-related items in localStorage
 * with detailed information about each
 */
export const debugLocalStorage = (): void => {
  console.log('🔍 DEBUG - localStorage analysis starting...');
  
  // Log general information
  console.log('🔍 DEBUG - localStorage size:', 
    (JSON.stringify(localStorage).length / 1024).toFixed(2) + ' KB');
  console.log('🔍 DEBUG - localStorage keys count:', Object.keys(localStorage).length);
  
  // Get all image-related keys
  const allKeys = Object.keys(localStorage);
  const imageRelatedKeys = allKeys.filter(key => 
    key.includes('image') || 
    key.includes('portfolio_images') || 
    key.includes('portfolio_image')
  );
  
  console.log('🔍 DEBUG - Found ' + imageRelatedKeys.length + ' image-related keys');
  
  // Create a table-like structure for all image keys
  console.log('🔍 DEBUG - Image-related localStorage entries:');
  console.log('-------------------- IMAGE STORAGE DEBUG TABLE --------------------');
  console.log('| KEY | TYPE | SIZE | STARTS WITH | FILENAME |');
  console.log('|-----|------|------|-------------|----------|');
  
  imageRelatedKeys.forEach(key => {
    const value = localStorage.getItem(key);
    const size = value ? (value.length / 1024).toFixed(2) + ' KB' : 'N/A';
    const type = value?.startsWith('data:') ? 'data URL' : 
                 (value?.startsWith('{') ? 'JSON' : 'other');
    const dataStart = value?.substring(0, 20) + '...' || 'N/A';
    
    // Try to extract filename from key
    let filename = 'N/A';
    if (key.includes('/')) {
      filename = key.split('/').pop() || 'N/A';
    } else if (key.includes('_')) {
      const parts = key.split('_');
      filename = parts[parts.length - 1];
    }
    
    console.log(`| ${key.substring(0, 20)}... | ${type} | ${size} | ${dataStart} | ${filename} |`);
  });
  
  console.log('------------------------------------------------------------------');
  
  // Check for JSON storage format
  if (localStorage.getItem(STORAGE_KEYS.IMAGES)) {
    try {
      const imagesStorage = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMAGES) || '{}');
      console.log('🔍 DEBUG - JSON-based image storage entries:', Object.keys(imagesStorage).length);
      
      // Log detailed info about each image in the JSON storage
      Object.entries(imagesStorage).forEach(([imgKey, imgData]) => {
        const dataStr = typeof imgData === 'string' ? imgData : JSON.stringify(imgData);
        const size = (dataStr.length / 1024).toFixed(2) + ' KB';
        const dataStart = dataStr.substring(0, 20) + '...';
        
        console.log(`JSON storage - ${imgKey}: ${size}, starts with: ${dataStart}`);
      });
    } catch (e) {
      console.error('🔍 DEBUG - Error parsing JSON image storage:', e);
    }
  } else {
    console.log('🔍 DEBUG - No JSON-based image storage found');
  }
  
  console.log('🔍 DEBUG - localStorage analysis complete');
};