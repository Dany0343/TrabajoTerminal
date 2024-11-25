// app/api/sensors/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const sensor = await db.sensor.findUnique({
      where: { id: Number(params.id) },
      include: {
        device: true,
        type: true,
        measurements: true,
      },
    });
    if (!sensor) {
      return new NextResponse('Sensor no encontrado', { status: 404 });
    }

    // Registrar el log de lectura
    await createLog(
      ActionType.READ,
      'Sensor',
      sensor.id,
      userId,
      `Lectura del sensor con ID ${sensor.id}`
    );

    return NextResponse.json(sensor);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener el sensor', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const data = await request.json();
    const updatedSensor = await db.sensor.update({
      where: { id: Number(params.id) },
      data,
    });

    // Registrar el log de actualización
    await createLog(
      ActionType.UPDATE,
      'Sensor',
      updatedSensor.id,
      userId,
      JSON.stringify(data)
    );

    return NextResponse.json(updatedSensor);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar el sensor', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    await db.sensor.delete({
      where: { id: Number(params.id) },
    });

    // Registrar el log de eliminación
    await createLog(
      ActionType.DELETE,
      'Sensor',
      Number(params.id),
      userId,
      `Eliminación del sensor con serialNumber ${params.id}`
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar el sensor', { status: 500 });
  }
}
