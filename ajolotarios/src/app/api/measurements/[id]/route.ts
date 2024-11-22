// app/api/measurements/[id]/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { AlertType, Priority as AlertPriority, AlertStatus } from '@prisma/client';
import { TelegramService } from '@/app/services/telegramService';

import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const measurement = await db.measurement.findUnique({
      where: { id: Number(params.id) },
      include: {
        device: {
          include: {
            tank: true,
          },
        },
        sensor: {
          include: {
            type: true,
          },
        },
        parameters: {
          include: {
            parameter: true,
          },
        },
        alerts: true,
      },
    });
    if (!measurement) {
      return new NextResponse('Medición no encontrada', { status: 404 });
    }
    return NextResponse.json(measurement);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener la medición', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { deviceId, sensorId, dateTime, isValid, parameters } = data;

    if (!deviceId || !sensorId || !parameters || !Array.isArray(parameters)) {
      return new NextResponse('Faltan campos requeridos o el formato es incorrecto', { status: 400 });
    }

    const [device, sensor] = await Promise.all([
      db.device.findUnique({ where: { id: deviceId } }),
      db.sensor.findUnique({ where: { id: sensorId } })
    ]);

    if (!device) {
      return new NextResponse('Dispositivo no encontrado', { status: 404 });
    }
    if (!sensor) {
      return new NextResponse('Sensor no encontrado', { status: 404 });
    }

    const updatedMeasurement = await db.measurement.update({
      where: { id: Number(params.id) },
      data: {
        deviceId,
        sensorId,
        dateTime: dateTime ? new Date(dateTime) : undefined,
        isValid,
        parameters: {
          deleteMany: {},
          create: parameters.map((param: { parameterId: number; value: number }) => ({
            parameterId: param.parameterId,
            value: Number(param.value),
          })),
        },
      },
      include: {
        parameters: {
          include: {
            parameter: true,
          },
        },
      },
    });

    const rules = await db.measurementRule.findMany({
      where: {
        parameterId: { in: parameters.map(p => p.parameterId) },
        active: true,
      },
      include: { parameter: true },
    });

    const alertsToCreate = parameters.reduce<any[]>((alerts, param) => {
      const rule = rules.find(r => r.parameterId === param.parameterId);
      if (!rule) return alerts;

      const paramValue = Number(param.value);
      const minValue = rule.optimalMin !== null ? Number(rule.optimalMin) : null;
      const maxValue = rule.optimalMax !== null ? Number(rule.optimalMax) : null;

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

      if (outOfRange) {
        alerts.push({
          measurementId: updatedMeasurement.id,
          alertType: AlertType.PARAMETER_OUT_OF_RANGE,
          description: description.trim(),
          priority: AlertPriority.HIGH,
          status: AlertStatus.PENDING,
        });
      }

      return alerts;
    }, []);

    if (alertsToCreate.length > 0) {
      // Crear alertas individualmente e incluir la medición y sus parámetros
      const createdAlerts = await Promise.all(
        alertsToCreate.map(alertData =>
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

      // Procesar cada alerta creada
      for (const alert of createdAlerts) {
        const deviceInfo = await db.device.findUnique({
          where: { id: alert.measurementId },
          include: {
            tank: {
              include: {
                ajolotary: true,
              },
            },
          },
        });

        if (!deviceInfo) {
          console.error(`Dispositivo con ID ${alert.measurementId} no encontrado.`);
          continue;
        }

        // Encontrar el parámetro relacionado con la alerta
        const measurementParameter = alert.measurement.parameters.find(p =>
          rules.some(r => r.parameterId === p.parameterId)
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

    const finalMeasurement = await db.measurement.findUnique({
      where: { id: updatedMeasurement.id },
      include: {
        device: true,
        sensor: { include: { type: true } },
        parameters: { include: { parameter: true } },
        alerts: true,
      },
    });

    return NextResponse.json(finalMeasurement);
  } catch (error) {
    console.error('Error detallado:', error);
    return new NextResponse(
      `Error al actualizar la medición: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.measurement.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar la medición', { status: 500 });
  }
}