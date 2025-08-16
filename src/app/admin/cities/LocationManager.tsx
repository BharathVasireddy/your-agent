'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Plus, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Flag,
  Map,
  // Settings,
  ToggleLeft,
  ToggleRight,
  // ChevronDown,
  // ChevronUp
} from 'lucide-react';
// import { cn } from '@/lib/utils';

interface State {
  id: string;
  name: string;
  code: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  districts: District[];
  _count: {
    agents: number;
    districts: number;
  };
}

interface District {
  id: string;
  name: string;
  stateId: string;
  isActive: boolean;
  createdAt: string;
  state?: State;
  cities: City[];
  _count: {
    agents: number;
    cities: number;
  };
}

interface City {
  id: string;
  name: string;
  districtId?: string;
  pincode?: string;
  isActive: boolean;
  createdAt: string;
  district?: {
    id: string;
    name: string;
    state: State;
  };
  _count: {
    agents: number;
  };
}

interface LocationManagerProps {
  initialData: {
    states: State[];
    districts: District[];
    cities: City[];
  };
}

export default function LocationManager({ initialData }: LocationManagerProps) {
  const [states, setStates] = useState<State[]>(initialData.states);
  const [districts, setDistricts] = useState<District[]>(initialData.districts);
  const [cities, setCities] = useState<City[]>(initialData.cities);
  const [loading, setLoading] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [stateInView, setStateInView] = useState<State | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [filterStateId, setFilterStateId] = useState<string>('ALL');
  const [filterDistrictId, setFilterDistrictId] = useState<string>('ALL');

  // Form states
  const [newDistrict, setNewDistrict] = useState({ name: '', stateId: '' });
  const [newCity, setNewCity] = useState({ name: '', stateId: '', districtId: '', pincode: '' });
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const toggleStateActive = async (stateId: string, isActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/states', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: stateId, isActive }),
      });

      if (res.ok) {
        await res.json();
        setStates(states.map(s => s.id === stateId ? { ...s, isActive } : s));
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to update state');
      }
    } catch {
      alert('Failed to update state');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDistrict = async () => {
    if (!newDistrict.name || !newDistrict.stateId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/districts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDistrict),
      });

      if (res.ok) {
        const { district } = await res.json();
        setDistricts([...districts, { ...district, cities: [] }]);
        setStates(states.map(state => 
          state.id === newDistrict.stateId 
            ? { 
                ...state, 
                districts: [...state.districts, district],
                _count: { ...state._count, districts: state._count.districts + 1 }
              }
            : state
        ));
        setNewDistrict({ name: '', stateId: '' });
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to create district');
      }
    } catch {
      alert('Failed to create district');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDistrict = async (
    id: string,
    data: Partial<Pick<District, 'name' | 'isActive'>>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/districts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { district } = await res.json();
        setDistricts(districts.map(d => d.id === id ? district : d));
        setEditingDistrict(null);
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to update district');
      }
    } catch {
      alert('Failed to update district');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDistrict = async (id: string) => {
    if (!confirm('Are you sure you want to delete this district?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/districts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDistricts(districts.filter(d => d.id !== id));
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to delete district');
      }
    } catch {
      alert('Failed to delete district');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async () => {
    if (!newCity.name || !newCity.districtId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCity),
      });

      if (res.ok) {
        const { city } = await res.json();
        setCities([...cities, city]);
        setDistricts(districts.map(district => 
          district.id === newCity.districtId 
            ? { 
                ...district, 
                cities: [...district.cities, city],
                _count: { ...district._count, cities: district._count.cities + 1 }
              }
            : district
        ));
        setNewCity({ name: '', stateId: '', districtId: '', pincode: '' });
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

  const handleUpdateCity = async (
    id: string,
    data: Partial<{ name: string; pincode?: string | null; isActive: boolean }>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { city } = await res.json();
        setCities(cities.map(c => c.id === id ? city : c));
        setEditingCity(null);
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to update city');
      }
    } catch {
      alert('Failed to update city');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cities/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCities(cities.filter(c => c.id !== id));
      } else {
        const { error } = await res.json();
        alert(error || 'Failed to delete city');
      }
    } catch {
      alert('Failed to delete city');
    } finally {
      setLoading(false);
    }
  };

  const getStateDistricts = (stateId: string) => {
    return districts.filter(d => d.stateId === stateId);
  };

  // const getDistrictCities = (districtId: string) => {
  //   return cities.filter(c => c.districtId === districtId);
  // };

  const filteredCities = cities.filter((c) => {
    const nameMatch = !citySearch || c.name.toLowerCase().includes(citySearch.toLowerCase());
    const stateMatch = filterStateId === 'ALL' || c.district?.state?.id === filterStateId || districts.find(d=>d.id===c.districtId)?.stateId === filterStateId;
    const districtMatch = filterDistrictId === 'ALL' || c.districtId === filterDistrictId;
    return nameMatch && stateMatch && districtMatch;
  });

  return (
    <div className="space-y-6">
      {/* States Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            Indian States ({states.filter(s => s.isActive).length} active / {states.length} total)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enable states where you want to provide services. All Indian states are pre-loaded.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="states-list">
              <AccordionTrigger className="px-3">
                <div className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2"><Flag className="w-4 h-4 text-primary" />States</span>
                  <span className="text-sm text-muted-foreground">{states.filter(s=>s.isActive).length} active / {states.length} total</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="mb-3 flex items-center gap-2">
                  <Input
                    placeholder="Search state by name or code..."
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button
                    variant={showActiveOnly ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowActiveOnly(!showActiveOnly)}
                  >
                    {showActiveOnly ? 'Showing Active Only' : 'Show Active Only'}
                  </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {states
                    .filter((s) => (!showActiveOnly || s.isActive))
                    .filter((s) =>
                      !stateSearch
                        ? true
                        : s.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
                          s.code.toLowerCase().includes(stateSearch.toLowerCase())
                    )
                    .map((state) => (
                      <AccordionItem key={state.id} value={state.id} className={state.isActive ? "bg-primary/5 rounded-md mb-2" : "mb-2 rounded-md"}>
                        <AccordionTrigger className="px-3">
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Flag className="w-4 h-4 text-primary" />
                              <span className="font-medium">{state.name}</span>
                              <Badge variant="outline">{state.code}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{state._count.districts} districts</Badge>
                              <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{state._count.agents}</Badge>
                              <Badge variant={state.isActive ? 'default' : 'destructive'}>
                                {state.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStateActive(state.id, !state.isActive)}
                              disabled={loading}
                              className="h-8 px-2"
                            >
                              {state.isActive ? (
                                <><ToggleRight className="w-4 h-4 text-green-600 mr-1" /> Disable</>
                              ) : (
                                <><ToggleLeft className="w-4 h-4 text-gray-400 mr-1" /> Enable</>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setStateInView(state); setNewDistrict({ name: '', stateId: state.id }); }}
                            >
                              View Districts
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Districts Modal */}
      {stateInView && (
        <Dialog open={!!stateInView} onOpenChange={() => setStateInView(null)}>
          <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Districts in {stateInView.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="w-full max-w-sm">
                  <Label htmlFor="modal-district-name">Add District</Label>
                  <Input id="modal-district-name" placeholder="District name" value={newDistrict.name} onChange={(e)=>setNewDistrict({ ...newDistrict, name: e.target.value, stateId: stateInView.id })} />
                </div>
                <Button onClick={handleAddDistrict} disabled={loading || !newDistrict.name}>
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getStateDistricts(stateInView.id).map((district) => (
                  <div key={district.id} className="rounded border p-3 bg-card flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Map className="w-3 h-3" />
                        <span className="font-medium truncate">{district.name}</span>
                      </div>
                      <Badge variant={district.isActive ? 'default' : 'secondary'} className="text-xs">
                        {district.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{district._count.cities} cities</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2"
                          onClick={() => handleUpdateDistrict(district.id, { isActive: !district.isActive })}
                        >
                          {district.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2"
                          onClick={() => setEditingDistrict(district)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2"
                          onClick={() => handleDeleteDistrict(district.id)}
                          disabled={district._count.cities > 0 || district._count.agents > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Removed Districts card per request */}
      {/* Add District Section (removed) */}
      

      {/* Add City Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Cities ({cities.length})
            </span>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e)=>setCitySearch(e.target.value)}
                className="w-48"
              />
              <Select value={filterStateId} onValueChange={(v)=>{setFilterStateId(v); setFilterDistrictId('ALL');}}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="ALL">All states</SelectItem>
                  {states.map(s=>(
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDistrictId} onValueChange={(v)=>setFilterDistrictId(v)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by district" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="ALL">All districts</SelectItem>
                  {districts
                    .filter(d=>filterStateId==='ALL' || d.stateId===filterStateId)
                    .map(d=>(
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={districts.filter(d => d.isActive).length === 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add City
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New City/Area</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="city-state">State</Label>
                      <Select value={newCity.stateId} onValueChange={(value) => setNewCity({ ...newCity, stateId: value, districtId: '' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.filter(s => s.isActive).map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name} ({state.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city-district">District</Label>
                      <Select 
                        value={newCity.districtId} 
                        onValueChange={(value) => setNewCity({ ...newCity, districtId: value })}
                        disabled={!newCity.stateId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={newCity.stateId ? "Select district" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-64 overflow-auto">
                          {districts.filter(d => d.isActive && d.stateId === newCity.stateId).map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city-name">City/Area Name</Label>
                      <Input
                        id="city-name"
                        value={newCity.name}
                        onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                        placeholder="Enter city/area name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city-pincode">Pincode (Optional)</Label>
                      <Input
                        id="city-pincode"
                        value={newCity.pincode}
                        onChange={(e) => setNewCity({ ...newCity, pincode: e.target.value })}
                        placeholder="Enter pincode"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleAddCity} 
                        disabled={loading || !newCity.name || !newCity.stateId || !newCity.districtId}
                      >
                        Create City
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City/Area</TableHead>
                <TableHead>District</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Pincode</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{city.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {city.district && (
                      <Badge variant="outline">
                        {city.district.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {city.district?.state && (
                      <Badge variant="secondary">
                        {city.district.state.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {city.pincode && (
                      <Badge variant="outline">
                        {city.pincode}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
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
                        onClick={() => handleUpdateCity(city.id, { isActive: !city.isActive })}
                      >
                        {city.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingCity(city)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCity(city.id)}
                        disabled={city._count.agents > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit District Dialog */}
      {editingDistrict && (
        <Dialog open={!!editingDistrict} onOpenChange={() => setEditingDistrict(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit District</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-district-name">District Name</Label>
                <Input
                  id="edit-district-name"
                  value={editingDistrict.name}
                  onChange={(e) => setEditingDistrict({ ...editingDistrict, name: e.target.value })}
                  placeholder="Enter district name"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleUpdateDistrict(editingDistrict.id, { name: editingDistrict.name })}
                  disabled={loading || !editingDistrict.name}
                >
                  Update District
                </Button>
                <Button variant="outline" onClick={() => setEditingDistrict(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit City Dialog */}
      {editingCity && (
        <Dialog open={!!editingCity} onOpenChange={() => setEditingCity(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit City</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-city-name">City/Area Name</Label>
                <Input
                  id="edit-city-name"
                  value={editingCity.name}
                  onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                  placeholder="Enter city/area name"
                />
              </div>
              <div>
                <Label htmlFor="edit-city-pincode">Pincode</Label>
                <Input
                  id="edit-city-pincode"
                  value={editingCity.pincode || ''}
                  onChange={(e) => setEditingCity({ ...editingCity, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleUpdateCity(editingCity.id, { 
                    name: editingCity.name, 
                    pincode: editingCity.pincode 
                  })}
                  disabled={loading || !editingCity.name}
                >
                  Update City
                </Button>
                <Button variant="outline" onClick={() => setEditingCity(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}