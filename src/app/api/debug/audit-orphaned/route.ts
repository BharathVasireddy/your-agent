import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all agents and check if their corresponding User exists
    const allAgents = await prisma.agent.findMany({
      select: {
        id: true,
        slug: true,
        userId: true,
        isSubscribed: true,
        subscriptionEndsAt: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    });

    // Filter agents that don't have a corresponding user
    const orphanedAgents = allAgents.filter(agent => !agent.user);

    // Get statistics
    const stats = {
      totalAgents: allAgents.length,
      orphanedAgents: orphanedAgents.length,
      subscribedOrphaned: orphanedAgents.filter(agent => agent.isSubscribed).length,
      healthyAgents: allAgents.length - orphanedAgents.length,
    };

    return NextResponse.json({
      stats,
      orphanedAgents: orphanedAgents.map(agent => ({
        id: agent.id,
        slug: agent.slug,
        userId: agent.userId,
        isSubscribed: agent.isSubscribed,
        subscriptionEndsAt: agent.subscriptionEndsAt,
        createdAt: agent.createdAt,
      })),
    });

  } catch (error) {
    console.error('Audit orphaned agents error:', error);
    return NextResponse.json({ 
      error: 'Failed to audit orphaned agents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}