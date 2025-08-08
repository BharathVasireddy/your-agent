"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ListingType, type PropertyType, type BasePropertyFormData, type PlotData, FACING_DIRECTIONS, PLOT_APPROVALS } from '@/types/property';

interface PlotFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function PlotForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: PlotFormProps) {
  const [plotData, setPlotData] = useState<PlotData>({
    village: '',
    city: '',
    district: '',
    extentSqYds: 0,
    facing: 'East',
    roadWidth: 0,
    openSides: 0,
    approval: 'HMDA',
    layoutName: ''
  });

  const updatePlotData = (updates: Partial<PlotData>) => {
    setPlotData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (baseData: BasePropertyFormData) => {
    const completeData: BasePropertyFormData = {
      ...baseData,
      plotData
    };
    onSubmit(completeData);
  };

  const generatePlotTitle = async (): Promise<string> => {
    const parts: string[] = [];
    if (plotData.layoutName) parts.push(plotData.layoutName);
    parts.push('Plot');
    if (plotData.extentSqYds > 0) parts.push(`${plotData.extentSqYds} Sq. Yds`);
    if (plotData.city) parts.push(plotData.city);
    return parts.join(' - ');
  };

  const generatePlotDescription = async (): Promise<string> => {
    const facingText = plotData.facing ? `${plotData.facing} facing` : '';
    const roadText = plotData.roadWidth ? `, ${plotData.roadWidth} ft road` : '';
    const approvalText = plotData.approval ? `, ${plotData.approval} approved` : '';
    const locationText = [plotData.village, plotData.city, plotData.district].filter(Boolean).join(', ');
    const layoutText = plotData.layoutName ? ` in ${plotData.layoutName}` : '';
    return `Premium residential/commercial plot${layoutText} measuring ${plotData.extentSqYds} Sq. Yds, ${facingText}${roadText}${approvalText}. Located at ${locationText}. Ideal for immediate construction and great investment potential.`;
  };

  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      customTitleGenerator={generatePlotTitle}
      customDescriptionGenerator={generatePlotDescription}
    >
      {/* Location Details */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Location Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              value={plotData.village}
              onChange={(e) => updatePlotData({ village: e.target.value })}
              placeholder="e.g., Narsingi"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={plotData.city}
              onChange={(e) => updatePlotData({ city: e.target.value })}
              placeholder="e.g., Hyderabad"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={plotData.district}
              onChange={(e) => updatePlotData({ district: e.target.value })}
              placeholder="e.g., Ranga Reddy"
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Plot Specifications */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Plot Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="extent">Extent (Sq. Yds)</Label>
            <Input
              id="extent"
              type="number"
              value={plotData.extentSqYds === 0 ? '' : plotData.extentSqYds.toString()}
              onChange={(e) => updatePlotData({ extentSqYds: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 200"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div>
            <Label>Facing</Label>
            <Select value={plotData.facing} onValueChange={(value) => updatePlotData({ facing: value as PlotData['facing'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select facing" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FACING_DIRECTIONS).map((dir) => (
                  <SelectItem key={dir} value={dir}>
                    {dir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="roadWidth">Width of road facing (ft)</Label>
            <Input
              id="roadWidth"
              type="number"
              value={plotData.roadWidth === 0 ? '' : plotData.roadWidth.toString()}
              onChange={(e) => updatePlotData({ roadWidth: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 30"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="openSides">Open sides</Label>
            <Input
              id="openSides"
              type="number"
              value={plotData.openSides === 0 ? '' : plotData.openSides.toString()}
              onChange={(e) => updatePlotData({ openSides: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div>
            <Label>Approval</Label>
            <Select value={plotData.approval} onValueChange={(value) => updatePlotData({ approval: value as PlotData['approval'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select approval" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PLOT_APPROVALS).map((appr) => (
                  <SelectItem key={appr} value={appr}>
                    {appr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="layoutName">Layout Name</Label>
            <Input
              id="layoutName"
              value={plotData.layoutName}
              onChange={(e) => updatePlotData({ layoutName: e.target.value })}
              placeholder="e.g., Green Meadows"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </BasePropertyForm>
  );
}