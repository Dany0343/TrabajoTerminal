// app/api/sensors/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'

export async function GET() {
  try {
    const sensors = await db.sensor.findMany({
      include: {
        device: true,
        type: true,
        status: true,
        measurements: true,
      },
    });
    return NextResponse.json(sensors);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los sensores', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      model,
      serialNumber,
      lastConnection,
      magnitude,
      typeId,
      statusId,
      deviceId,
      calibratedAt,
      nextCalibrationAt,
    } = data;

    // Validación de campos requeridos
    if (!model || !serialNumber || !magnitude || !typeId || !statusId || !deviceId) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const sensor = await db.sensor.create({
      data: {
        model,
        serialNumber,
        lastConnection: lastConnection ? new Date(lastConnection) : undefined,
        magnitude,
        typeId,
        statusId,
        deviceId,
        calibratedAt: calibratedAt ? new Date(calibratedAt) : undefined,
      },
    });

    return NextResponse.json(sensor, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el sensor', { status: 500 });
  }
}
