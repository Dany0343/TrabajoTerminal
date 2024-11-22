// app/api/telegram/route.ts
import { NextResponse } from 'next/server';
import { TelegramService } from '@/app/services/telegramService';

export async function GET() {
  try {
    const service = new TelegramService();
    // Add timestamp to prevent caching
    const testMessage = `Test message at ${Date.now()}`;
    
    console.log('Attempting to send message:', testMessage);
    
    const result = await service.sendTestMessage(testMessage);
    
    if (!result.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(result)}`);
    }

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}