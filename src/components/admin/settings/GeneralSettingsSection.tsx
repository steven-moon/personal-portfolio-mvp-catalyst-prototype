import React, { useState, useRef, useCallback } from 'react';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { SectionProps } from './SettingsTypes';
import { ImagePlus, Upload, Trash, Check, X, Crop as CropIcon, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { toast } from 'sonner';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { storeImageLocally, STORAGE_KEYS } from '@/lib/localStorageUtils';
import LocalImage from '@/components/ui/LocalImage';
import { Switch } from '@/components/ui/switch';

const ImageUploader = ({ 
  imageUrl, 
  onImageChange 
}: { 
  imageUrl: string, 
  onImageChange: (url: string) => void 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 200,
    height: 200,
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
    
    // 1:1 aspect ratio for site icon
    const aspectRatio = 1;
    
    // Calculate the maximum size that fits within the image dimensions while maintaining aspect ratio
    let cropWidth, cropHeight;
    
    // Try using width as the limiting factor
    cropWidth = Math.min(width, 200);
    cropHeight = cropWidth / aspectRatio;
    
    // If height exceeds image height, recalculate based on height
    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = cropHeight * aspectRatio;
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
  }, []);

  // Save the cropped image
  const saveCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return;
    
    try {
      setIsLoading(true);
      
      // Create a canvas with the cropped image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set the canvas size to the cropped image size
      const pixelRatio = window.devicePixelRatio || 1;
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      // Use the pixel ratio and natural image dimensions for better quality
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      
      // Draw the cropped image to the canvas
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
      
      // Convert the canvas to a blob with better quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.95 // Higher quality for the crop
        );
      });
      
      // Create a File from the Blob
      const croppedFile = new File(
        [blob], 
        `siteicon-${imageFile.name}`, 
        { type: 'image/jpeg' }
      );
      
      // Store the image locally
      const localPath = await storeImageLocally(croppedFile, STORAGE_KEYS.IMAGES);
      
      // Update the image URL
      onImageChange(localPath);
      
      // Close the dialog
      setIsDialogOpen(false);
      setImageSrc(null);
      
      toast.success('Site icon uploaded successfully');
    } catch (error) {
      console.error('Failed to save cropped image:', error);
      toast.error('Failed to process image');
    } finally {
      setIsLoading(false);
    }
  }, [completedCrop, imageFile, onImageChange]);

  const cancelCrop = useCallback(() => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setIsDialogOpen(false);
    setImageFile(null);
    setImageSrc(null);
  }, [imageSrc]);

  // Clear the selected image
  const clearImage = useCallback(() => {
    onImageChange('');
  }, [onImageChange]);

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-foreground">Site Icon</label>
        <div 
          className={`relative overflow-hidden rounded-lg ${
            isDragging ? 'border-2 border-dashed border-primary' : ''
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageUrl ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-lg neu-flat dark:shadow-dark-neu-flat">
              <LocalImage 
                src={imageUrl} 
                alt="Site Icon" 
                className="w-full h-full object-cover object-center"
                fallbackSrc="https://via.placeholder.com/200x200?text=Site+Icon"
                style={{ 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%'
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="flex gap-2">
                  <button 
                    onClick={triggerFileInput}
                    className="p-1 rounded-full bg-primary text-primary-foreground"
                    title="Change image"
                  >
                    <Upload size={16} />
                  </button>
                  <button 
                    onClick={clearImage}
                    className="p-1 rounded-full bg-red-500 text-white"
                    title="Remove image"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer h-24 w-24 bg-muted/20 neu-flat dark:shadow-dark-neu-flat"
              onClick={triggerFileInput}
            >
              <ImagePlus className="mb-1 text-muted-foreground" size={24} />
              <p className="text-xs text-muted-foreground text-center">
                Upload Icon
              </p>
            </div>
          )}
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
              <CropIcon size={18} />
              Crop Site Icon
            </DialogTitle>
          </DialogHeader>
          
          <div className="my-4 max-h-[60vh] overflow-auto">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-w-full"
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
            <NeumorphicButton
              size="sm"
              variant="secondary"
              onClick={cancelCrop}
              disabled={isLoading}
              className="px-4"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </NeumorphicButton>
            
            <NeumorphicButton
              size="sm"
              onClick={saveCroppedImage}
              disabled={isLoading || !completedCrop}
              className="px-4"
            >
              {isLoading ? 'Processing...' : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </NeumorphicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const GeneralSettingsSection: React.FC<SectionProps> = ({ settings, handleInputChange, handleToggleChange }) => {
  return (
    <NeumorphicCard>
      <h2 className="text-xl font-semibold mb-6 text-foreground">General Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Author Name</label>
          <input
            type="text"
            value={settings.general.authorName}
            onChange={(e) => handleInputChange('general', 'authorName', e.target.value)}
            className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
          <input
            type="email"
            value={settings.general.email}
            onChange={(e) => handleInputChange('general', 'email', e.target.value)}
            className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 neu-flat dark:shadow-dark-neu-flat rounded-lg">
          <div>
            <h3 className="font-medium text-foreground flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Show Email in Footer
            </h3>
            <p className="text-sm text-muted-foreground">Display email contact link in the footer</p>
          </div>
          <Switch 
            checked={settings.general.showEmailInFooter}
            onCheckedChange={() => handleToggleChange('general', 'showEmailInFooter')}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        <ImageUploader 
          imageUrl={settings.general.siteIcon} 
          onImageChange={(url) => handleInputChange('general', 'siteIcon', url)} 
        />
      </div>
    </NeumorphicCard>
  );
};

export default GeneralSettingsSection; 