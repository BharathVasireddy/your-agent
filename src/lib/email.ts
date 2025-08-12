/*
  Lightweight Brevo (Sendinblue) email helper using REST API.
  Avoids adding SDK dependencies; uses native fetch.
*/

export type EmailAddress = {
  email: string;
  name?: string;
};

export type SendEmailParams = {
  to: EmailAddress | EmailAddress[];
  subject: string;
  html?: string;
  text?: string;
  cc?: EmailAddress | EmailAddress[];
  bcc?: EmailAddress | EmailAddress[];
  replyTo?: EmailAddress;
  from?: EmailAddress; // overrides default sender
  tags?: string[];
  headers?: Record<string, string>;
};

export type SendEmailResult = {
  ok: boolean;
  status: number;
  messageId?: string;
  error?: string;
};

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function normalize(recipients?: EmailAddress | EmailAddress[]): EmailAddress[] | undefined {
  if (!recipients) return undefined;
  return Array.isArray(recipients) ? recipients : [recipients];
}

function getDefaultSender(): EmailAddress {
  const email = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || '';
  const name = process.env.BREVO_SENDER_NAME || process.env.APP_NAME || 'Your Agent';
  return { email, name };
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('Brevo: Missing BREVO_API_KEY');
    return { ok: false, status: 0, error: 'Missing BREVO_API_KEY' };
  }

  const sender = params.from ?? getDefaultSender();
  if (!sender.email) {
    console.error('Brevo: Missing BREVO_SENDER_EMAIL or EMAIL_FROM');
    return { ok: false, status: 0, error: 'Missing sender email' };
  }

  const to = normalize(params.to);
  if (!to || to.length === 0) {
    return { ok: false, status: 0, error: 'No recipients provided' };
  }

  const payload = {
    sender,
    to,
    subject: params.subject,
    htmlContent: params.html,
    textContent: params.text,
    cc: normalize(params.cc),
    bcc: normalize(params.bcc),
    replyTo: params.replyTo,
    headers: params.headers,
    tags: params.tags,
  } as const;

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Brevo send error', res.status, text);
      return { ok: false, status: res.status, error: text?.slice(0, 1000) };
    }

    const data = (await res.json()) as { messageId?: string };
    return { ok: true, status: res.status, messageId: data.messageId };
  } catch (error) {
    console.error('Brevo send exception', error);
    return { ok: false, status: 0, error: String(error).slice(0, 1000) };
  }
}


