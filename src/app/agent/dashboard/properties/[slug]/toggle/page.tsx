import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ToggleDealVisibilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  if (!(session as unknown as { user?: unknown } | null)?.user) {
    redirect('/login');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  const agent = await prisma.agent.findUnique({ where: { userId } });
  if (!agent) redirect('/agent/dashboard/properties?error=agent-not-found');

  const property = await prisma.property.findFirst({ where: { slug, agentId: agent.id } });
  if (!property) redirect('/agent/dashboard/properties?error=property-not-found');
  if (!property.sourceDealId) redirect('/agent/dashboard/properties?error=not-a-deal-property');

  await prisma.property.update({ where: { id: property.id }, data: { isHiddenByAgent: !property.isHiddenByAgent } });

  redirect('/agent/dashboard/properties?notice=visibility-updated');
}


