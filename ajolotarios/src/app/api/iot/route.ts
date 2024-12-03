// app/api/iot/route.ts

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { AlertType, Priority as AlertPriority, AlertStatus } from '@prisma/client';
import db from '@/lib/db';
import { TelegramService } from '@/app/services/telegramService';

// logging
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';

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
  const expectedApiKey = process.env.FUNCTION_KEY;

  // Add debugging logs
  console.log('Received headers:', Object.fromEntries(request.headers));
  console.log('Expected API key:', process.env.FUNCTION_KEY);
  
  const apiKey = request.headers.get('x-function-key');
  console.log('Received API key:', apiKey);

  if (!apiKey || apiKey !== process.env.API_KEY) {
    console.log('Auth failed - received:', apiKey, 'expected:', process.env.API_KEY);
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // No hay usuario asociado para operaciones automatizadas
  const userId = undefined;

  try {
    const payload: AzurePayload = await request.json();
    const { deviceSerialNumber, timestamp, measurements } = payload;

    const device = await db.device.findUnique({
      where: { serialNumber: deviceSerialNumber },
      include: { sensors: true },
    });

    if (!device) {
      return new NextResponse(`Dispositivo no encontrado: ${deviceSerialNumber}`, { status: 404 });
    }

    // Crear mediciones separadas para cada sensor
    const createdMeasurements = await Promise.all(
      measurements.map(async (m) => {
        const sensor = await db.sensor.findUnique({
          where: { serialNumber: m.sensorSerialNumber },
        });

        if (!sensor) {
          throw new Error(`Sensor no encontrado: ${m.sensorSerialNumber}`);
        }

        const parameter = await db.parameter.findUnique({
          where: { name: m.parameterName },
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
              create: [
                {
                  parameterId: parameter.id,
                  value: m.value,
                },
              ],
            },
          },
          include: {
            device: true,
            sensor: true,
            parameters: {
              include: { parameter: true },
            },
          },
        });
      })
    );

    // Obtener todos los parámetros de todas las mediciones creadas
    const allParameters = createdMeasurements.flatMap((measurement) => measurement.parameters);

    // Verificar reglas y crear alertas
    const rules = await db.measurementRule.findMany({
      where: {
        parameterId: {
          in: allParameters.map((p) => p.parameterId),
        },
        active: true,
      },
      include: { parameter: true },
    });

    // Crear alertas para cada medición
    const alertsToCreate = createdMeasurements.flatMap((measurement) => {
      return measurement.parameters.reduce<
        {
          measurementId: number;
          alertType: AlertType;
          description: string;
          priority: AlertPriority;
          status: AlertStatus;
        }[]
      >((alerts, param) => {
        const rule = rules.find((r) => r.parameterId === param.parameterId);
        if (!rule) return alerts;

        const originalMeasurement = measurements.find(
          (m) => m.parameterName === rule.parameter.name
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
            description:
              description.trim() || `Alerta reportada para ${rule.parameter.name}`,
            priority: AlertPriority.HIGH,
            status: AlertStatus.PENDING,
          });
        }

        return alerts;
      }, []);
    });

    if (alertsToCreate.length > 0) {
      // Crear alertas individualmente para obtener sus IDs
      const createdAlerts = await Promise.all(
        alertsToCreate.map((alertData) =>
          db.alert.create({
            data: alertData,
            include: {
              measurement: {
                include: {
                  parameters: {
                    include: {
                      parameter: true,
                    },
                  },
                },
              },
            },
          })
        )
      );

      const telegramService = new TelegramService();

      // Enviar notificaciones para cada alerta
      for (const alert of createdAlerts) {
        const deviceInfo = await db.device.findUnique({
          where: { id: alert.measurement.deviceId },
          include: {
            tank: {
              include: {
                ajolotary: true,
              },
            },
          },
        });

        if (!deviceInfo) {
          console.error(`Dispositivo con ID ${alert.measurement.deviceId} no encontrado.`);
          continue;
        }

        // Encontrar el parámetro relacionado con la alerta
        const measurementParameter = alert.measurement.parameters.find((p) =>
          rules.some((r) => r.parameterId === p.parameterId)
        );

        if (measurementParameter?.parameter) {
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
              notes: alert.notes,
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
                  ajolotary: deviceInfo.tank.ajolotary,
                },
              },
            },
            parameter: measurementParameter.parameter,
            value: Number(measurementParameter.value),
          });
        } else {
          console.error(`No se encontró el parámetro para la alerta con ID ${alert.id}.`);
        }
      }
    }

    // Devolver todas las mediciones creadas con sus alertas
    const finalMeasurements = await Promise.all(
      createdMeasurements.map((measurement) =>
        db.measurement.findUnique({
          where: { id: measurement.id },
          include: {
            device: true,
            sensor: true,
            parameters: {
              include: { parameter: true },
            },
            alerts: true,
          },
        })
      )
    );

    // Registrar el log de creación masiva de mediciones
    await createLog(
      ActionType.CREATE,
      'Measurement',
      undefined,
      userId,
      `Creación masiva de mediciones para el dispositivo serialNumber ${payload.deviceSerialNumber}`
    );

    return NextResponse.json(finalMeasurements, { status: 201 });
  } catch (error) {
    console.error('Error detallado:', error);
    return new NextResponse(
      `Error al procesar las mediciones de Azure: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
      { status: 500 }
    );
  }
}
