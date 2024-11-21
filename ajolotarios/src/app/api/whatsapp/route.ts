// app/api/whatsapp/route.ts
import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/app/services/whatsappService';

export async function GET() {
  try {
    const service = new WhatsAppService();
    const result = await service.sendTestMessage("Test message " + new Date().toISOString());
    
    return NextResponse.json({
      success: true,
      result,
      env: {
        hasToken: !!process.env.MET_TOKEN,
        phoneId: process.env.META_PHONE_NUMBER_ID,
        recipient: process.env.META_RECIPIENT_NUMBER
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message,
      env: {
        hasToken: !!process.env.MET_TOKEN,
        phoneId: process.env.META_PHONE_NUMBER_ID,
        recipient: process.env.META_RECIPIENT_NUMBER
      }
    }, { status: 500 });
  }
}