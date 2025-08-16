'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface State {
  id: string;
  name: string;
  code: string;
}

interface District {
  id: string;
  name: string;
  stateId: string;
}

interface City {
  id: string;
  name: string;
  districtId: string;
  pincode?: string;
}

interface LocationSelectorProps {
  stateId?: string;
  districtId?: string;
  cityId?: string;
  onStateChange?: (stateId: string) => void;
  onDistrictChange?: (districtId: string) => void;
  onCityChange?: (cityId: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function LocationSelector({
  stateId,
  districtId,
  cityId,
  onStateChange,
  onDistrictChange,
  onCityChange,
  required = false,
  disabled = false,
  className = '',
}: LocationSelectorProps) {
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    cities: false,
  });

  // Load states on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoading(prev => ({ ...prev, states: true }));
      try {
        const res = await fetch('/api/locations');
        if (res.ok) {
          const { states } = await res.json();
          setStates(states);
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };

    fetchStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (!stateId) {
      setDistricts([]);
      setCities([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoading(prev => ({ ...prev, districts: true }));
      try {
        const res = await fetch(`/api/locations?stateId=${stateId}`);
        if (res.ok) {
          const { districts } = await res.json();
          setDistricts(districts);
          setCities([]); // Clear cities when state changes
        }
      } catch (error) {
        console.error('Failed to fetch districts:', error);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [stateId]);

  // Load cities when district changes
  useEffect(() => {
    if (!districtId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(prev => ({ ...prev, cities: true }));
      try {
        const res = await fetch(`/api/locations?districtId=${districtId}`);
        if (res.ok) {
          const { cities } = await res.json();
          setCities(cities);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [districtId]);

  const handleStateChange = (value: string) => {
    onStateChange?.(value);
    // Clear dependent selections
    onDistrictChange?.('');
    onCityChange?.('');
  };

  const handleDistrictChange = (value: string) => {
    onDistrictChange?.(value);
    // Clear dependent selections
    onCityChange?.('');
  };

  const handleCityChange = (value: string) => {
    onCityChange?.(value);
  };

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* State Selection */}
      <div className="space-y-2">
        <Label htmlFor="state-select" className="text-sm font-medium text-zinc-700 block">
          State {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={stateId || ''} 
          onValueChange={handleStateChange}
          disabled={disabled || loading.states}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder={loading.states ? "Loading states..." : "Select state"} />
          </SelectTrigger>
          <SelectContent className="max-h-72 overflow-auto">
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name} ({state.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District Selection */}
      <div className="space-y-2">
        <Label htmlFor="district-select" className="text-sm font-medium text-zinc-700 block">
          District {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={districtId || ''} 
          onValueChange={handleDistrictChange}
          disabled={disabled || loading.districts || !stateId}
        >
          <SelectTrigger className="h-11">
            <SelectValue 
              placeholder={
                !stateId ? "Select state first" :
                loading.districts ? "Loading districts..." : 
                "Select district"
              } 
            />
          </SelectTrigger>
          <SelectContent className="max-h-72 overflow-auto">
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selection */}
      <div className="space-y-2">
        <Label htmlFor="city-select" className="text-sm font-medium text-zinc-700 block">
          City/Area {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={cityId || ''} 
          onValueChange={handleCityChange}
          disabled={disabled || loading.cities || !districtId}
        >
          <SelectTrigger className="h-11">
            <SelectValue 
              placeholder={
                !districtId ? "Select district first" :
                loading.cities ? "Loading cities..." : 
                "Select city/area"
              } 
            />
          </SelectTrigger>
          <SelectContent className="max-h-72 overflow-auto">
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
                {city.pincode && ` (${city.pincode})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
