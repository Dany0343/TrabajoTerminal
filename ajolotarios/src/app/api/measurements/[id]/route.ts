// app/api/measurements/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const measurement = await db.measurement.findUnique({
      where: { id: Number(params.id) },
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
    const {
      deviceId,
      sensorId,
      dateTime,
      isValid,
      parameters,
    } = data;

    // Actualizar la medición
    const updatedMeasurement = await db.measurement.update({
      where: { id: Number(params.id) },
      data: {
        deviceId,
        sensorId,
        dateTime: dateTime ? new Date(dateTime) : undefined,
        isValid,
        // Para actualizar los parámetros, se podrían eliminar los existentes y crear nuevos
        parameters: {
          deleteMany: {}, // Elimina todos los parámetros existentes
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

    return NextResponse.json(updatedMeasurement);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar la medición', { status: 500 });
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
