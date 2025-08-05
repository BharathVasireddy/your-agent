'use client';

import { useState, useEffect } from 'react';
import { Copy, Share, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface CopyShareButtonsProps {
  agentSlug: string;
  agentName: string;
}

export default function CopyShareButtons({ agentSlug, agentName }: CopyShareButtonsProps) {
  const [copiedRecently, setCopiedRecently] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');

  // Set the profile URL only on the client side
  useEffect(() => {
    setProfileUrl(`${window.location.origin}/${agentSlug}`);
  }, [agentSlug]);

  const handleCopyUrl = async () => {
    if (!profileUrl) return; // Don't proceed if URL isn't set yet
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopiedRecently(true);
      toast.success('Profile URL copied to clipboard!');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedRecently(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = profileUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopiedRecently(true);
        toast.success('Profile URL copied to clipboard!');
        setTimeout(() => {
          setCopiedRecently(false);
        }, 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        toast.error('Failed to copy URL. Please copy manually from the address bar.');
      }
    }
  };

  const handleShare = async () => {
    if (!profileUrl) return; // Don't proceed if URL isn't set yet
    
    const shareData = {
      title: `${agentName} - Real Estate Agent`,
      text: `Check out ${agentName}'s real estate profile`,
      url: profileUrl,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy URL to clipboard
        handleCopyUrl();
      }
    } catch (error) {
      // User cancelled the share or other error
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback to copy
        handleCopyUrl();
      }
    }
  };

  // Don't render buttons until we have the URL (avoids hydration mismatch)
  if (!profileUrl) {
    return (
      <div className="flex justify-center space-x-3">
        <div className="inline-flex items-center justify-center px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg opacity-50 w-[104px]">
          <Copy className="w-4 h-4 mr-2" />
          Copy URL
        </div>
        <div className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg opacity-50 w-[130px]">
          <Share className="w-4 h-4 mr-2" />
          Share Profile
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-3">
      {/* Copy URL Button */}
      <button
        onClick={handleCopyUrl}
        className="inline-flex items-center justify-center px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors w-[104px]"
        title="Copy profile URL"
      >
        {copiedRecently ? (
          <>
            <Check className="w-4 h-4 mr-2 text-green-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy URL
          </>
        )}
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-[130px]"
        title="Share profile"
      >
        <Share className="w-4 h-4 mr-2" />
        Share Profile
      </button>
    </div>
  );
}