import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  propertySlug?: string;
  source?: string;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = (await request.json()) as Partial<ContactPayload>;

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const name = (body.name || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const message = (body.message || '').toString().trim();
    const phone = (body.phone || '').toString().trim();
    const subject = (body.subject || 'General Inquiry').toString().trim();
    const source = (body.source || 'contact-form').toString().trim();
    const propertySlug = body.propertySlug ? body.propertySlug.toString() : undefined;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const agent = await prisma.agent.findUnique({ where: { slug }, select: { id: true } });
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Optionally link to a property if slug provided
    let propertyId: string | undefined = undefined;
    if (propertySlug) {
      const property = await prisma.property.findUnique({ where: { slug: propertySlug }, select: { id: true, agentId: true } });
      if (property && property.agentId === agent.id) {
        propertyId = property.id;
      }
    }

    const metadata = {
      name,
      email,
      phone,
      subject,
      message,
      source,
      propertySlug: propertySlug || null,
      userAgent: request.headers.get('user-agent') || null,
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
    } as const;

    await prisma.lead.create({
      data: {
        agentId: agent.id,
        type: 'contact',
        source,
        propertyId: propertyId || null,
        metadata: JSON.stringify(metadata),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


