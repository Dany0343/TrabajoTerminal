// app/api/sensors/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const sensors = await db.sensor.findMany({
      include: {
        device: true,
        type: true,
        measurements: true,
      },
    });

    // Registrar el log de lectura masiva
    await createLog(
      ActionType.READ,
      'Sensor',
      undefined,
      userId,
      `Lectura masiva de sensores`
    );

    return NextResponse.json(sensors);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los sensores', { status: 500 });
  }
}

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const data = await request.json();
    const {
      model,
      serialNumber,
      typeId,
      status, 
      deviceId,
    } = data;

    // Validación de campos requeridos
    if (!model || !serialNumber || !typeId || !status || !deviceId) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const sensor = await db.sensor.create({
      data: {
        model,
        serialNumber,
        typeId,
        deviceId,
        status,
      },
    });

    // Registrar el log de creación
    await createLog(
      ActionType.CREATE,
      'Sensor',
      sensor.id,
      userId,
      JSON.stringify({ model, serialNumber, typeId, status, deviceId })
    );

    return NextResponse.json(sensor, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el sensor', { status: 500 });
  }
}