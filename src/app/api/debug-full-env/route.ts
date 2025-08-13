import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    // Auth variables
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'MISSING', 
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'MISSING',
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? 'SET' : 'MISSING',
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? 'SET' : 'MISSING',
    
    // WhatsApp variables
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN ? 'SET' : 'MISSING',
    WHATSAPP_PHONE_ID: process.env.WHATSAPP_PHONE_ID ? 'SET' : 'MISSING', 
    WHATSAPP_TEMPLATE: process.env.WHATSAPP_TEMPLATE ? 'SET' : 'MISSING',
    WHATSAPP_TEMPLATE_LANG: process.env.WHATSAPP_TEMPLATE_LANG ? 'SET' : 'MISSING',
    
    // Email variables
    BREVO_API_KEY: process.env.BREVO_API_KEY ? 'SET' : 'MISSING',
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL ? 'SET' : 'MISSING',
    EMAIL_FROM: process.env.EMAIL_FROM ? 'SET' : 'MISSING',
    
    // Other
    PRIMARY_DOMAIN: process.env.PRIMARY_DOMAIN ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'MISSING',
    APP_NAME: process.env.APP_NAME ? 'SET' : 'MISSING'
  };
  
  return NextResponse.json(envVars);
}