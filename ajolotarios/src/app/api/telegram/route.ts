// app/api/telegram/route.ts
import { NextResponse } from 'next/server';
import { TelegramService } from '@/app/services/telegramService';

export async function GET() {
  try {
    console.log('Environment check:', {
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_CHAT_ID,
    });

    const service = new TelegramService();
    const result = await service.sendTestMessage("🧪 Telegram API Test " + new Date().toISOString());
    
    return NextResponse.json({
      success: true,
      result,
      env: {
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasChatId: !!process.env.TELEGRAM_CHAT_ID,
        tokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const err = error as Error;
    console.error('Telegram API Error:', {
      message: err.message,
      stack: err.stack
    });
    
    return NextResponse.json({ 
      success: false, 
      error: err.message,
      env: {
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasChatId: !!process.env.TELEGRAM_CHAT_ID
      }
    }, { status: 500 });
  }
}