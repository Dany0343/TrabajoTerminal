// app/api/sensors/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sensor = await db.sensor.findUnique({
      where: { id: Number(params.id) },
      include: {
        device: true,
        type: true,
        status: true,
        measurements: true,
      },
    });
    if (!sensor) {
      return new NextResponse('Sensor no encontrado', { status: 404 });
    }
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
  try {
    const data = await request.json();
    const updatedSensor = await db.sensor.update({
      where: { id: Number(params.id) },
      data,
    });
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
  try {
    await db.sensor.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar el sensor', { status: 500 });
  }
}
