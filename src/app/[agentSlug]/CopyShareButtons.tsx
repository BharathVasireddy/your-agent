'use client';

import { useState } from 'react';
import { Copy, Share, Check } from 'lucide-react';

interface CopyShareButtonsProps {
  agentSlug: string;
  agentName: string;
}

export default function CopyShareButtons({ agentSlug, agentName }: CopyShareButtonsProps) {
  const [copiedRecently, setCopiedRecently] = useState(false);
  const profileUrl = `${window.location.origin}/${agentSlug}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopiedRecently(true);
      
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
        setTimeout(() => {
          setCopiedRecently(false);
        }, 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Failed to copy URL. Please copy manually: ' + profileUrl);
      }
    }
  };

  const handleShare = async () => {
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

  return (
    <div className="flex justify-center space-x-3">
      {/* Copy URL Button */}
      <button
        onClick={handleCopyUrl}
        className="inline-flex items-center px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
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
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        title="Share profile"
      >
        <Share className="w-4 h-4 mr-2" />
        Share Profile
      </button>
    </div>
  );
}