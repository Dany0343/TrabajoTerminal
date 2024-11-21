// app/api/whatsapp/route.ts
import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/app/services/whatsappService';

export async function GET() {
  try {
    const service = new WhatsAppService();
    const result = await service.testConnection();
    
    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}