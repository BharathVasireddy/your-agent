// Guard template choices based on plan (Starter: single template)
"use client";
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { useWizardStore } from '@/store/wizard-store';

export default function Step4_Theme() {
  const { template, setData } = useWizardStore();
  const [plan, setPlan] = useState<'starter'|'growth'|'pro'>('starter');
  const [templates, setTemplates] = useState<Array<{ value: string; name: string; description: string; preview: string; bgColor: string; textColor: string; borderColor: string }>>([
    { value: 'fresh-minimal', name: 'Fresh Minimal', description: 'Clean and simple', preview: 'bg-zinc-200', bgColor: 'bg-zinc-50', textColor: 'text-zinc-700', borderColor: 'border-zinc-200' },
    { value: 'mono-elite', name: 'Mono Elite', description: 'Bold and modern', preview: 'bg-zinc-300', bgColor: 'bg-zinc-50', textColor: 'text-zinc-700', borderColor: 'border-zinc-200' },
  ]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/subscription/entitlements')
      .then(r => r.json())
      .then((d) => {
        if (!mounted) return;
        setPlan(d.plan);
        if (d.plan === 'starter') {
          // restrict to single template
          setTemplates((prev) => prev.filter(t => t.value === 'fresh-minimal'));
          if (template !== 'fresh-minimal') setData({ template: 'fresh-minimal' });
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [setData, template]);

  const handleTemplateChange = (value: string) => {
    setData({ template: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-950 mb-2">Choose Your Profile Template</h2>
        <p className="text-zinc-600">Select a template that reflects your professional style.</p>
      </div>
      <div>
        <Label className="text-zinc-600">Profile Template</Label>
        <RadioGroup value={template} onValueChange={handleTemplateChange} className="space-y-4">
          {templates.map((templateOption) => (
            <div key={templateOption.value} className="flex items-start space-x-3">
              <RadioGroupItem value={templateOption.value} id={templateOption.value} />
              <Label htmlFor={templateOption.value} className="cursor-pointer flex-1">
                <div className="border-2 rounded-lg p-4" style={{ borderColor: template === templateOption.value ? '#DC2626' : '#E5E7EB', backgroundColor: template === templateOption.value ? '#FEF2F2' : 'transparent' }}>
                  {/* Template Preview */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-8 rounded ${templateOption.preview} shadow-sm`}></div>
                    <div className={`w-8 h-2 rounded ${templateOption.preview} opacity-60`}></div>
                  </div>
                  {/* Template Info */}
                  <div className="mt-2">
                    <h3 className="font-medium text-zinc-900">{templateOption.name}</h3>
                    <p className="text-sm text-zinc-600 mt-1">{templateOption.description}</p>
                  </div>
                  <div className="mt-3">
                    <Link href={`/preview?template=${templateOption.value}`} className={`px-3 py-1 rounded text-xs font-medium ${templateOption.bgColor} ${templateOption.textColor} ${templateOption.borderColor} border hover:opacity-90 transition`}>Preview</Link>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      {plan === 'starter' && (
        <p className="text-xs text-zinc-600">Starter plan: You can use one template. Upgrade to Growth/Pro to unlock all templates.</p>
      )}
      <div className="text-xs text-zinc-600">
        <strong>Tip:</strong> You can change your template later from your profile settings.
      </div>
    </div>
  );
}


