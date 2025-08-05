'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWizardStore } from "@/store/wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Loader2 } from "lucide-react";

export default function Step1_Professional() {
  const { data: session } = useSession();
  const { 
    experience, 
    specialization, 
    licenseNumber, 
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

  const handleInputChange = (field: string, value: string | number) => {
    setData({ [field]: value });
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

  // Comprehensive list of Hyderabad areas organized by zones
  const hyderabadAreas = [
    { label: "Hyderabad", value: "Hyderabad" },
    
    // West Hyderabad (IT Corridor)
    { label: "Madhapur", value: "Madhapur" },
    { label: "Gachibowli", value: "Gachibowli" },
    { label: "Kondapur", value: "Kondapur" },
    { label: "HITEC City", value: "HITEC City" },
    { label: "Financial District", value: "Financial District" },
    { label: "Kokapet", value: "Kokapet" },
    { label: "Nanakramguda", value: "Nanakramguda" },
    { label: "Manikonda", value: "Manikonda" },
    { label: "Miyapur", value: "Miyapur" },
    { label: "Kukatpally", value: "Kukatpally" },
    { label: "Chanda Nagar", value: "Chanda Nagar" },
    { label: "Bachupally", value: "Bachupally" },
    { label: "Madinaguda", value: "Madinaguda" },
    { label: "Hafeezpet", value: "Hafeezpet" },
    { label: "Pragathi Nagar", value: "Pragathi Nagar" },
    
    // Central Hyderabad
    { label: "Banjara Hills", value: "Banjara Hills" },
    { label: "Jubilee Hills", value: "Jubilee Hills" },
    { label: "Road No. 36 (Jubilee Hills)", value: "Road No. 36 (Jubilee Hills)" },
    { label: "Filmnagar", value: "Filmnagar" },
    { label: "Punjagutta", value: "Punjagutta" },
    { label: "Ameerpet", value: "Ameerpet" },
    { label: "Somajiguda", value: "Somajiguda" },
    { label: "Begumpet", value: "Begumpet" },
    { label: "Lakdi Ka Pul", value: "Lakdi Ka Pul" },
    { label: "Panjagutta", value: "Panjagutta" },
    { label: "Erragadda", value: "Erragadda" },
    
    // East Hyderabad
    { label: "Secunderabad", value: "Secunderabad" },
    { label: "Himayath Nagar", value: "Himayath Nagar" },
    { label: "Tarnaka", value: "Tarnaka" },
    { label: "Uppal", value: "Uppal" },
    { label: "Boduppal", value: "Boduppal" },
    { label: "Nagole", value: "Nagole" },
    { label: "LB Nagar", value: "LB Nagar" },
    { label: "Dilsukhnagar", value: "Dilsukhnagar" },
    { label: "Vanasthalipuram", value: "Vanasthalipuram" },
    { label: "Kompally", value: "Kompally" },
    { label: "Alwal", value: "Alwal" },
    { label: "Trimulgherry", value: "Trimulgherry" },
    
    // South Hyderabad
    { label: "Tolichowki", value: "Tolichowki" },
    { label: "Shaikpet", value: "Shaikpet" },
    { label: "Golconda", value: "Golconda" },
    { label: "Langar Houz", value: "Langar Houz" },
    { label: "Rajendranagar", value: "Rajendranagar" },
    { label: "Narsingi", value: "Narsingi" },
    { label: "Gandipet", value: "Gandipet" },
    { label: "Attapur", value: "Attapur" },
    { label: "Mehdipatnam", value: "Mehdipatnam" },
    
    // Old City
    { label: "Charminar", value: "Charminar" },
    { label: "Laad Bazaar", value: "Laad Bazaar" },
    { label: "Abids", value: "Abids" },
    { label: "Sultan Bazaar", value: "Sultan Bazaar" },
    { label: "Koti", value: "Koti" },
    { label: "Mallepally", value: "Mallepally" },
    { label: "Falaknuma", value: "Falaknuma" },
    { label: "Santosh Nagar", value: "Santosh Nagar" },
    
    // North Hyderabad
    { label: "Nizampet", value: "Nizampet" },
    { label: "Quthbullapur", value: "Quthbullapur" },
    { label: "Jeedimetla", value: "Jeedimetla" },
    { label: "Bollaram", value: "Bollaram" },
    { label: "Patancheru", value: "Patancheru" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">
          Professional Information
        </h2>
        <p className="text-zinc-600">
          Tell us about your experience and specialization in real estate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City/Area */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-zinc-600">Primary Area in Hyderabad</Label>
          <Select value={city} onValueChange={(value) => handleInputChange('city', value)}>
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
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-zinc-600">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="e.g., +91 98765 43210"
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-zinc-600">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            value={experience}
            onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
            placeholder="e.g., 5"
            min="0"
            max="50"
          />
        </div>

        {/* Specialization */}
        <div className="space-y-2">
          <Label htmlFor="specialization" className="text-zinc-600">Specialization</Label>
          <Select value={specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="e.g., Residential Sales" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="Residential Sales">Residential Sales</SelectItem>
              <SelectItem value="Commercial Sales">Commercial Sales</SelectItem>
              <SelectItem value="Residential Lease">Residential Lease</SelectItem>
              <SelectItem value="Commercial Lease">Commercial Lease</SelectItem>
              <SelectItem value="Property Management">Property Management</SelectItem>
              <SelectItem value="Investment Properties">Investment Properties</SelectItem>
              <SelectItem value="Luxury Properties">Luxury Properties</SelectItem>
              <SelectItem value="New Construction">New Construction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* License Number */}
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="text-zinc-600">RERA License Number (Optional)</Label>
          <Input
            id="licenseNumber"
            type="text"
            value={licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            placeholder="e.g., RE123456789"
          />
        </div>

        {/* Custom Profile URL */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-zinc-600">Your Profile URL</Label>
          <div className="relative">
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-zinc-500 bg-zinc-50 border border-r-0 border-zinc-300 rounded-l-md">
                youragent.in/
              </span>
              <Input
                id="slug"
                type="text"
                value={slug}
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
          <p className="text-xs text-zinc-500">
            This will be your unique profile URL. Only letters, numbers, and hyphens are allowed.
          </p>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>Tip:</strong> This information will be displayed on your public agent profile. 
          Make sure all details are accurate and professional.
        </p>
      </div>
    </div>
  );
}