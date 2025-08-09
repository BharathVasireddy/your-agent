'use client';

import { useWizardStore } from "@/store/wizard-store";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Step4_Theme() {
  const { template, setData } = useWizardStore();

  const templates = [
    {
      value: 'legacy-pro',
      name: 'Legacy Pro',
      description: 'Solid, professional layout with proven UX',
      preview: 'bg-zinc-900',
      textColor: 'text-zinc-900',
      bgColor: 'bg-zinc-50',
      borderColor: 'border-zinc-200'
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
      value: 'mono-modern',
      name: 'Mono Modern',
      description: 'Monochrome, editorial layout with strong typography',
      preview: 'bg-zinc-800',
      textColor: 'text-zinc-900',
      bgColor: 'bg-zinc-50',
      borderColor: 'border-zinc-200'
    },
    {
      value: 'mono-elite',
      name: 'Mono Elite',
      description: 'Premium monochrome design with grid pattern and motion reveals',
      preview: 'bg-zinc-700',
      textColor: 'text-zinc-900',
      bgColor: 'bg-zinc-50',
      borderColor: 'border-zinc-200'
    },

  ];

  const handleTemplateChange = (value: string) => {
    setData({ template: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Choose Your Profile Template</h2>
        <p className="text-zinc-600">Select a template that reflects your professional style.</p>
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
                  
                  {/* Live Preview Link */}
                  <a
                    href={`/preview?template=${templateOption.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1 rounded text-xs font-medium ${templateOption.bgColor} ${templateOption.textColor} ${templateOption.borderColor} border hover:opacity-90 transition`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Preview
                  </a>
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