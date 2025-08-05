'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useWizardStore } from "@/store/wizard-store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { generateBio } from "@/app/actions";

export default function Step2_About() {
  const { data: session } = useSession();
  const { 
    bio, 
    experience, 
    city, 
    area,
    setData 
  } = useWizardStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleBioChange = (value: string) => {
    // Enforce max length of 500 characters
    if (value.length <= 500) {
      setData({ bio: value });
    }
  };

  const handleGenerateBio = async () => {
    try {
      setIsGenerating(true);
      setGenerationError(null);

      // Get user name from session
      const userName = session?.user?.name || 'Agent';

      // Check if we have the required data from Step 1
      if (!experience || !city) {
        setGenerationError('Please complete Step 1 with your experience and city before generating a bio.');
        return;
      }

      const result = await generateBio({
        name: userName,
        experience,
        city,
        area
      });

      if (result.success && result.bio) {
        setData({ bio: result.bio });
      }

    } catch (error) {
      console.error('Error generating bio:', error);
      setGenerationError(
        error instanceof Error 
          ? error.message 
          : 'Failed to generate bio. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const characterCount = bio.length;
  const maxLength = 500;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">
          About You
        </h2>
        <p className="text-zinc-600">
          Write a brief bio that highlights your expertise and what makes you unique as a real estate agent.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio" className="text-zinc-600">Professional Bio</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateBio}
            disabled={isGenerating || !experience || !city}
            className="text-red-600 border-red-200 hover:bg-red-50 w-[170px] justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Bio with AI
              </>
            )}
          </Button>
        </div>

        {generationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{generationError}</p>
          </div>
        )}

        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => handleBioChange(e.target.value)}
          placeholder="Tell potential clients about your background, expertise, and what sets you apart in the real estate market..."
          className="min-h-[150px] resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-500">
            This will appear on your public profile
          </p>
          <p className={`text-xs ${characterCount > maxLength * 0.9 ? 'text-red-600' : 'text-zinc-500'}`}>
            {characterCount}/{maxLength}
          </p>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>Tip:</strong> Use the AI generator for a professional starting point, then customize it to reflect your unique personality and strengths. 
          A compelling bio should mention your experience, areas of expertise, and what makes you the right choice for clients.
        </p>
      </div>
    </div>
  );
}