'use client';

import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";

export default function Step3_Photo() {
  const { profilePhotoUrl } = useWizardStore();

  const handleUploadClick = () => {
    // TODO: Implement file upload functionality
    console.log("Upload image functionality will be implemented later");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">
          Upload Your Profile Photo
        </h2>
        <p className="text-zinc-600">
          Add a professional photo to help clients recognize and connect with you.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Photo Preview */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center overflow-hidden">
            {profilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePhotoUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-zinc-400" />
            )}
          </div>
          
          {/* Camera overlay */}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUploadClick}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
        >
          <Camera className="w-4 h-4 mr-2" />
          Upload Image
        </Button>

        <p className="text-xs text-zinc-500 text-center max-w-sm">
          Recommended: Use a high-quality headshot with good lighting. 
          File size should be under 5MB. Supported formats: JPG, PNG, WebP.
        </p>
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>Tip:</strong> A professional photo increases trust and connection with potential clients. 
          Make sure you&apos;re well-lit, smiling, and dressed professionally.
        </p>
      </div>
    </div>
  );
}