// app/api/measurements/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

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

    // Validación de campos requeridos
    if (!deviceId || !sensorId || !parameters) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    // Validar existencia de dispositivo y sensor
    const device = await db.device.findUnique({ where: { id: deviceId } });
    if (!device) {
      return new NextResponse('Dispositivo no encontrado', { status: 404 });
    }

    const sensor = await db.sensor.findUnique({ where: { id: sensorId } });
    if (!sensor) {
      return new NextResponse('Sensor no encontrado', { status: 404 });
    }

    // Crear la medición
    const measurement = await db.measurement.create({
      data: {
        deviceId,
        sensorId,
        dateTime: dateTime ? new Date(dateTime) : undefined,
        isValid: isValid ?? true,
        parameters: {
          create: parameters.map((param: { parameterId: number; value: number }) => ({
            parameterId: param.parameterId,
            value: param.value,
          })),
        },
      },
      include: {
        device: true,
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

    return NextResponse.json(measurement, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear la medición', { status: 500 });
  }
}
