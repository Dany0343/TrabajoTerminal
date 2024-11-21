// app/api/whatsapp/route.ts
import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/app/services/whatsappService';

export async function GET() {
  try {
    console.log('Testing WhatsApp connection...');
    const service = new WhatsAppService();
    
    // Send a more obvious test message
    const result = await service.sendTestMessage('🚨 Test Alert from AjoloApp - ' + new Date().toLocaleString());
    console.log('WhatsApp response:', result);
    
    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('WhatsApp test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error instanceof Error) ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}