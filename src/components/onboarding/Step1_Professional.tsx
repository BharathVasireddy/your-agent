'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWizardStore } from "@/store/wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Loader2, MapPin, Phone, Calendar, Link2, AlertCircle } from "lucide-react";

export default function Step1_Professional() {
  const { data: session } = useSession();
  const { 
    experience, 
    city, 
    area,
    phone, 
    slug,
    dateOfBirth,
    setData 
  } = useWizardStore();

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

  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: false,
    message: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setData({ [field]: value });
    
    // Clear area when city changes
    if (field === 'city') {
      setData({ area: '' });
    }
  };

  // Phone validation function
  const validatePhone = (phoneNumber: string) => {
    // Remove all spaces, dashes, and country code prefix
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
    
    // Check for Indian mobile number pattern
    const indianMobileRegex = /^(?:91)?[6-9]\d{9}$/;
    
    if (!phoneNumber.trim()) {
      setPhoneValidation({ isValid: false, message: '' });
      return;
    }
    
    if (cleanPhone.length < 10) {
      setPhoneValidation({ isValid: false, message: 'Phone number is too short' });
      return;
    }
    
    if (cleanPhone.length > 13) {
      setPhoneValidation({ isValid: false, message: 'Phone number is too long' });
      return;
    }
    
    if (indianMobileRegex.test(cleanPhone)) {
      setPhoneValidation({ isValid: true, message: 'Valid phone number' });
    } else {
      setPhoneValidation({ isValid: false, message: 'Please enter a valid Indian mobile number' });
    }
  };

  // Generate initial slug from user's name
  useEffect(() => {
    if (!slug && session?.user?.name) {
      const initialSlug = session.user.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      if (initialSlug) {
        setData({ slug: initialSlug });
      }
    }
  }, [session?.user?.name, slug, setData]);

  // Pre-populate phone for WhatsApp logins and enforce Indian-only
  useEffect(() => {
    if (!phone) {
      try {
        const local = localStorage.getItem('wa_phone_local');
        const e164 = localStorage.getItem('wa_phone_e164');
        // prefer local 10-digit, fallback to e164
        if (local && /^\d{10}$/.test(local)) {
          setData({ phone: `+91${local}` });
          validatePhone(`+91${local}`);
        } else if (e164 && /^\+919\d{9}$/.test(e164)) {
          setData({ phone: e164 });
          validatePhone(e164);
        }
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced slug validation
  useEffect(() => {
    if (!slug) {
      setSlugValidation(prev => ({ ...prev, available: null, message: '', cleanSlug: '' }));
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSlugValidation(prev => ({ ...prev, checking: true }));

        const response = await fetch('/api/check-slug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        });

        const result = await response.json();

        setSlugValidation({
          checking: false,
          available: result.available,
          message: result.message,
          cleanSlug: result.slug
        });

        // Update the slug with the cleaned version if different
        if (result.slug !== slug) {
          setData({ slug: result.slug });
        }

      } catch (error) {
        console.error('Error checking slug:', error);
        setSlugValidation({
          checking: false,
          available: false,
          message: 'Error checking URL availability',
          cleanSlug: slug
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [slug, setData]);

  // Phone validation effect
  useEffect(() => {
    if (phone) {
      validatePhone(phone);
    }
  }, [phone]);

  // Cities and their areas - this would ideally come from an API managed by admin
  const citiesWithAreas = {
    'Hyderabad': [
      { label: "Madhapur", value: "Madhapur" },
      { label: "Gachibowli", value: "Gachibowli" },
      { label: "Kondapur", value: "Kondapur" },
      { label: "HITEC City", value: "HITEC City" },
      { label: "Financial District", value: "Financial District" },
      { label: "Kokapet", value: "Kokapet" },
      { label: "Banjara Hills", value: "Banjara Hills" },
      { label: "Jubilee Hills", value: "Jubilee Hills" },
      { label: "Punjagutta", value: "Punjagutta" },
      { label: "Ameerpet", value: "Ameerpet" },
      { label: "Secunderabad", value: "Secunderabad" },
      { label: "Kukatpally", value: "Kukatpally" },
      { label: "Miyapur", value: "Miyapur" },
      { label: "Uppal", value: "Uppal" },
      { label: "LB Nagar", value: "LB Nagar" },
      { label: "Dilsukhnagar", value: "Dilsukhnagar" },
      { label: "Charminar", value: "Charminar" },
      { label: "Abids", value: "Abids" },
    ],
    'Bangalore': [
      { label: "Koramangala", value: "Koramangala" },
      { label: "Indiranagar", value: "Indiranagar" },
      { label: "Whitefield", value: "Whitefield" },
      { label: "Electronic City", value: "Electronic City" },
      { label: "HSR Layout", value: "HSR Layout" },
      { label: "BTM Layout", value: "BTM Layout" },
      { label: "Marathahalli", value: "Marathahalli" },
      { label: "Sarjapur Road", value: "Sarjapur Road" },
    ],
    'Mumbai': [
      { label: "Bandra", value: "Bandra" },
      { label: "Andheri", value: "Andheri" },
      { label: "Powai", value: "Powai" },
      { label: "Lower Parel", value: "Lower Parel" },
      { label: "Worli", value: "Worli" },
      { label: "Malad", value: "Malad" },
      { label: "Thane", value: "Thane" },
      { label: "Navi Mumbai", value: "Navi Mumbai" },
    ]
  } as const;

  const availableCities = Object.keys(citiesWithAreas);
  const availableAreas = city ? citiesWithAreas[city as keyof typeof citiesWithAreas] || [] : [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section with Better Typography */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-950 mb-3">
          Professional Information
        </h2>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Help us create your professional profile with your location and contact details.
        </p>
      </div>

      {/* Form Grid with Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Location Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950">Location</h3>
          </div>
          
          <div className="space-y-4">
            {/* City Selection */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-zinc-700">City *</Label>
              <Select value={city} onValueChange={(value) => handleInputChange('city', value)}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area Selection - Only show if city is selected */}
            {city && (
              <div className="space-y-2">
                <Label htmlFor="area" className="text-sm font-medium text-zinc-700">Primary Area *</Label>
                <Select value={area} onValueChange={(value) => handleInputChange('area', value)}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder={`Select area in ${city}`} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {availableAreas.map((areaItem) => (
                      <SelectItem key={areaItem.value} value={areaItem.value}>
                        {areaItem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Experience Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950">Contact & Experience</h3>
          </div>
          
          <div className="space-y-4">
            {/* Phone Number with Validation */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-zinc-700">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone || ''}
                  onChange={(e) => {
                    // Always store as E.164 +91XXXXXXXXXX
                    const digits = e.target.value.replace(/\D/g,'').slice(-10);
                    const e164 = digits ? `+91${digits}` : '';
                    handleInputChange('phone', e164);
                  }}
                  placeholder="10-digit Indian mobile number"
                  className={`pl-10 h-11 ${
                    phoneValidation.message && !phoneValidation.isValid 
                      ? 'border-red-300 focus:border-red-500' 
                      : phoneValidation.isValid 
                        ? 'border-green-300 focus:border-green-500' 
                        : ''
                  }`}
                />
                {/* Phone Validation Icon */}
                {phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {phoneValidation.isValid ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                )}
              </div>
              {phoneValidation.message && (
                <p className={`text-xs ${phoneValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {phoneValidation.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-zinc-700">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-zinc-700">Years of Experience *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="experience"
                  type="number"
                  value={experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  placeholder="5"
                  min="0"
                  max="50"
                  className="pl-10 h-11"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile URL Card - Full Width */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Link2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-950">Profile URL</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium text-zinc-700">Your Custom Profile URL *</Label>
          <div className="relative">
            <div className="flex">
              <span className="inline-flex items-center px-4 text-sm font-medium text-zinc-600 bg-zinc-100 border border-r-0 border-zinc-300 rounded-l-lg">
                youragent.in/
              </span>
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="your-name"
                className="rounded-l-none pr-12 h-11"
              />
              {/* Validation Icon */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {slugValidation.checking ? (
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                ) : slugValidation.available === true ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : slugValidation.available === false ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : null}
              </div>
            </div>
          </div>
          {/* Validation Message */}
          {slugValidation.message && (
            <p className={`text-sm ${
              slugValidation.available 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {slugValidation.message}
            </p>
          )}
          <p className="text-sm text-zinc-500">
            This will be your unique profile URL. Only letters, numbers, and hyphens are allowed.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Important Information</h4>
            <p className="text-sm text-red-800">
              This information will be displayed on your public agent profile. Make sure all details are accurate and professional. 
              You can update these details later from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}