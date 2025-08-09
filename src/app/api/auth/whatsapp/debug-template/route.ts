import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wabaId = searchParams.get('wabaId') || process.env.WHATSAPP_WABA_ID;
    const name = searchParams.get('name') || process.env.WHATSAPP_TEMPLATE || 'otp';
    const token = process.env.WHATSAPP_TOKEN;

    if (!wabaId || !token) {
      return NextResponse.json({ error: 'Missing wabaId or token' }, { status: 400 });
    }

    const resp = await fetch(
      `https://graph.facebook.com/v20.0/${wabaId}/message_templates?fields=name,language,status,category,components&limit=1000`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: 'Graph error', data }, { status: 502 });
    }

    const templates = (data.data || []) as Array<{ name: string; language: string; components: unknown; status: string; category: string }>;
    const matches = templates.filter((t) => t.name === name);
    return NextResponse.json({ count: templates.length, matches });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch template', details: String(err) }, { status: 500 });
  }
}


