'use server';

import { trackLead } from '@/lib/analytics';

export async function recordLead({
  agentId,
  type,
  propertyId,
  source,
}: {
  agentId: string;
  type: 'CALL' | 'WHATSAPP' | 'FORM' | 'EMAIL';
  propertyId?: string;
  source?: string;
}) {
  await trackLead({
    agentId,
    type,
    propertyId,
    source,
  });
}