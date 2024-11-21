// app/services/whatsapp.service.ts

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

export class WhatsAppService {
  private token: string;
  private phoneNumberId: string;
  private recipientNumber: string;
  private apiVersion = 'v17.0';
  private baseUrl = 'https://graph.facebook.com';

  constructor() {
    this.token = process.env.META_TOKEN || '';
    this.phoneNumberId = process.env.META_PHONE_NUMBER_ID || '';
    this.recipientNumber = process.env.META_RECIPIENT_NUMBER || '';
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

  async sendAlertNotification(alertInfo: AlertInfo) {
    const message = this.formatAlertMessage(alertInfo);

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: this.recipientNumber,
            type: 'text',
            text: { 
              preview_url: false,
              body: message 
            }
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error WhatsApp API:', error);
        throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando notificación:', error);
      throw error;
    }
  }
}