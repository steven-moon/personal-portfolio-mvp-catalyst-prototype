import React, { useState, useRef, useCallback } from 'react';
import { toast } from "sonner";
import { ImagePlus, X, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { storeImageLocally, STORAGE_KEYS } from '@/lib/localStorageUtils';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  title?: string;
  description?: string;
  aspect?: number; // Aspect ratio (width/height) - optional, default is 3/2
  storageKey?: keyof typeof STORAGE_KEYS;
  entityId?: number; // Optional ID for the entity this image belongs to
}

/**
 * A reusable component for uploading and cropping images
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  title = 'Crop Image',
  description = 'Crop the image to fit the desired dimensions',
  aspect = 3/2, // Default aspect ratio for projects
  storageKey = 'IMAGES',
  entityId
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 300,
    height: 300 / aspect,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input change
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    setImageFile(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setImageSrc(localPreviewUrl);
    setIsDialogOpen(true);
  }, []);

  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Please drop an image file");
      return;
    }
    
    setImageFile(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setImageSrc(localPreviewUrl);
    setIsDialogOpen(true);
  }, []);

  // Handle image crop
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Calculate the maximum size that fits within the image dimensions while maintaining aspect ratio
    let cropWidth, cropHeight;
    
    // Try using width as the limiting factor
    cropWidth = Math.min(width, 600);
    cropHeight = cropWidth / aspect;
    
    // If height exceeds image height, recalculate based on height
    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = cropHeight * aspect;
    }
    
    // Center the crop area
    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;
    
    const initialCrop: Crop = {
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x: x,
      y: y
    };
    
    // Set both crop and completedCrop to enable the Save button immediately
    setCrop(initialCrop);
    
    // Also set completedCrop so the Save button is enabled immediately
    setCompletedCrop({
      width: cropWidth,
      height: cropHeight,
      x: x,
      y: y,
      unit: 'px'
    });
  }, [aspect]);

  // Validate the image
  const validateImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Create an image element to check dimensions
      const img = document.createElement('img');
      img.onload = () => {
        if (img.width > 0 && img.height > 0) {
          console.log(`Validated image dimensions: ${img.width}x${img.height}`);
          resolve();
        } else {
          reject(new Error("Invalid image dimensions"));
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = src;
    });
  }, []);

  // Save the cropped image
  const saveCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error('Please crop the image first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Canvas setup for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('Could not create canvas context');
        setIsLoading(false);
        return;
      }

      // Set canvas dimensions to match crop size
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      // Draw the cropped portion of the image onto the canvas
      ctx.drawImage(
        imgRef.current,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      // Create a blob from the canvas
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else {
            toast.error('Failed to create image blob');
            setIsLoading(false);
          }
        }, 'image/jpeg', 0.9);
      });

      // Generate a clean filename without special characters
      const origFilename = imageFile?.name || 'image.jpg';
      const cleanName = origFilename.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
      
      // Create a file from the blob
      const file = new File([blob], cleanName, { type: 'image/jpeg' });
      
      console.log('🔍 DEBUG - ImageUploader - Saving image with clean name:', cleanName);
      
      // Store the image with standardized key pattern
      // Use fixed path (true), provide clean name as fixed filename, and skip timestamp (true)
      const path = await storeImageLocally(file, STORAGE_KEYS[storageKey], true, cleanName, true);
      
      // Clean any query parameters that might be added
      const cleanPath = path.split('?')[0];
      console.log('🔍 DEBUG - ImageUploader - Image saved, clean path:', cleanPath);
      
      toast.success('Image saved successfully');
      
      // Create a direct localStorage key to ensure consistency
      const directKey = `portfolio_images_${cleanPath}`;
      console.log('🔍 DEBUG - ImageUploader - Using direct storage key:', directKey);
      
      // Pass the clean path to the parent component
      onImageUploaded(cleanPath);
      
      // Close the dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving cropped image:', error);
      toast.error('Failed to save image');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelCrop = useCallback(() => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setIsDialogOpen(false);
    setImageFile(null);
    setImageSrc(null);
  }, [imageSrc]);

  return (
    <>
      <div 
        className={`relative overflow-hidden rounded-lg mb-4 ${
          isDragging ? 'border-2 border-dashed border-primary' : 'border-2 border-dashed border-muted-foreground'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div 
          className="flex flex-col items-center justify-center p-8 cursor-pointer"
        >
          <ImagePlus className="mb-2 text-muted-foreground" size={32} />
          <p className="text-sm text-muted-foreground text-center">
            Click or drag & drop to upload image
          </p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 max-h-[60vh] overflow-auto">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                className="max-w-full"
                aspect={aspect}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Preview"
                  onLoad={onImageLoad}
                  className="max-w-full"
                  style={{ 
                    maxHeight: '60vh',
                    maxWidth: '100%'
                  }}
                />
              </ReactCrop>
            )}
          </div>
          
          <DialogFooter>
            <Button
              size="sm"
              variant="secondary"
              onClick={cancelCrop}
              disabled={isLoading}
              className="px-4"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            
            <Button
              size="sm"
              onClick={saveCroppedImage}
              disabled={isLoading || !completedCrop}
              className="px-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUploader; 