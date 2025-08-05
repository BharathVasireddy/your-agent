'use client';

import { useWizardStore } from "@/store/wizard-store";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Step4_Theme() {
  const { theme, setData } = useWizardStore();

  const themes = [
    {
      value: 'professional-blue',
      name: 'Professional Blue',
      description: 'Clean and trustworthy with blue accents',
      preview: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'dark',
      name: 'Elegant Dark',
      description: 'Sophisticated dark theme with premium feel',
      preview: 'bg-zinc-800',
      textColor: 'text-zinc-800',
      bgColor: 'bg-zinc-50',
      borderColor: 'border-zinc-200'
    },
    {
      value: 'red',
      name: 'Modern Red',
      description: 'Bold and energetic with red accents',
      preview: 'bg-red-600',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const handleThemeChange = (value: string) => {
    setData({ theme: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">
          Choose Your Profile Theme
        </h2>
        <p className="text-zinc-600">
          Select a theme that reflects your professional style and brand.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-zinc-600">Profile Theme</Label>
        
        <RadioGroup value={theme} onValueChange={handleThemeChange} className="space-y-4">
          {themes.map((themeOption) => (
            <div key={themeOption.value} className="flex items-start space-x-3">
              <RadioGroupItem 
                value={themeOption.value} 
                id={themeOption.value}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor={themeOption.value}
                  className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg border-2 transition-all hover:bg-zinc-50"
                  style={{
                    borderColor: theme === themeOption.value ? '#DC2626' : '#E5E7EB',
                    backgroundColor: theme === themeOption.value ? '#FEF2F2' : 'transparent'
                  }}
                >
                  {/* Theme Preview */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-8 rounded ${themeOption.preview} shadow-sm`}></div>
                    <div className={`w-8 h-2 rounded ${themeOption.preview} opacity-60`}></div>
                  </div>
                  
                  {/* Theme Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-900">{themeOption.name}</h3>
                    <p className="text-sm text-zinc-600 mt-1">{themeOption.description}</p>
                  </div>
                  
                  {/* Preview Badge */}
                  <div className={`px-3 py-1 rounded text-xs font-medium ${themeOption.bgColor} ${themeOption.textColor} ${themeOption.borderColor} border`}>
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
          <strong>Tip:</strong> You can change your theme later from your profile settings. 
          Choose one that aligns with your personal brand and the impression you want to make.
        </p>
      </div>
    </div>
  );
}