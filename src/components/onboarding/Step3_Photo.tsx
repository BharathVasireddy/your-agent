'use client';

import { useState, useRef } from "react";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { Camera, User, Upload, X, Loader2 } from "lucide-react";

export default function Step3_Photo() {
  const { profilePhotoUrl, setData } = useWizardStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File size must be under 5MB.');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadError(null);

    // Upload the file
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      if (result.success && result.url) {
        // Update the wizard store with the uploaded image URL
        setData({ profilePhotoUrl: result.url });
        setPreviewUrl(null); // Clear preview since we have the actual uploaded image
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error 
          ? error.message 
          : 'Failed to upload image. Please try again.'
      );
      setPreviewUrl(null);
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

  const handleRemovePhoto = () => {
    setData({ profilePhotoUrl: '' });
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const displayImageUrl = previewUrl || profilePhotoUrl;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Upload Your Profile Photo</h2>
        <p className="text-zinc-600">Use a clear headshot with good lighting.</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Photo Upload Area */}
        <div 
          className="relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Photo Preview */}
          <div className="w-32 h-32 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden relative">
            {displayImageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImageUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                {/* Loading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                {/* Remove button */}
                {!isUploading && profilePhotoUrl && (
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-0 right-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-red-700 transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </>
            ) : (
              <User className="w-16 h-16 text-zinc-400" />
            )}
          </div>
          
          {/* Camera overlay (only show if no image or not uploading) */}
          {!displayImageUrl && !isUploading && (
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
              <Camera className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg max-w-sm">
            <p className="text-sm text-red-700 text-center">{uploadError}</p>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {profilePhotoUrl ? 'Change Photo' : 'Upload Image'}
            </>
          )}
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <p className="text-xs text-zinc-500 text-center max-w-sm">
          Recommended: Use a high-quality headshot with good lighting. 
          File size should be under 5MB. Supported formats: JPG, PNG, WebP.
          You can also drag and drop an image here.
        </p>
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>Tip:</strong> A professional photo increases trust and connection with potential clients. 
          Make sure you&apos;re well-lit, smiling, and dressed professionally. Your photo will be automatically optimized for web display.
        </p>
      </div>
    </div>
  );
}