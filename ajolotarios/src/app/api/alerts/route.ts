// app/api/alerts/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const alerts = await db.alert.findMany({
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
        resolver: true, // Incluir el resolver
      },
    });
    return NextResponse.json(alerts);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener las alertas', { status: 500 });
  }
}

export async function POST(request: Request) {
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
    if (!measurementId || !alertType || !description || !priority) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    // Validación adicional si el estado es RESOLVED
    if (status === 'RESOLVED' && !resolvedBy) {
      return new NextResponse('resolvedBy es requerido cuando el estado es RESOLVED', { status: 400 });
    }

    // **Nueva Validación: Verificar si ya existe una alerta activa para la medición**
    const existingActiveAlert = await db.alert.findFirst({
      where: {
        measurementId: measurementId,
        status: {
          in: ['PENDING', 'ACKNOWLEDGED', 'ESCALATED'],
        },
      },
    });

    if (existingActiveAlert) {
      return new NextResponse('Ya existe una alerta activa para esta medición.', { status: 400 });
    }

    const alert = await db.alert.create({
      data: {
        measurementId,
        alertType,
        description,
        priority,
        status: status || 'PENDING',
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

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear la alerta', { status: 500 });
  }
}
