'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { updateAgentTemplateValue } from '@/app/actions';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Megaphone, Building2, User, MessageSquare, HelpCircle, PhoneCall, Award, Images, Factory } from 'lucide-react';

type VisibilityKey = 'hero' | 'properties' | 'about' | 'awards' | 'gallery' | 'builders' | 'testimonials' | 'faqs' | 'contact';

export interface VisibilitySettings {
  hero?: boolean;
  properties?: boolean;
  about?: boolean;
  awards?: boolean;
  gallery?: boolean;
  builders?: boolean;
  testimonials?: boolean;
  faqs?: boolean;
  contact?: boolean;
}

export default function SectionVisibilityToggles({
  agentSlug,
  initialVisibility,
  counts,
}: {
  agentSlug: string;
  initialVisibility?: VisibilitySettings | null;
  counts?: { awards?: number; gallery?: number; builders?: number; testimonials?: number; faqs?: number };
}) {
  const [visibility, setVisibility] = useState<Required<VisibilitySettings>>({
    hero: initialVisibility?.hero !== false,
    properties: initialVisibility?.properties !== false,
    about: initialVisibility?.about !== false,
    awards: initialVisibility?.awards !== false,
    gallery: initialVisibility?.gallery !== false,
    builders: initialVisibility?.builders !== false,
    testimonials: initialVisibility?.testimonials !== false,
    faqs: initialVisibility?.faqs !== false,
    contact: initialVisibility?.contact !== false,
  });
  const [isPending, startTransition] = useTransition();
  const [pendingMap, setPendingMap] = useState<Record<VisibilityKey, boolean>>({
    hero: false, properties: false, about: false, awards: false, gallery: false, builders: false, testimonials: false, faqs: false, contact: false
  });
  const [pendingAction, setPendingAction] = useState<Record<VisibilityKey, 'enable' | 'disable' | null>>({
    hero: null, properties: null, about: null, awards: null, gallery: null, builders: null, testimonials: null, faqs: null, contact: null
  });
  const [confirmState, setConfirmState] = useState<{
    key: VisibilityKey | null;
    next: boolean;
    open: boolean;
  }>({ key: null, next: false, open: false });

  const items: Array<{
    key: VisibilityKey;
    title: string;
    description: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'hero', title: 'Hero Section', description: 'Top banner with your headline and call-to-action', Icon: Megaphone },
    { key: 'properties', title: 'Properties Section', description: 'Showcase your latest property listings', Icon: Building2 },
    { key: 'about', title: 'About Section', description: 'Introduce yourself and your experience', Icon: User },
    { key: 'awards', title: 'Awards Section', description: 'Show your awards and recognitions', Icon: Award },
    { key: 'gallery', title: 'Gallery Section', description: 'Display your photo gallery', Icon: Images },
    { key: 'builders', title: 'Builders Section', description: 'Logos of builders you have worked with', Icon: Factory },
    { key: 'testimonials', title: 'Testimonials Section', description: 'Display client feedback and reviews', Icon: MessageSquare },
    { key: 'faqs', title: 'FAQs Section', description: 'Answer common questions from clients', Icon: HelpCircle },
    { key: 'contact', title: 'Contact Section', description: 'Show your contact form and details', Icon: PhoneCall },
  ];

  function toggleVisibility(key: VisibilityKey, checked: boolean) {
    // Guard: require content before enabling specific sections
    if (checked) {
      if (key === 'faqs' && (counts?.faqs ?? 0) === 0) {
        setConfirmState({ key: null, next: false, open: true });
        return;
      }
      if (key === 'awards' && (counts?.awards ?? 0) === 0) {
        setConfirmState({ key: null, next: false, open: true });
        return;
      }
      if (key === 'gallery' && (counts?.gallery ?? 0) === 0) {
        setConfirmState({ key: null, next: false, open: true });
        return;
      }
      if (key === 'builders' && (counts?.builders ?? 0) === 0) {
        setConfirmState({ key: null, next: false, open: true });
        return;
      }
      if (key === 'testimonials' && (counts?.testimonials ?? 0) === 0) {
        setConfirmState({ key: null, next: false, open: true });
        return;
      }
    }
    if (!checked) {
      setConfirmState({ key, next: checked, open: true });
      return;
    }
    performToggle(key, checked);
  }

  function performToggle(key: VisibilityKey, checked: boolean) {
    setPendingMap((prev) => ({ ...prev, [key]: true }));
    setPendingAction((prev) => ({ ...prev, [key]: checked ? 'enable' : 'disable' }));
    setVisibility((prev) => ({ ...prev, [key]: checked }));
    startTransition(async () => {
      try {
        await updateAgentTemplateValue(agentSlug, `visibility.${key}`, checked);
      } catch {
        setVisibility((prev) => ({ ...prev, [key]: !checked }));
      } finally {
        setPendingMap((prev) => ({ ...prev, [key]: false }));
        setPendingAction((prev) => ({ ...prev, [key]: null }));
      }
    });
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm h-[480px] overflow-hidden">
      <div className="p-6 border-b border-zinc-200">
        <h2 className="text-xl font-semibold text-zinc-950">Section visibility</h2>
        <p className="text-sm text-zinc-600 mt-1">Turn sections on or off on your public website.</p>
      </div>
      <div className="p-4 md:p-6 h-[calc(480px-96px)] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items.map(({ key, title, description, Icon }) => (
            <div key={key} className="flex items-center justify-between bg-white border border-zinc-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-muted rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="font-medium text-zinc-900">{title}</div>
                  <div className="text-sm text-zinc-600">{description}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Switch
                  checked={visibility[key]}
                  onCheckedChange={(checked) => toggleVisibility(key, checked)}
                  disabled={isPending || pendingMap[key]}
                  aria-busy={pendingMap[key] ? 'true' : 'false'}
                  className="data-[state=checked]:bg-brand"
                />
                {pendingMap[key] && (
                  <span className="text-xs text-zinc-500">
                    {pendingAction[key] === 'enable' ? 'Enabling…' : 'Disabling…'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        title={pendingAction.hero === null && pendingAction.properties === null && pendingAction.about === null ? "Add content to enable" : "Hide this section?"}
        description={(
          <div className="space-y-2">
            {pendingAction.hero === null && pendingAction.properties === null && pendingAction.about === null ? (
              <>
                <p>You need to add content before making this section live for your customers.</p>
                <p className="text-zinc-600">Add items in the respective manager (e.g., add FAQs) and then enable.</p>
              </>
            ) : (
              <>
                <p>Turning off a section can negatively impact your SEO and hide important content that helps visitors convert.</p>
                <p className="text-zinc-600">You can re-enable it any time.</p>
              </>
            )}
          </div>
        )}
        confirmLabel={pendingAction.hero === null && pendingAction.properties === null && pendingAction.about === null ? "OK" : "Disable section"}
        cancelLabel={pendingAction.hero === null && pendingAction.properties === null && pendingAction.about === null ? undefined : "Keep section"}
        destructive={!(pendingAction.hero === null && pendingAction.properties === null && pendingAction.about === null)}
        onCancel={() => setConfirmState({ key: null, next: false, open: false })}
        onConfirm={() => {
          if (confirmState.key) {
            performToggle(confirmState.key, confirmState.next);
          }
          setConfirmState({ key: null, next: false, open: false });
        }}
      />
    </div>
  );
}


