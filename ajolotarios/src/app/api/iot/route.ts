// app/api/measurements/azure/route.ts

import { NextResponse } from 'next/server';
import { AlertType, Priority as AlertPriority, AlertStatus, Measurement, MeasurementParameter } from '@prisma/client';
import db from '@/lib/db';

// import { WhatsAppService } from '@/app/services/whatsappService';
import { TelegramService } from '@/app/services/telegramService';

type AzureMeasurement = {
  sensorSerialNumber: string;
  parameterName: string;
  value: number;
  alert: boolean;
};

type AzurePayload = {
  deviceSerialNumber: string;
  timestamp: string;
  measurements: AzureMeasurement[];
};

export async function POST(request: Request) {
    try {
      const payload: AzurePayload = await request.json();
      const { deviceSerialNumber, timestamp, measurements } = payload;
  
      const device = await db.device.findUnique({
        where: { serialNumber: deviceSerialNumber },
        include: { sensors: true }
      });
  
      if (!device) {
        return new NextResponse(`Dispositivo no encontrado: ${deviceSerialNumber}`, { status: 404 });
      }
  
      // Crear mediciones separadas para cada sensor
    const createdMeasurements = await Promise.all(
        measurements.map(async (m) => {
          const sensor = await db.sensor.findUnique({
            where: { serialNumber: m.sensorSerialNumber }
          });
  
          if (!sensor) {
            throw new Error(`Sensor no encontrado: ${m.sensorSerialNumber}`);
          }
  
          const parameter = await db.parameter.findUnique({
            where: { name: m.parameterName }
          });
  
          if (!parameter) {
            throw new Error(`Parámetro no encontrado: ${m.parameterName}`);
          }
  
          return db.measurement.create({
            data: {
              deviceId: device.id,
              sensorId: sensor.id, // Ahora cada medición usa su sensor específico
              dateTime: new Date(timestamp),
              isValid: true,
              parameters: {
                create: [{
                  parameterId: parameter.id,
                  value: m.value
                }]
              }
            },
            include: {
              device: true,
              sensor: true,
              parameters: {
                include: { parameter: true }
              }
            }
          });
        })
      );

    // Obtener todos los parámetros de todas las mediciones creadas
    const allParameters = createdMeasurements.flatMap(measurement => 
        measurement.parameters
    );

    // 3. Verificar reglas y crear alertas
    const rules = await db.measurementRule.findMany({
        where: {
          parameterId: {
            in: allParameters.map(p => p.parameterId)
          },
          active: true
        },
        include: { parameter: true }
      });
  
      // Crear alertas para cada medición
      const alertsToCreate = createdMeasurements.flatMap(measurement => {
        return measurement.parameters.reduce<{
          measurementId: number;
          alertType: AlertType;
          description: string;
          priority: AlertPriority;
          status: AlertStatus;
        }[]>((alerts, param) => {
          const rule = rules.find(r => r.parameterId === param.parameterId);
          if (!rule) return alerts;
  
          const originalMeasurement = measurements.find(
            m => m.parameterName === rule.parameter.name
          );
  
          if (!originalMeasurement) return alerts;
  
          const paramValue = Number(param.value);
          const minValue = rule.optimalMin ? Number(rule.optimalMin) : null;
          const maxValue = rule.optimalMax ? Number(rule.optimalMax) : null;
  
          let outOfRange = false;
          let description = '';
  
          if (minValue !== null && paramValue < minValue) {
            outOfRange = true;
            description += `${rule.parameter.name} (${paramValue}) está por debajo del mínimo (${minValue}). `;
          }
          if (maxValue !== null && paramValue > maxValue) {
            outOfRange = true;
            description += `${rule.parameter.name} (${paramValue}) está por encima del máximo (${maxValue}). `;
          }
  
          if (outOfRange || originalMeasurement.alert) {
            alerts.push({
              measurementId: measurement.id,
              alertType: AlertType.PARAMETER_OUT_OF_RANGE,
              description: description.trim() || `Alerta reportada para ${rule.parameter.name}`,
              priority: AlertPriority.HIGH,
              status: AlertStatus.PENDING
            });
          }
  
          return alerts;
        }, []);
      });
  
    if (alertsToCreate.length > 0) {
      const createdAlerts = await db.alert.createMany({ data: alertsToCreate });
      
      // Enviar notificación WhatsApp para cada alerta
      // const whatsappService = new WhatsAppService();
      const telegramService = new TelegramService();
      
      // Obtener las alertas creadas con toda la información necesaria
      const fullAlerts = await db.alert.findMany({
        where: {
          id: {
            in: createdAlerts.count ? Array.from({ length: createdAlerts.count }, (_, i) => createdAlerts.count - i) : []
          }
        },
        include: {
          measurement: {
            include: {
              parameters: {
                include: {
                  parameter: true
                }
              }
            }
          }
        }
      });
    
      await Promise.all(
        fullAlerts.map(async (alert) => {
          const deviceInfo = await db.device.findUnique({
            where: { id: alert.measurement.deviceId },
            include: {
              tank: {
                include: {
                  ajolotary: true
                }
              }
            }
          });
    
          // Encontrar el parámetro relacionado con la alerta
          const measurementParameter = alert.measurement.parameters.find(p => 
            p.parameter.name === rules.find(r => 
              r.parameterId === p.parameterId
            )?.parameter.name
          );
    
          if (deviceInfo && measurementParameter?.parameter) {
            await telegramService.sendAlertNotification({
              alert: {
                id: alert.id,
                measurementId: alert.measurementId,
                alertType: alert.alertType,
                description: alert.description,
                priority: alert.priority,
                status: alert.status,
                createdAt: alert.createdAt,
                resolvedAt: alert.resolvedAt,
                resolvedBy: alert.resolvedBy,
                notes: alert.notes
              },
              deviceInfo: {
                device: {
                  id: deviceInfo.id,
                  name: deviceInfo.name,
                  serialNumber: deviceInfo.serialNumber,
                  status: deviceInfo.status,
                  tankId: deviceInfo.tankId,
                  tank: {
                    ...deviceInfo.tank,
                    ajolotary: deviceInfo.tank.ajolotary
                  }
                }
              },
              parameter: measurementParameter.parameter,
              value: Number(measurementParameter.value)
            });
          }
        })
      );
    }
  
      // Devolver todas las mediciones creadas con sus alertas
      const finalMeasurements = await Promise.all(
        createdMeasurements.map(measurement =>
          db.measurement.findUnique({
            where: { id: measurement.id },
            include: {
              device: true,
              sensor: true,
              parameters: {
                include: { parameter: true }
              },
              alerts: true
            }
          })
        )
      );
  
      return NextResponse.json(finalMeasurements, { status: 201 });
  
    } catch (error) {
      console.error('Error detallado:', error);
      return new NextResponse(
        `Error al procesar las mediciones de Azure: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        { status: 500 }
      );
    }
}