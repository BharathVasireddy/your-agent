'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWizardStore } from "@/store/wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Loader2, MapPin, Phone, Link2, AlertCircle } from "lucide-react";
import PhoneWhatsAppVerify from '@/components/PhoneWhatsAppVerify';

export default function Step1_Professional() {
  const { data: session } = useSession();
  const { 
    experience, 
    city, 
    phone, 
    slug,
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
  };

  // Phone validation function
  const validatePhone = (phoneNumber: string) => {
    // Enforce strict E.164 for India: +91XXXXXXXXXX and first digit 6-9
    if (!phoneNumber || !/^\+91[6-9]\d{9}$/.test(phoneNumber)) {
      setPhoneValidation({ isValid: false, message: 'Enter a valid 10-digit Indian number (e.g., +919876543210)' });
      return;
    }
    setPhoneValidation({ isValid: true, message: 'Valid phone number' });
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

  // Cities data - this would ideally come from an API managed by admin
  const availableCities = ['Hyderabad', 'Bangalore', 'Mumbai'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section with Better Typography */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-light rounded-full mb-4">
          <MapPin className="w-8 h-8 text-brand" />
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
            <div className="p-2 bg-brand-light rounded-lg">
              <MapPin className="w-5 h-5 text-brand" />
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


          </div>
        </div>

        {/* Contact & Experience Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-light rounded-lg">
              <Phone className="w-5 h-5 text-brand" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950">Contact & Experience</h3>
          </div>
          
          <div className="space-y-4">
             {/* Phone Number with Validation - fixed +91 prefix, no overlap */}
            <PhoneWhatsAppVerify
              label="Phone Number"
              value={phone}
              onValueChange={(e164) => handleInputChange('phone', e164)}
              onVerified={(e164) => {
                handleInputChange('phone', e164);
                setPhoneValidation({ isValid: true, message: 'Verified phone number' });
              }}
              required
            />



            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-zinc-700">Years of Experience *</Label>
              <div className="relative">
                <Input
                  id="experience"
                  type="number"
                  value={experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  placeholder="5"
                  min="0"
                  max="50"
                  className="h-11"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile URL Card - Full Width */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-light rounded-lg">
            <Link2 className="w-5 h-5 text-brand" />
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
                  <X className="w-5 h-5 text-brand" />
                ) : null}
              </div>
            </div>
          </div>
          {/* Validation Message */}
          {slugValidation.message && (
            <p className={`text-sm ${
              slugValidation.available 
                ? 'text-green-600' 
                : 'text-brand'
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
      <div className="bg-gradient-to-r from-brand-light to-orange-50 border border-brand-soft rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-light rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h4 className="font-semibold text-brand-deep mb-1">Important Information</h4>
            <p className="text-sm text-brand-deep">
              This information will be displayed on your public agent profile. Make sure all details are accurate and professional. 
              You can update these details later from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}