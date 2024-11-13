// app/api/measurements/[id]/route.ts

import { NextResponse } from 'next/server';
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

    // Actualizar la medición
    const updatedMeasurement = await db.measurement.update({
      where: { id: Number(params.id) },
      data: {
        deviceId,
        sensorId,
        dateTime: dateTime ? new Date(dateTime) : undefined,
        isValid,
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
