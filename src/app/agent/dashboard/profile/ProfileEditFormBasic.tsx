'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Upload, X, Loader2, Check, Sparkles, Save } from 'lucide-react';
import { updateAgentProfile, generateBio } from '@/app/actions';
import toast from 'react-hot-toast';

interface Agent {
  id: string;
  slug: string;
  experience: number | null;
  bio: string | null;
  phone: string | null;
  city: string | null;
  area: string | null;
  template: string;
  profilePhotoUrl: string | null;
  dateOfBirth: Date | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface ProfileEditFormBasicProps {
  agent: Agent;
}

export default function ProfileEditFormBasic({ agent }: ProfileEditFormBasicProps) {
  
  // Form state
  const [formData, setFormData] = useState({
    experience: agent.experience || 0,
    bio: agent.bio || '',
    phone: agent.phone || '',
    city: agent.city || '',
    area: agent.area || '',
    template: agent.template === 'fresh-minimal' ? 'fresh-minimal' : 'legacy-pro',
    profilePhotoUrl: agent.profilePhotoUrl || '',
    slug: agent.slug || '',
    dateOfBirth: agent.dateOfBirth ? agent.dateOfBirth.toISOString().split('T')[0] : '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slug validation state
  const [slugValidation, setSlugValidation] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
    cleanSlug: string;
  }>({
    checking: false,
    available: null,
    message: '',
    cleanSlug: ''
  });

  // Indian cities
  const indianCities = [
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi", value: "Delhi" },
    { label: "Bangalore", value: "Bangalore" },
    { label: "Chennai", value: "Chennai" },
    { label: "Kolkata", value: "Kolkata" },
    { label: "Pune", value: "Pune" },
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Jaipur", value: "Jaipur" },
    { label: "Surat", value: "Surat" },
    { label: "Lucknow", value: "Lucknow" },
    { label: "Kanpur", value: "Kanpur" },
    { label: "Nagpur", value: "Nagpur" },
    { label: "Indore", value: "Indore" },
    { label: "Thane", value: "Thane" },
    { label: "Bhopal", value: "Bhopal" },
    { label: "Visakhapatnam", value: "Visakhapatnam" },
    { label: "Vadodara", value: "Vadodara" },
    { label: "Firozabad", value: "Firozabad" },
    { label: "Ludhiana", value: "Ludhiana" }
  ];

  // Hyderabad areas
  const hyderabadAreas = [
    { label: "Madhapur", value: "Madhapur" },
    { label: "Gachibowli", value: "Gachibowli" },
    { label: "Kokapet", value: "Kokapet" },
    { label: "Kondapur", value: "Kondapur" },
    { label: "Banjara Hills", value: "Banjara Hills" },
    { label: "Jubilee Hills", value: "Jubilee Hills" },
    { label: "HITEC City", value: "HITEC City" },
    { label: "Financial District", value: "Financial District" },
    { label: "Begumpet", value: "Begumpet" },
    { label: "Secunderabad", value: "Secunderabad" },
    { label: "Kukatpally", value: "Kukatpally" },
    { label: "Miyapur", value: "Miyapur" },
    { label: "Bachupally", value: "Bachupally" },
    { label: "Kompally", value: "Kompally" },
    { label: "Nizampet", value: "Nizampet" },
    { label: "Chanda Nagar", value: "Chanda Nagar" },
    { label: "Manikonda", value: "Manikonda" },
    { label: "Nanakramguda", value: "Nanakramguda" },
    { label: "Raidurg", value: "Raidurg" },
    { label: "Uppal", value: "Uppal" },
    { label: "LB Nagar", value: "LB Nagar" },
    { label: "Dilsukhnagar", value: "Dilsukhnagar" },
    { label: "Ameerpet", value: "Ameerpet" },
    { label: "Malakpet", value: "Malakpet" },
    { label: "Other", value: "Other" }
  ];

  // Phone validation
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's a valid Indian mobile number
    if (digitsOnly.length === 10 && digitsOnly.match(/^[6-9]/)) {
      return true; // Valid 10-digit Indian mobile
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && digitsOnly.substring(2).match(/^[6-9]/)) {
      return true; // Valid with +91 country code
    } else if (digitsOnly.length === 13 && digitsOnly.startsWith('091') && digitsOnly.substring(3).match(/^[6-9]/)) {
      return true; // Valid with 091 country code
    }
    
    return false;
  };

  const formatPhone = (phone: string): string => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Format based on length
    if (digitsOnly.length <= 10) {
      // Format as XXXXX XXXXX
      return digitsOnly.replace(/(\d{5})(\d{1,5})/, '$1 $2').trim();
    } else if (digitsOnly.length <= 12) {
      // Format as +XX XXXXX XXXXX
      return digitsOnly.replace(/(\d{2})(\d{5})(\d{1,5})/, '+$1 $2 $3').trim();
    }
    
    return phone; // Return as-is if too long
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'phone' && typeof value === 'string') {
      // Format phone number and validate
      const formattedPhone = formatPhone(value);
      const isValidPhone = validatePhone(value);
      
      setPhoneError(value && !isValidPhone ? 'Please enter a valid Indian mobile number' : null);
      setFormData(prev => ({ ...prev, [field]: formattedPhone }));
    } else if (field === 'city' && typeof value === 'string') {
      // Reset area when city changes (unless it's Hyderabad)
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        area: value === 'Hyderabad' ? prev.area : '' 
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Debounced slug validation
  useEffect(() => {
    if (!formData.slug || formData.slug === agent.slug) {
      setSlugValidation(prev => ({ ...prev, available: null, message: '', cleanSlug: '' }));
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSlugValidation(prev => ({ ...prev, checking: true }));

        const response = await fetch('/api/check-slug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: formData.slug }),
        });

        const result = await response.json();

        setSlugValidation({
          checking: false,
          available: result.available,
          message: result.message,
          cleanSlug: result.slug
        });

        // Update the slug with the cleaned version if different
        if (result.slug !== formData.slug) {
          setFormData(prev => ({ ...prev, slug: result.slug }));
        }

      } catch (error) {
        console.error('Error checking slug:', error);
        setSlugValidation({
          checking: false,
          available: false,
          message: 'Error checking URL availability',
          cleanSlug: formData.slug
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.slug, agent.slug]);

  const handleGenerateBio = async () => {
    if (!formData.experience || !formData.city) {
      toast.error('Please fill in your experience and city first.');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);

      const result = await generateBio({
        name: agent.user.name || '',
        experience: formData.experience,
        city: formData.city,
        area: formData.area
      });

      if (result.success && result.bio) {
        setFormData(prev => ({ ...prev, bio: result.bio }));
        toast.success('Bio generated successfully!');
      }

    } catch (error) {
      console.error('Error generating bio:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate bio. Please try again.';
      setGenerationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

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

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, profilePhotoUrl: result.url }));
        setPreviewUrl(result.url);
        toast.success('Profile photo uploaded successfully!');
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

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhotoUrl: '' }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.city || !formData.phone || !formData.experience || !formData.dateOfBirth) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Validate area for Hyderabad
    if (formData.city === 'Hyderabad' && !formData.area) {
      toast.error('Please select your area in Hyderabad.');
      return;
    }

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid Indian mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await updateAgentProfile(formData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayImageUrl = previewUrl || formData.profilePhotoUrl;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo Section */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Profile Photo</h3>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Photo Display */}
            <div className="relative">
              {displayImageUrl ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImageUrl}
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-zinc-100 border-4 border-red-100 flex items-center justify-center">
                  <User className="w-16 h-16 text-zinc-400" />
                </div>
              )}
              
              {displayImageUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Upload Controls */}
            <div className="text-center">
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
                    {displayImageUrl ? 'Change Photo' : 'Upload Photo'}
                  </>
                )}
              </Button>
              
              {uploadError && (
                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Professional Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-zinc-600">Years of Experience *</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-zinc-600">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-600">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="e.g., +91 98765 43210"
                required
                className={phoneError ? 'border-red-300 focus:border-red-500' : ''}
              />
              {phoneError && (
                <p className="text-sm text-red-600">{phoneError}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-zinc-600">City *</Label>
              <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] w-full">
                  {indianCities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="area" className="text-zinc-600">
                Area {formData.city === 'Hyderabad' ? '*' : '(Optional)'}
              </Label>
              {formData.city === 'Hyderabad' ? (
                <Select value={formData.area} onValueChange={(value) => handleInputChange('area', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your area in Hyderabad" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] w-full">
                    {hyderabadAreas.map((area) => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="area"
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="Enter your area/locality"
                />
              )}
            </div>

            {/* Custom Profile URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="slug" className="text-zinc-600">Your Profile URL</Label>
              <div className="relative">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-zinc-500 bg-zinc-50 border border-r-0 border-zinc-300 rounded-l-md">
                    youragent.in/
                  </span>
                  <Input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="your-name"
                    className="rounded-l-none pr-10"
                  />
                  {/* Validation Icon */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {slugValidation.checking ? (
                      <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                    ) : slugValidation.available === true ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : slugValidation.available === false ? (
                      <X className="w-4 h-4 text-red-600" />
                    ) : null}
                  </div>
                </div>
              </div>
              {/* Validation Message */}
              {slugValidation.message && (
                <p className={`text-xs ${
                  slugValidation.available 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {slugValidation.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-950">Professional Bio</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateBio}
              disabled={isGenerating || !formData.experience || !formData.city}
              className="text-red-600 border-red-200 hover:bg-red-50 min-w-[180px] justify-center px-6 py-3 h-auto"
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
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700">{generationError}</p>
            </div>
          )}

          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell potential clients about your background, expertise, and what sets you apart in the real estate market..."
            className="min-h-[150px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-zinc-500">
              This will appear on your public profile
            </p>
            <p className={`text-xs ${formData.bio.length > 450 ? 'text-red-600' : 'text-zinc-500'}`}>
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Profile Template</h3>
          <RadioGroup value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Legacy Pro */}
              <label
                htmlFor="legacy-pro"
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${formData.template === 'legacy-pro' ? 'border-red-200 bg-red-50' : 'border-zinc-200 hover:bg-zinc-50'}`}
              >
                <RadioGroupItem value="legacy-pro" id="legacy-pro" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-950">Legacy Pro</p>
                      <p className="text-sm text-zinc-600">Solid, professional layout with proven UX</p>
                    </div>
                    <a
                      href="/preview?template=legacy-pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 rounded text-xs font-medium bg-zinc-50 text-zinc-900 border border-zinc-200 hover:opacity-90"
                    >
                      Preview
                    </a>
                  </div>
                  <div className="w-full h-4 bg-zinc-900 rounded mt-3"></div>
                </div>
              </label>

              {/* Fresh Minimal */}
              <label
                htmlFor="fresh-minimal"
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${formData.template === 'fresh-minimal' ? 'border-red-200 bg-red-50' : 'border-zinc-200 hover:bg-zinc-50'}`}
              >
                <RadioGroupItem value="fresh-minimal" id="fresh-minimal" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-950">Fresh Minimal</p>
                      <p className="text-sm text-zinc-600">Light, airy design with minimal aesthetic</p>
                    </div>
                    <a
                      href="/preview?template=fresh-minimal"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:opacity-90"
                    >
                      Preview
                    </a>
                  </div>
                  <div className="w-full h-4 bg-green-600 rounded mt-3"></div>
                </div>
              </label>

              {/* Mono Modern */}
              <label
                htmlFor="mono-modern"
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${formData.template === 'mono-modern' ? 'border-red-200 bg-red-50' : 'border-zinc-200 hover:bg-zinc-50'}`}
              >
                <RadioGroupItem value="mono-modern" id="mono-modern" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-950">Mono Modern</p>
                      <p className="text-sm text-zinc-600">Monochrome, editorial layout with strong typography</p>
                    </div>
                    <a
                      href="/preview?template=mono-modern"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 rounded text-xs font-medium bg-zinc-50 text-zinc-900 border border-zinc-200 hover:opacity-90"
                    >
                      Preview
                    </a>
                  </div>
                  <div className="w-full h-4 bg-zinc-800 rounded mt-3"></div>
                </div>
              </label>
            </div>
          </RadioGroup>
        </div>
      </form>

      {/* Sticky Save Button */}
      <div className="sticky bottom-20 md:bottom-6 z-50 flex justify-end pb-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Website Content Management</h4>
        <p className="text-blue-700 text-sm">
          Looking to customize your website content? Visit the{' '}
          <Link href="/agent/dashboard/customise-website" className="underline font-medium">
            Customise Website
          </Link>{' '}
          section to manage testimonials, FAQs, and other content that appears on your public profile.
        </p>
      </div>
    </div>
  );
}