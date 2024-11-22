// app/services/telegramService.ts
import { Alert, Device, Tank, Ajolotary, Parameter } from '@prisma/client';


const DEFAULT_RECIPIENT_ID = '783493822';

type AlertInfo = {
  alert: any; // Add proper type
  deviceInfo: any; // Add proper type
  parameter: any; // Add proper type
  value: number;
};

export class TelegramService {
  private token: string;
  private chatId: string;
  private baseUrl: string;
  private defaultRecipientId: string;

  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
    this.defaultRecipientId = DEFAULT_RECIPIENT_ID;

    console.log('Telegram Service Configuration:', {
      hasToken: !!this.token,
      hasChatId: !!this.chatId,
      tokenLength: this.token.length
    });
  }

  private escapeMarkdown(text: string): string {
    // Escape special characters for MarkdownV2
    return text.replace(/[_*\[\]()~`>#+=|{}.!-]/g, '\\$&');
  }

  private formatAlertMessage(alertInfo: AlertInfo): string {
    const { alert, deviceInfo, parameter, value } = alertInfo;
    
    // Escape each part individually
    const formattedMessage = `🚨 *ALERTA EN SISTEMA AjoloApp*

*Tipo de Alerta:* ${this.escapeMarkdown(alert.alertType)}
*Prioridad:* ${this.escapeMarkdown(alert.priority)}
*Descripción:* ${this.escapeMarkdown(alert.description)}

📍 *Ubicación:*
Ajolotario: ${this.escapeMarkdown(deviceInfo.device.tank.ajolotary.name)}
Tanque: ${this.escapeMarkdown(deviceInfo.device.tank.name)}
Dispositivo: ${this.escapeMarkdown(deviceInfo.device.name)}

📊 *Medición:*
Parámetro: ${this.escapeMarkdown(parameter.name)}
Valor: ${this.escapeMarkdown(String(value))}

⏰ Fecha: ${this.escapeMarkdown(new Date(alert.createdAt).toLocaleString('es-MX'))}

Por favor, revisa el sistema lo antes posible\\.`;

    return formattedMessage;
  }

  async sendMessage(text: string, recipientId?: string | number) {
    try {
      const chatId = recipientId || this.defaultRecipientId;
      
      console.log('Sending message to:', chatId);

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML' // Using HTML format as it's easier to handle than MarkdownV2
        })
      });

      const data = await response.json();
      console.log('Telegram API response:', data);
      return data;
    } catch (error) {
      console.error('Telegram API Error:', error);
      throw error;
    }
  }

  setDefaultRecipient(recipientId: string | number) {
    this.defaultRecipientId = String(recipientId);
  }

  async sendAlertNotification(alertInfo: AlertInfo, recipientId?: string | number) {
    const message = this.formatAlertMessage(alertInfo);
    return this.sendMessage(message, recipientId);
  }

  async sendTestMessage(message: string, recipientId?: string | number) {
    return this.sendMessage(`🧪 Test: ${message}`, recipientId);
  }
}