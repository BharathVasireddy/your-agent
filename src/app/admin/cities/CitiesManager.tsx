'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  MapPin, 
  Building2, 
  Users, 
  // Edit, 
  // Trash2, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
// import { cn } from '@/lib/utils';

interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  areas: Area[];
  _count: {
    agents: number;
    areas: number;
  };
}

interface Area {
  id: string;
  name: string;
  pincode?: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    agents: number;
  };
}

interface CitiesManagerProps {
  initialCities: City[];
}

export default function CitiesManager({ initialCities }: CitiesManagerProps) {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [isAddingArea, setIsAddingArea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [newCity, setNewCity] = useState({
    name: '',
    state: '',
    country: 'India',
  });

  const [newArea, setNewArea] = useState({
    name: '',
    pincode: '',
    cityId: '',
  });

  const toggleCityExpansion = (cityId: string) => {
    const newExpanded = new Set(expandedCities);
    if (newExpanded.has(cityId)) {
      newExpanded.delete(cityId);
    } else {
      newExpanded.add(cityId);
    }
    setExpandedCities(newExpanded);
  };

  const handleAddCity = async () => {
    if (!newCity.name || !newCity.state) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCity),
      });

      if (res.ok) {
        const { city } = await res.json();
        setCities([...cities, { ...city, areas: [] }]);
        setNewCity({ name: '', state: '', country: 'India' });
        setIsAddingCity(false);
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to create city');
      }
    } catch {
      alert('Failed to create city');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArea = async () => {
    if (!newArea.name || !newArea.cityId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArea),
      });

      if (res.ok) {
        const { area } = await res.json();
        setCities(cities.map(city => 
          city.id === newArea.cityId 
            ? { 
                ...city, 
                areas: [...city.areas, area],
                _count: { ...city._count, areas: city._count.areas + 1 }
              }
            : city
        ));
        setNewArea({ name: '', pincode: '', cityId: '' });
        setIsAddingArea(null);
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to create area');
      }
    } catch {
      alert('Failed to create area');
    } finally {
      setLoading(false);
    }
  };

  const toggleCityStatus = async (cityId: string, isActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cities/${cityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        const { city } = await res.json();
        setCities(cities.map(c => c.id === cityId ? { ...c, isActive: city.isActive } : c));
      } else {
        alert('Failed to update city status');
      }
    } catch {
      alert('Failed to update city status');
    } finally {
      setLoading(false);
    }
  };

  const toggleAreaStatus = async (areaId: string, cityId: string, isActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/areas/${areaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        const { area } = await res.json();
        setCities(cities.map(city => 
          city.id === cityId 
            ? {
                ...city,
                areas: city.areas.map(a => a.id === areaId ? { ...a, isActive: area.isActive } : a)
              }
            : city
        ));
      } else {
        alert('Failed to update area status');
      }
    } catch {
      alert('Failed to update area status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add City Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Cities Management
            </span>
            <Button 
              onClick={() => setIsAddingCity(!isAddingCity)}
              variant={isAddingCity ? "outline" : "default"}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add City
            </Button>
          </CardTitle>
        </CardHeader>
        {isAddingCity && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city-name">City Name</Label>
                <Input
                  id="city-name"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  placeholder="Enter city name"
                />
              </div>
              <div>
                <Label htmlFor="city-state">State</Label>
                <Input
                  id="city-state"
                  value={newCity.state}
                  onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="city-country">Country</Label>
                <Input
                  id="city-country"
                  value={newCity.country}
                  onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleAddCity} 
                disabled={loading || !newCity.name || !newCity.state}
              >
                Create City
              </Button>
              <Button variant="outline" onClick={() => setIsAddingCity(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Cities List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Areas</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city) => (
                <>
                  <TableRow key={city.id} className="group">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCityExpansion(city.id)}
                        className="p-1"
                      >
                        {expandedCities.has(city.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">{city.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{city.state}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {city._count.areas} areas
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        {city._count.agents}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={city.isActive ? "default" : "destructive"}>
                        {city.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCityStatus(city.id, city.isActive)}
                          disabled={loading}
                        >
                          {city.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewArea({ ...newArea, cityId: city.id });
                            setIsAddingArea(city.id);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Areas */}
                  {expandedCities.has(city.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div className="bg-muted/20 p-4">
                          {isAddingArea === city.id && (
                            <div className="mb-4 p-4 bg-background rounded border">
                              <h4 className="font-medium mb-3">Add Area to {city.name}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="area-name">Area Name</Label>
                                  <Input
                                    id="area-name"
                                    value={newArea.name}
                                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                                    placeholder="Enter area name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="area-pincode">Pincode (Optional)</Label>
                                  <Input
                                    id="area-pincode"
                                    value={newArea.pincode}
                                    onChange={(e) => setNewArea({ ...newArea, pincode: e.target.value })}
                                    placeholder="Enter pincode"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  onClick={handleAddArea} 
                                  disabled={loading || !newArea.name}
                                  size="sm"
                                >
                                  Create Area
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setIsAddingArea(null);
                                    setNewArea({ name: '', pincode: '', cityId: '' });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Areas in {city.name}</h4>
                            {city.areas.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No areas added yet</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {city.areas.map((area) => (
                                  <div
                                    key={area.id}
                                    className="flex items-center justify-between p-3 bg-background rounded border"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Building2 className="w-4 h-4 text-muted-foreground" />
                                      <div>
                                        <div className="font-medium text-sm">{area.name}</div>
                                        {area.pincode && (
                                          <div className="text-xs text-muted-foreground">
                                            PIN: {area.pincode}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {area._count.agents}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleAreaStatus(area.id, city.id, area.isActive)}
                                        disabled={loading}
                                        className="p-1 h-6 w-6"
                                      >
                                        {area.isActive ? (
                                          <Eye className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <EyeOff className="w-3 h-3 text-red-600" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
