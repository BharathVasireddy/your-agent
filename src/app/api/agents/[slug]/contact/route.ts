import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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

    const agent = await prisma.agent.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        phone: true,
        city: true,
        area: true,
        logoUrl: true,
        websiteUrl: true,
        facebookUrl: true,
        instagramUrl: true,
        linkedinUrl: true,
        youtubeUrl: true,
        twitterUrl: true,
        user: { select: { email: true, name: true } },
      },
    });
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Optionally link to a property if slug provided
    let propertyId: string | undefined = undefined;
    let propertyDetails: { title?: string | null; location?: string | null; url?: string; price?: number | null } | undefined;
    if (propertySlug) {
      const property = await prisma.property.findUnique({
        where: { slug: propertySlug },
        select: { id: true, agentId: true, title: true, location: true, price: true },
      });
      if (property && property.agentId === agent.id) {
        propertyId = property.id;
        propertyDetails = {
          title: property.title,
          location: property.location,
          price: property.price,
          url: `https://youragent.in/${agent.slug}/properties/${propertySlug}`,
        };
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

    // Helpers
    const profileUrl = `https://youragent.in/${agent.slug}`;
    const safe = (v?: string | null) => (v ? String(v) : '');
    const socialLinks = [
      agent.websiteUrl ? { name: 'Website', url: agent.websiteUrl } : null,
      agent.facebookUrl ? { name: 'Facebook', url: agent.facebookUrl } : null,
      agent.instagramUrl ? { name: 'Instagram', url: agent.instagramUrl } : null,
      agent.linkedinUrl ? { name: 'LinkedIn', url: agent.linkedinUrl } : null,
      agent.youtubeUrl ? { name: 'YouTube', url: agent.youtubeUrl } : null,
      agent.twitterUrl ? { name: 'Twitter/X', url: agent.twitterUrl } : null,
    ].filter(Boolean) as Array<{ name: string; url: string }>;
    const socialHtml =
      socialLinks.length > 0
        ? `<p style="margin:12px 0 4px 0;"><strong>Connect:</strong> ${socialLinks
            .map((s) => `<a href="${s.url}" style="color:#0ea5e9; text-decoration:none;" target="_blank" rel="noopener noreferrer">${s.name}</a>`)
            .join(' · ')}</p>`
        : '';
    const phoneDisplay = safe(agent.phone);
    const whatsappUrl = phoneDisplay ? `https://wa.me/${phoneDisplay.replace(/[^0-9]/g, '')}` : '';

    // Fire-and-forget email notifications (Brevo)
    // 1) Notify agent
    if (agent.user?.email) {
      const html = `
        <div style="font-family: Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#0a0a0a;">
          <h2 style="margin:0 0 12px 0;">New inquiry from ${name}</h2>
          ${propertyDetails ? `<p style=\"margin:0 0 8px 0;\"><strong>Regarding:</strong> <a href=\"${propertyDetails.url}\" style=\"color:#0ea5e9;text-decoration:none;\">${propertyDetails.title || propertySlug}</a>${propertyDetails.location ? ` · ${propertyDetails.location}` : ''}</p>` : ''}
          <p style="margin:0 0 8px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin:0 0 8px 0; white-space:pre-wrap">${message}</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
          <p style="margin:0 0 4px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin:0 0 4px 0;"><strong>Email:</strong> ${email}</p>
          ${phone ? `<p style=\"margin:0 0 4px 0;\"><strong>Phone:</strong> ${phone}</p>` : ''}
          <p style="margin:8px 0 0 0; color:#6b7280"><em>Source:</em> ${source}</p>
        </div>
      `;
      // Do not block the response on email sending
      sendEmail({
        to: { email: agent.user.email, name: agent.user.name || undefined },
        subject: `New inquiry from ${name}${propertyDetails?.title ? ` regarding ${propertyDetails.title}` : propertySlug ? ` regarding ${propertySlug}` : ''}`,
        html,
        text: `New inquiry from ${name}\nSubject: ${subject}\nMessage: ${message}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}${propertyDetails?.title ? `\nProperty: ${propertyDetails.title} (${propertyDetails.url})` : propertySlug ? `\nProperty: ${propertySlug}` : ''}\nSource: ${source}`,
        replyTo: { email, name },
        tags: ['lead', 'contact-form', slug],
      }).catch((err) => console.error('Agent notify email failed', err));
    }

    // 2) Acknowledgment to sender (best-effort)
    if (email) {
      const shownAgentName = agent.user?.name || 'Your Agent';
      const fromEmail = agent.user?.email || undefined;
      const headerLogo = agent.logoUrl
        ? `<div style=\"margin-bottom:16px;\"><img src=\"${agent.logoUrl}\" alt=\"${shownAgentName}\" style=\"max-height:40px; border-radius:6px;\"/></div>`
        : '';

      const contactBlock = `
        <div style=\"margin-top:16px; padding-top:12px; border-top:1px solid #e5e7eb; color:#374151;\">
          <p style=\"margin:0 0 4px 0;\"><strong>${shownAgentName}</strong></p>
          <p style=\"margin:0 0 4px 0;\">${agent.city || ''}${agent.area ? (agent.city ? ', ' : '') + agent.area : ''}</p>
          ${phoneDisplay ? `<p style=\"margin:0 0 4px 0;\">Phone: <a href=\"tel:${phoneDisplay}\" style=\"color:#0ea5e9; text-decoration:none;\">${phoneDisplay}</a>${whatsappUrl ? ` · <a href=\"${whatsappUrl}\" style=\"color:#22c55e; text-decoration:none;\">WhatsApp</a>` : ''}</p>` : ''}
          <p style=\"margin:0 0 4px 0;\">Profile: <a href=\"${profileUrl}\" style=\"color:#0ea5e9; text-decoration:none;\">${profileUrl}</a></p>
          ${socialHtml}
        </div>`;

      const ackHtml = `
        <div style="font-family: Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#0a0a0a;">
          ${headerLogo}
          <h2 style="margin:0 0 12px 0;">Thanks for reaching out</h2>
          <p style="margin:0 0 8px 0;">Hi ${name},</p>
          <p style="margin:0 0 8px 0;">Thank you for contacting ${shownAgentName}. We received your message and will get back to you soon.</p>
          ${propertyDetails ? `<p style=\"margin:0 0 8px 0;\"><strong>Property:</strong> <a href=\"${propertyDetails.url}\" style=\"color:#0ea5e9; text-decoration:none;\">${propertyDetails.title || propertySlug}</a>${propertyDetails.location ? ` · ${propertyDetails.location}` : ''}</p>` : ''}
          <div style="margin:12px 0 0 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
            <p style="margin:0 0 8px 0; font-weight:600;">Your Message</p>
            <p style="margin:0; white-space:pre-wrap; color:#374151;">${message}</p>
          </div>
          ${contactBlock}
          <p style="margin:16px 0 0 0; color:#6b7280">This is an automated confirmation.</p>
        </div>
      `;

      sendEmail({
        to: { email, name },
        from: fromEmail ? { email: fromEmail, name: shownAgentName } : undefined,
        replyTo: fromEmail ? { email: fromEmail, name: shownAgentName } : undefined,
        subject: `Thanks for your inquiry${propertyDetails?.title ? ` about ${propertyDetails.title}` : ''}`,
        html: ackHtml,
        text: `Hi ${name},\n\nThank you for contacting ${shownAgentName}. We received your message and will get back to you soon.\n${propertyDetails?.title ? `Property: ${propertyDetails.title} (${propertyDetails.url})\n` : ''}\n— ${shownAgentName}\n${phoneDisplay ? `Phone: ${phoneDisplay}\n` : ''}Profile: ${profileUrl}`,
        tags: ['lead-ack', 'contact-form', slug],
      }).catch((err) => console.error('Lead ack email failed', err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


