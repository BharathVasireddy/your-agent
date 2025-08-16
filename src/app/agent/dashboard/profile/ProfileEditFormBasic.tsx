'use client';

import { useState, useEffect, useRef } from 'react';
import { ENTITLEMENTS, type Plan } from '@/lib/subscriptions';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationSelector from '@/components/common/LocationSelector';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Upload, X, Loader2, Check, Sparkles, Save } from 'lucide-react';
import { updateAgentProfile, generateBio } from '@/app/actions';
import PhoneWhatsAppVerify from '@/components/PhoneWhatsAppVerify';
import { logoFontOptions } from '@/lib/logo-fonts';
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
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  twitterUrl?: string | null;
  officeAddress?: string | null;
  officeMapUrl?: string | null;
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
    stateId: (agent as unknown as { stateId?: string | null }).stateId || '',
    districtId: (agent as unknown as { districtId?: string | null }).districtId || '',
    cityId: (agent as unknown as { cityId?: string | null }).cityId || '',
    template: agent.template || 'legacy-pro',
    profilePhotoUrl: agent.profilePhotoUrl || '',
    logoFont: (agent as unknown as { logoFont?: string }).logoFont || 'sans',
    logoMaxHeight: (agent as unknown as { logoMaxHeight?: number }).logoMaxHeight || 48,
    logoMaxWidth: (agent as unknown as { logoMaxWidth?: number }).logoMaxWidth || 160,
    slug: agent.slug || '',
    dateOfBirth: agent.dateOfBirth ? agent.dateOfBirth.toISOString().split('T')[0] : '',
    websiteUrl: (agent as unknown as { websiteUrl?: string | null }).websiteUrl || '',
    facebookUrl: (agent as unknown as { facebookUrl?: string | null }).facebookUrl || '',
    instagramUrl: (agent as unknown as { instagramUrl?: string | null }).instagramUrl || '',
    linkedinUrl: (agent as unknown as { linkedinUrl?: string | null }).linkedinUrl || '',
    youtubeUrl: (agent as unknown as { youtubeUrl?: string | null }).youtubeUrl || '',
    twitterUrl: (agent as unknown as { twitterUrl?: string | null }).twitterUrl || '',
    officeAddress: (agent as unknown as { officeAddress?: string | null }).officeAddress || '',
    officeMapUrl: (agent as unknown as { officeMapUrl?: string | null }).officeMapUrl || '',
  });

  // Determine plan restrictions for template selection
  const plan: Plan = (agent as unknown as { subscriptionPlan?: Plan | null }).subscriptionPlan ?? 'starter';
  const allowedTemplates = ENTITLEMENTS[plan].templates === 'all' ? null : new Set<string>((ENTITLEMENTS[plan].templates as unknown) as string[]);

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

  // Indian cities (legacy list, currently unused)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Hyderabad areas (legacy list, currently unused)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);

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

  // Keep phone stored as E.164 (e.g., +919876543210). Display/validation handled by PhoneWhatsAppVerify.

  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'phone' && typeof value === 'string') {
      // Store as E.164 without formatting; verification widget provides E.164
      const newValue = value;
      const isValidPhone = validatePhone(newValue);
      if (newValue !== formData.phone) setPhoneVerified(false);
      setPhoneError(newValue && !isValidPhone ? 'Please enter a valid Indian mobile number' : null);
      setFormData(prev => ({ ...prev, [field]: newValue }));
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

  // If user's cached verified phone matches current value, mark as verified on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('wa_phone_e164');
      if (cached && cached === formData.phone) {
        setPhoneVerified(true);
        setPhoneError(null);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Require verification flag before saving (client-side guard)
    if (!phoneVerified) {
      toast.error('Please verify your phone number via WhatsApp before saving.');
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
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImageUrl}
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-zinc-100 border-4 border-brand-light flex items-center justify-center">
                  <User className="w-16 h-16 text-zinc-400" />
                </div>
              )}
              
              {displayImageUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-hover transition-colors"
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
                className="text-brand border-brand-soft hover:bg-brand-light"
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
                <p className="text-sm text-brand mt-2">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Professional Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Phone with WhatsApp Verification */}
            <div className="space-y-2">
              <PhoneWhatsAppVerify
                label="Phone Number"
                value={formData.phone}
                onValueChange={(e164) => handleInputChange('phone', e164)}
                onVerified={(e164) => {
                  handleInputChange('phone', e164);
                  setPhoneVerified(true);
                  setPhoneError(null);
                }}
                required
              />
              {!phoneVerified && (
                <p className="text-xs text-zinc-500">Please verify your phone via WhatsApp to enable saving.</p>
              )}
              {phoneError && (
                <p className="text-sm text-brand">{phoneError}</p>
              )}
            </div>

            {/* Location Hierarchy */}
            <div className="space-y-2 md:col-span-3">
              <Label className="text-zinc-600">Location *</Label>
              <LocationSelector
                stateId={formData.stateId}
                districtId={formData.districtId}
                cityId={formData.cityId}
                onStateChange={(v)=>setFormData(prev=>({ ...prev, stateId: v, districtId: '', cityId: '' }))}
                onDistrictChange={(v)=>setFormData(prev=>({ ...prev, districtId: v, cityId: '' }))}
                onCityChange={async (v)=>{
                  setFormData(prev=>({ ...prev, cityId: v }));
                  try{
                    const res = await fetch(`/api/locations?districtId=${formData.districtId}`);
                    const data = await res.json();
                    const found = Array.isArray(data.cities) ? data.cities.find((c: { id: string; name: string })=>c.id===v) : null;
                    if(found){ setFormData(prev=>({ ...prev, city: found.name })); }
                  }catch{}
                }}
                required
              />
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
                      <X className="w-4 h-4 text-brand" />
                    ) : null}
                  </div>
                </div>
              </div>
              {/* Validation Message */}
              {slugValidation.message && (
                <p className={`text-xs ${
                  slugValidation.available 
                    ? 'text-green-600' 
                    : 'text-brand'
                }`}>
                  {slugValidation.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Logo Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Logo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-600">Text Logo Font (used when no image logo)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {logoFontOptions.map((opt) => (
                  <label key={opt.value} className={`flex items-center gap-2 p-2 border rounded ${formData.logoFont === opt.value ? 'border-zinc-900' : 'border-zinc-200'}`}>
                    <input
                      type="radio"
                      name="logoFont"
                      value={opt.value}
                      checked={formData.logoFont === opt.value}
                      onChange={(e) => handleInputChange('logoFont', e.target.value)}
                    />
                    <span className={opt.className}>{opt.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-zinc-500">If you haven&apos;t uploaded a logo image, your name will be rendered in this font as the logo.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-600">Logo Size</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoMaxWidth" className="text-zinc-600 text-xs">Max Width (px)</Label>
                  <Input
                    id="logoMaxWidth"
                    type="number"
                    value={formData.logoMaxWidth}
                    onChange={(e) => handleInputChange('logoMaxWidth', parseInt(e.target.value) || 0)}
                    className="mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <Label htmlFor="logoMaxHeight" className="text-zinc-600 text-xs">Max Height (px)</Label>
                  <Input
                    id="logoMaxHeight"
                    type="number"
                    value={formData.logoMaxHeight}
                    onChange={(e) => handleInputChange('logoMaxHeight', parseInt(e.target.value) || 0)}
                    className="mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500">Logos render with object-contain so they scale evenly without distortion.</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Social & Website Links</h3>
          <p className="text-sm text-zinc-600 mb-4">Add any links you want to display on your public profile.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="text-zinc-600 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.76 0 3.37.57 4.68 1.53L5.53 16.68A7.97 7.97 0 014 12c0-4.42 3.58-8 8-8zm0 16a7.97 7.97 0 01-4.68-1.53L18.47 7.32A7.97 7.97 0 0120 12c0 4.42-3.58 8-8 8z"/></svg>Website</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://your-website.com"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookUrl" className="text-zinc-600 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.95v-7.04H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.29.2 2.29.2v2.52h-1.29c-1.27 0-1.67.79-1.67 1.6V12h2.84l-.45 2.91h-2.39v7.04A10 10 0 0022 12z"/></svg>Facebook</Label>
              <Input
                id="facebookUrl"
                type="url"
                placeholder="https://facebook.com/yourpage"
                value={formData.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl" className="text-zinc-600 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.75-2.75a1 1 0 100 2 1 1 0 000-2z"/></svg>Instagram</Label>
              <Input
                id="instagramUrl"
                type="url"
                placeholder="https://instagram.com/yourhandle"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="text-zinc-600 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M19 3A2.94 2.94 0 0122 6v12a2.94 2.94 0 01-3 3H5a2.94 2.94 0 01-3-3V6a2.94 2.94 0 013-3h14zM8.34 18v-7H5.67v7h2.67zM7 9.75a1.55 1.55 0 110-3.1 1.55 1.55 0 010 3.1zM18.33 18v-3.78c0-2.02-1.08-2.96-2.53-2.96a2.19 2.19 0 00-2 1.1h-.05V11h-2.67v7h2.67v-3.64c0-.96.17-1.9 1.38-1.9s1.33 1.13 1.33 1.97V18h2.67z"/></svg>LinkedIn</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl" className="text-zinc-600 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.75 15.02v-6l6 3-6 3z"/></svg>YouTube</Label>
              <Input
                id="youtubeUrl"
                type="url"
                placeholder="https://youtube.com/@yourchannel"
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl" className="text-zinc-600 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.244 2H21l-6.564 7.5L22 22h-6.844l-4.39-5.747L5.6 22H3l7.036-8.045L2 2h6.922l3.993 5.332L18.244 2zm-2.4 18h1.481L8.274 4H6.706l9.138 16z"/></svg>Twitter / X</Label>
              <Input
                id="twitterUrl"
                type="url"
                placeholder="https://x.com/yourhandle"
                value={formData.twitterUrl}
                onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="officeAddress" className="text-zinc-600">Office Address</Label>
              <Textarea
                id="officeAddress"
                placeholder="Flat/Plot No, Street, Locality, City, State, Pincode"
                value={formData.officeAddress}
                onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-zinc-500">Shown in your profile footer. Keep it concise (max 200 chars).</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="officeMapUrl" className="text-zinc-600">Office Google Maps Link</Label>
              <Input
                id="officeMapUrl"
                type="url"
                placeholder="https://maps.google.com/..."
                value={formData.officeMapUrl}
                onChange={(e) => handleInputChange('officeMapUrl', e.target.value)}
              />
              <p className="text-xs text-zinc-500">Paste a shareable Google Maps URL for your office location.</p>
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
              className="text-brand border-brand-soft hover:bg-brand-light min-w-[180px] justify-center px-6 py-3 h-auto"
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
            <div className="p-3 bg-brand-light border border-brand-soft rounded-lg mb-4">
              <p className="text-sm text-brand-hover">{generationError}</p>
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
            <p className={`text-xs ${formData.bio.length > 450 ? 'text-brand' : 'text-zinc-500'}`}> 
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-2">Profile Template</h3>
          {allowedTemplates && (
            <p className="text-xs text-zinc-600 mb-3">Your current plan allows only selected templates. Upgrade to unlock all templates.</p>
          )}
          <RadioGroup value={formData.template} onValueChange={(value) => {
            if (allowedTemplates && !allowedTemplates.has(value)) return; // block disallowed selection
            handleInputChange('template', value);
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Legacy Pro */}
              <label
                htmlFor="legacy-pro"
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${formData.template === 'legacy-pro' ? 'border-brand-soft bg-brand-light' : 'border-zinc-200 hover:bg-zinc-50'} ${allowedTemplates && !allowedTemplates.has('legacy-pro') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${formData.template === 'fresh-minimal' ? 'border-brand-soft bg-brand-light' : 'border-zinc-200 hover:bg-zinc-50'} ${allowedTemplates && !allowedTemplates.has('fresh-minimal') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${formData.template === 'mono-modern' ? 'border-brand-soft bg-brand-light' : 'border-zinc-200 hover:bg-zinc-50'} ${allowedTemplates && !allowedTemplates.has('mono-modern') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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

              {/* Mono Elite */}
              <label
                htmlFor="mono-elite"
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${formData.template === 'mono-elite' ? 'border-brand-soft bg-brand-light' : 'border-zinc-200 hover:bg-zinc-50'}`}
              >
                <RadioGroupItem value="mono-elite" id="mono-elite" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-950">Mono Elite</p>
                      <p className="text-sm text-zinc-600">Premium monochrome with grid pattern and motion reveals</p>
                    </div>
                    <a
                      href="/preview?template=mono-elite"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 rounded text-xs font-medium bg-zinc-50 text-zinc-900 border border-zinc-200 hover:opacity-90"
                    >
                      Preview
                    </a>
                  </div>
                  <div className="w-full h-4 bg-zinc-700 rounded mt-3"></div>
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
          className="bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-full shadow-lg"
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