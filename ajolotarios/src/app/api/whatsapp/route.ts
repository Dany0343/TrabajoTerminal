// app/api/whatsapp/route.ts
import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/app/services/whatsappService';

export async function GET() {
  try {
    // Debug environment variables
    console.log('Environment check:', {
      MET_TOKEN: !!process.env.MET_TOKEN,
      META_TOKEN: !!process.env.META_TOKEN,
      phoneId: process.env.META_PHONE_NUMBER_ID,
      recipient: process.env.META_RECIPIENT_NUMBER
    });

    const service = new WhatsAppService();
    const result = await service.sendTestMessage("🧪 WhatsApp API Test " + new Date().toISOString());
    
    return NextResponse.json({
      success: true,
      result,
      env: {
        hasToken: !!process.env.META_TOKEN, // Notice the change from MET_TOKEN to META_TOKEN
        phoneId: process.env.META_PHONE_NUMBER_ID,
        recipient: process.env.META_RECIPIENT_NUMBER,
        tokenLength: process.env.META_TOKEN?.length || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const err = error as Error;
    console.error('WhatsApp API Error:', {
      message: err.message,
      stack: err.stack
    });
    
    return NextResponse.json({ 
      success: false, 
      error: err.message,
      env: {
        hasToken: !!process.env.META_TOKEN,
        phoneId: process.env.META_PHONE_NUMBER_ID,
        recipient: process.env.META_RECIPIENT_NUMBER
      }
    }, { status: 500 });
  }
}