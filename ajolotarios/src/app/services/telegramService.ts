// app/services/telegramService.ts
import { Alert, Device, Tank, Ajolotary, Parameter } from '@prisma/client';


type AlertInfo = {
  alert: Alert;
  deviceInfo: {
    device: Device & {
      tank: Tank & {
        ajolotary: Ajolotary;
      };
    };
  };
  parameter: Parameter;
  value: number;
};

export class TelegramService {
  private token: string;
  private chatId: string;
  private baseUrl: string;

  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;

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

  async sendMessage(text: string, parseMode: 'HTML' | 'MarkdownV2' = 'MarkdownV2') {
    try {
      const formattedText = parseMode === 'MarkdownV2' ? this.escapeMarkdown(text) : text;
      
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: formattedText,
          parse_mode: parseMode
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

  async testConnection() {
    return this.sendMessage('🧪 AjoloApp Bot Test Connection');
  }

  async sendTestMessage(message: string) {
    return this.sendMessage(message);
  }

  async sendAlertNotification(alertInfo: AlertInfo) {
    const message = this.formatAlertMessage(alertInfo);
    return this.sendMessage(message);
  }
}