import { requireAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';
import ModerationTable from './ModerationTable';
import PendingQueue from './PendingQueue';

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const [awards, images, builders, pending] = await Promise.all([
    prisma.agentAward.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { agent: { select: { id: true, slug: true, user: { select: { name: true, email: true } } } } } }),
    prisma.agentGalleryImage.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { agent: { select: { id: true, slug: true, user: { select: { name: true, email: true } } } } } }),
    prisma.agentBuilder.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { agent: { select: { id: true, slug: true, user: { select: { name: true, email: true } } } } } }),
    prisma.moderationItem.findMany({ where: { status: 'pending' }, orderBy: { createdAt: 'desc' }, take: 200, include: { agent: { select: { slug: true, user: { select: { name: true, email: true } } } } } }),
  ]);

  return (
    <div className="space-y-8">
      <PendingQueue items={pending as unknown as Array<{ id: string; type: string; entityId: string; action: string; createdAt: string; snapshot: unknown; agent: { slug: string; user: { name: string | null; email: string | null } } }> } />
      <ModerationTable awards={awards} images={images} builders={builders} />
    </div>
  );
}


