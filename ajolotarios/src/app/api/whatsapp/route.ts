// app/api/whatsapp/route.ts
import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/app/services/whatsappService';

export async function GET() {
  const service = new WhatsAppService();
  const result = await service.testConnection();
  return NextResponse.json(result);
}