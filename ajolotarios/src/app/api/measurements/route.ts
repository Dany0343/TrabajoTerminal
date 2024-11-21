// app/api/measurements/route.ts

import { NextResponse } from 'next/server';
import { AlertType, Priority as AlertPriority, AlertStatus } from '@prisma/client';
import db from '@/lib/db';

import { WhatsAppService } from '@/app/services/whatsappService';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const sensorId = searchParams.get('sensorId');
    const isValid = searchParams.get('isValid');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (deviceId) {
      where.deviceId = Number(deviceId);
    }

    if (sensorId) {
      where.sensorId = Number(sensorId);
    }

    if (isValid !== null) {
      where.isValid = isValid === 'true';
    }

    if (startDate || endDate) {
      where.dateTime = {};
      if (startDate) {
        where.dateTime.gte = new Date(startDate);
      }
      if (endDate) {
        where.dateTime.lte = new Date(endDate);
      }
    }

    const [measurements, total] = await Promise.all([
      db.measurement.findMany({
        where,
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
        orderBy: {
          dateTime: 'desc',
        },
        skip,
        take: limit,
      }),
      db.measurement.count({ where }),
    ]);

    return NextResponse.json({
      data: measurements,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener las mediciones', { status: 500 });
  }
}


export async function POST(request: Request) {
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

    const measurement = await db.measurement.create({
      data: {
        deviceId,
        sensorId,
        dateTime: dateTime ? new Date(dateTime) : new Date(),
        isValid: isValid ?? true,
        parameters: {
          create: parameters.map((param: { parameterId: number; value: number }) => ({
            parameterId: param.parameterId,
            value: Number(param.value),
          })),
        },
      },
      include: {
        device: true,
        sensor: { include: { type: true } },
        parameters: { include: { parameter: true } },
        alerts: true,
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

      if (outOfRange) {
        alerts.push({
          measurementId: measurement.id,
          alertType: AlertType.PARAMETER_OUT_OF_RANGE,
          description: description.trim(),
          priority: AlertPriority.HIGH,
          status: AlertStatus.PENDING,
        });
      }

      return alerts;
    }, []);

    if (alertsToCreate.length > 0) {
      const createdAlerts = await db.alert.createMany({ data: alertsToCreate });
      
      // Enviar notificación WhatsApp para cada alerta
      const whatsappService = new WhatsAppService();
      
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
            await whatsappService.sendAlertNotification({
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

    const updatedMeasurement = await db.measurement.findUnique({
      where: { id: measurement.id },
      include: {
        device: true,
        sensor: { include: { type: true } },
        parameters: { include: { parameter: true } },
        alerts: true,
      },
    });

    return NextResponse.json(updatedMeasurement, { status: 201 });
  } catch (error) {
    console.error('Error detallado:', error);
    return new NextResponse(
      `Error al crear la medición: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      { status: 500 }
    );
  }
}