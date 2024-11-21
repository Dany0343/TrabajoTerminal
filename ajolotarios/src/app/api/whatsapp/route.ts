// app/api/whatsapp/route.ts

import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/app/services/whatsappService';

export async function GET() {
  try {
    const whatsapp = new WhatsAppService();
    const result = await whatsapp.testConnection();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}