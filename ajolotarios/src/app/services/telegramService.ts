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

  private formatAlertMessage(alertInfo: AlertInfo): string {
    const { alert, deviceInfo, parameter, value } = alertInfo;
    
    return `🚨 *ALERTA EN SISTEMA AjoloApp*

*Tipo de Alerta:* ${alert.alertType}
*Prioridad:* ${alert.priority}
*Descripción:* ${alert.description}

📍 *Ubicación:*
Ajolotario: ${deviceInfo.device.tank.ajolotary.name}
Tanque: ${deviceInfo.device.tank.name}
Dispositivo: ${deviceInfo.device.name}

📊 *Medición:*
Parámetro: ${parameter.name}
Valor: ${value}

⏰ Fecha: ${new Date(alert.createdAt).toLocaleString('es-MX')}

Por favor, revisa el sistema lo antes posible.`;
  }

  async sendMessage(text: string, parseMode: 'HTML' | 'MarkdownV2' = 'MarkdownV2') {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
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

  async sendAlertNotification(alertInfo: AlertInfo) {
    const message = this.formatAlertMessage(alertInfo);
    return this.sendMessage(message);
  }

  async sendTestMessage(message: string) {
    return this.sendMessage(message);
  }

  async testConnection() {
    return this.sendMessage('🧪 AjoloApp Bot Test Connection');
  }
}