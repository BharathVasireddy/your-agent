'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onImageChange: (url: string) => void;
  className?: string;
  placeholder?: string;
  uploadFolder?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
  maxWidth?: number;
  maxHeight?: number;
}

export default function ImageUploader({
  currentImageUrl,
  onImageChange,
  className = '',
  placeholder = 'No image selected',
  uploadFolder = 'agent-uploads',
  aspectRatio = 'auto',
  maxWidth = 400,
  maxHeight = 400
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      const errorMsg = 'Please select a JPEG, PNG, or WebP image.';
      setUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'Image size must be less than 5MB.';
      setUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setUploadError(null);
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', uploadFolder);
      if (aspectRatio !== 'auto') {
        formData.append('aspectRatio', aspectRatio);
      }
      formData.append('maxWidth', maxWidth.toString());
      formData.append('maxHeight', maxHeight.toString());

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
        onImageChange(result.url);
        setPreviewUrl(result.url);
        toast.success('Image uploaded successfully!');
      } else {
        const errorMsg = result.error || 'Failed to upload image.';
        setUploadError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMsg = 'Failed to upload image. Please try again.';
      setUploadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Display */}
      {displayImageUrl ? (
        <div className="relative">
          <div className={`overflow-hidden border-2 border-red-100 rounded-lg ${
            aspectRatio === 'square' ? 'aspect-square' :
            aspectRatio === 'wide' ? 'aspect-video' : ''
          }`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImageUrl}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
          </div>
          
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center ${
          aspectRatio === 'square' ? 'aspect-square' :
          aspectRatio === 'wide' ? 'aspect-video' : 'min-h-[120px]'
        } flex items-center justify-center`}>
          <div>
            <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">{placeholder}</p>
          </div>
        </div>
      )}

      {/* Upload Controls */}
      <div className="flex flex-col items-start space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <Button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {displayImageUrl ? 'Change Image' : 'Upload Image'}
            </>
          )}
        </Button>
        
        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}
      </div>
    </div>
  );
}