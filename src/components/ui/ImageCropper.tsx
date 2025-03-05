import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/spinner';

// Helper to create a centered crop with aspect ratio
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 80, // Use 80% of width
        height: 80, // Use 80% of height
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

// Helper function to crop the image
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return Promise.reject('No 2d context');
  }

  // Set canvas size to desired output size (fixed 500x500)
  const targetSize = 500;
  canvas.width = targetSize;
  canvas.height = targetSize;
  
  // Set high quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Fill with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetSize, targetSize);
  
  // These are the source image coordinates
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  // Calculate actual source coordinates in the original image
  const sourceX = crop.x * scaleX;
  const sourceY = crop.y * scaleY;
  const sourceWidth = crop.width * scaleX;
  const sourceHeight = crop.height * scaleY;
  
  console.log(`Image dimensions: displayed=${image.width}x${image.height}, natural=${image.naturalWidth}x${image.naturalHeight}`);
  console.log(`Crop area (px): x=${crop.x}, y=${crop.y}, width=${crop.width}, height=${crop.height}`);
  console.log(`Source rectangle: x=${sourceX}, y=${sourceY}, width=${sourceWidth}, height=${sourceHeight}`);
  console.log(`Output size: ${targetSize}x${targetSize}`);
  
  // Draw the cropped image
  ctx.drawImage(
    image,
    sourceX, sourceY, sourceWidth, sourceHeight,
    0, 0, targetSize, targetSize
  );
  
  // Get data URL
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  return Promise.resolve(dataUrl);
}

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
}

const ImageCropper = ({ open, onClose, imageSrc, onCropComplete }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial crop when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Create a centered square crop
    const initialCrop = centerAspectCrop(width, height, 1);
    setCrop(initialCrop);
  }, []);

  // Process cropped image
  const handleComplete = useCallback(async () => {
    if (!imgRef.current || !completedCrop) {
      return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(dataUrl);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [completedCrop, onCropComplete, onClose]);

  // Close without saving
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-2 bg-muted/20 rounded-md overflow-hidden">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              keepSelection
              className="max-h-[60vh] mx-auto"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop me"
                onLoad={onImageLoad}
                style={{ maxHeight: '60vh' }}
              />
            </ReactCrop>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleComplete} disabled={isLoading || !completedCrop}>
              {isLoading ? <><Spinner size="sm" className="mr-2" /> Processing...</> : 'Crop & Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper; 