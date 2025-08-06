'use client';

import { useWizardStore } from "@/store/wizard-store";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Step4_Theme() {
  const { template, setData } = useWizardStore();

  const templates = [
    {
      value: 'classic-professional',
      name: 'Classic Professional',
      description: 'Traditional and trustworthy with blue accents',
      preview: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'fresh-minimal',
      name: 'Fresh Minimal',
      description: 'Light, airy design with green accents and minimal aesthetic',
      preview: 'bg-green-600',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'modern-minimal',
      name: 'Modern Minimal',
      description: 'Clean and contemporary with emphasis on whitespace',
      preview: 'bg-zinc-800',
      textColor: 'text-zinc-800',
      bgColor: 'bg-zinc-50',
      borderColor: 'border-zinc-200'
    },
    {
      value: 'bold-red',
      name: 'Bold Red',
      description: 'Energetic and attention-grabbing with red accents',
      preview: 'bg-red-600',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      value: 'black-white',
      name: 'Black & White',
      description: 'Clean monochrome with full-width header and rounded buttons',
      preview: 'bg-black',
      textColor: 'text-black',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  const handleTemplateChange = (value: string) => {
    setData({ template: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">
          Choose Your Profile Template
        </h2>
        <p className="text-zinc-600">
          Select a template that reflects your professional style and brand.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-zinc-600">Profile Template</Label>
        
        <RadioGroup value={template} onValueChange={handleTemplateChange} className="space-y-4">
          {templates.map((templateOption) => (
            <div key={templateOption.value} className="flex items-start space-x-3">
              <RadioGroupItem 
                value={templateOption.value} 
                id={templateOption.value}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor={templateOption.value}
                  className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg border-2 transition-all hover:bg-zinc-50"
                  style={{
                    borderColor: template === templateOption.value ? '#DC2626' : '#E5E7EB',
                    backgroundColor: template === templateOption.value ? '#FEF2F2' : 'transparent'
                  }}
                >
                  {/* Template Preview */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-8 rounded ${templateOption.preview} shadow-sm`}></div>
                    <div className={`w-8 h-2 rounded ${templateOption.preview} opacity-60`}></div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-900">{templateOption.name}</h3>
                    <p className="text-sm text-zinc-600 mt-1">{templateOption.description}</p>
                  </div>
                  
                  {/* Preview Badge */}
                  <div className={`px-3 py-1 rounded text-xs font-medium ${templateOption.bgColor} ${templateOption.textColor} ${templateOption.borderColor} border`}>
                    Preview
                  </div>
                </label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>Tip:</strong> You can change your template later from your profile settings. 
          Choose one that aligns with your personal brand and the impression you want to make.
        </p>
      </div>
    </div>
  );
}