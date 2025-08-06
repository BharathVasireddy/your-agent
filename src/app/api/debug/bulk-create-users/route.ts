import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { orphanedAgents } = await request.json();

    if (!orphanedAgents || !Array.isArray(orphanedAgents)) {
      return NextResponse.json({ 
        error: 'Invalid request: orphanedAgents array is required' 
      }, { status: 400 });
    }

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Process each orphaned agent
    for (const agent of orphanedAgents) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { id: agent.userId }
        });

        if (existingUser) {
          skipped++;
          continue;
        }

        // Create the missing user record
        await prisma.user.create({
          data: {
            id: agent.userId,
            email: `user-${agent.userId}@placeholder.com`, // Placeholder email
            name: `Agent ${agent.slug}`, // Placeholder name based on agent slug
            emailVerified: new Date(), // Set as verified since they had an agent
          }
        });

        created++;

      } catch (userError) {
        const errorMessage = `Failed to create user for agent ${agent.slug}: ${userError instanceof Error ? userError.message : 'Unknown error'}`;
        errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    // Return results
    const response = {
      success: true,
      created,
      skipped,
      total: orphanedAgents.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully created ${created} user records, skipped ${skipped} existing ones${errors.length > 0 ? `, encountered ${errors.length} errors` : ''}.`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Bulk create users error:', error);
    return NextResponse.json({ 
      error: 'Failed to bulk create user records',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}