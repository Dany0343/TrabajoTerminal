// app/api/alerts/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const alerts = await db.alert.findMany({
      include: {
        measurement: true,
        resolver: true,
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

    const alert = await db.alert.create({
      data: {
        measurementId,
        alertType,
        description,
        priority,
        status: status || 'PENDING',
        resolvedAt: resolvedAt ? new Date(resolvedAt) : null,
        resolvedBy,
        notes,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear la alerta', { status: 500 });
  }
}
