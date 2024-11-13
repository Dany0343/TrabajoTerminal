// app/api/alerts/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await db.alert.findUnique({
      where: { id: Number(params.id) },
      include: {
        measurement: {
          include: {
            device: true,
            sensor: {
              include: {
                type: true,
              },
            },
          },
        },
        resolver: true,
      },
    });
    if (!alert) {
      return new NextResponse('Alerta no encontrada', { status: 404 });
    }
    return NextResponse.json(alert);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener la alerta', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const {
      measurementId,
      alertType,
      description,
      priority,
      status,
      resolvedAt,
      resolvedBy,
      notes,
    } = data;

    // Validación de campos requeridos
    if (
      !measurementId ||
      !alertType ||
      !description ||
      !priority
    ) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    // Validación adicional si el estado es RESOLVED
    if (status === 'RESOLVED' && !resolvedBy) {
      return new NextResponse('resolvedBy es requerido cuando el estado es RESOLVED', { status: 400 });
    }

    // Si el estado se está cambiando a activo, verificar si ya existe otra alerta activa
    if (status !== 'RESOLVED') {
      const existingActiveAlert = await db.alert.findFirst({
        where: {
          measurementId: measurementId,
          status: {
            in: ['PENDING', 'ACKNOWLEDGED', 'ESCALATED'],
          },
          id: {
            not: Number(params.id),
          },
        },
      });

      if (existingActiveAlert) {
        return new NextResponse('Ya existe otra alerta activa para esta medición.', { status: 400 });
      }
    }

    const updatedAlert = await db.alert.update({
      where: { id: Number(params.id) },
      data: {
        measurementId,
        alertType,
        description,
        priority,
        status,
        resolvedAt: resolvedAt ? new Date(resolvedAt) : undefined,
        resolvedBy,
        notes,
      },
      include: {
        measurement: {
          include: {
            device: true,
            sensor: {
              include: {
                type: true,
              },
            },
          },
        },
        resolver: true,
      },
    });
    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar la alerta', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.alert.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar la alerta', { status: 500 });
  }
}
