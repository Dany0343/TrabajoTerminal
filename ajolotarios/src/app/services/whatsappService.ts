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
  private apiVersion = 'v21.0';
  private baseUrl = 'https://graph.facebook.com';

  constructor() {
    this.token = process.env.META_TOKEN || '';
    this.phoneNumberId = process.env.META_PHONE_NUMBER_ID || '';
    this.recipientNumber = process.env.META_RECIPIENT_NUMBER || '';


    // Add configuration validation logs
    console.log('WhatsApp Service Configuration:', {
      tokenLength: this.token.length,
      phoneNumberId: this.phoneNumberId,
      recipientNumber: this.recipientNumber,
      hasToken: !!this.token,
      hasPhoneId: !!this.phoneNumberId,
      hasRecipient: !!this.recipientNumber
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

  async sendAlertNotification(alertInfo: AlertInfo) {
    const message = this.formatAlertMessage(alertInfo);
    const url = `${this.baseUrl}/${this.apiVersion}/${this.phoneNumberId}/messages`;
    
    console.log('Request details:', {
      url,
      token: this.token.substring(0, 20) + '...',
      recipient: this.recipientNumber
    });

    try {
      // Using template message first to verify connection
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: this.recipientNumber,
          type: 'template',
          template: {
            name: 'hello_world',
            language: {
              code: 'en_US'
            }
          }
        })
      });

      const data = await response.json();
      console.log('Template message response:', data);

      if (data.messages?.[0]?.id) {
        // If template works, send actual message
        const messageResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: this.recipientNumber,
            type: 'text',
            text: { body: message }
          })
        });

        return await messageResponse.json();
      }

      return data;
    } catch (error) {
      console.error('WhatsApp API Error:', error);
      throw error;
    }
  }

  // Add test function
  async testConnection() {
    try {
      const testMessage = '🧪 Test message from AjoloApp';
      console.log('Sending test message...');

      const url = `${this.baseUrl}/${this.apiVersion}/${this.phoneNumberId}/messages`;
      console.log('Test message URL:', url);
      
      const response = await fetch(
        `${url}`,
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
              body: testMessage 
            }
          }),
        }
      );

      const result = await response.json();
      console.log('Test message result:', result);
      return result;
    } catch (error) {
      console.error('Test message failed:', error);
      throw error;
    }
  }
}