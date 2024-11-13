// app/api/alerts/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const alertType = searchParams.get('alertType');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const measurementId = searchParams.get('measurementId');
    const resolverId = searchParams.get('resolverId');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (alertType) {
      where.alertType = alertType;
    }

    if (priority) {
      where.priority = priority;
    }

    if (status) {
      where.status = status;
    }

    if (measurementId) {
      where.measurementId = Number(measurementId);
    }

    if (resolverId) {
      where.resolvedBy = Number(resolverId);
    }

    const [alerts, total] = await Promise.all([
      db.alert.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      db.alert.count({ where }),
    ]);

    return NextResponse.json({
      data: alerts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
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

    // Verificar si ya existe una alerta activa para la medición
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
