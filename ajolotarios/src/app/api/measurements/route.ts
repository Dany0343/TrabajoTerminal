// app/api/measurements/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'


export async function GET() {
  try {
    const measurements = await db.measurement.findMany({
      include: {
        device: true,
        sensor: {
          include: {
            type: true,
            status: true,
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
    return NextResponse.json(measurements);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener las mediciones', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      deviceId,
      sensorId,
      dateTime,
      isValid,
      parameters,
    } = data;

    // Validación de campos requeridos
    if (!deviceId || !sensorId || !parameters) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
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
            status: true,
          },
        },
        parameters: {
          include: {
            parameter: true,
          },
        },
      },
    });

    return NextResponse.json(measurement, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear la medición', { status: 500 });
  }
}
