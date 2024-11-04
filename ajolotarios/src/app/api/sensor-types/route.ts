// src/app/api/sensor-types/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Asegúrate de que esta ruta es correcta

export async function POST(req: Request) {
  try {
    const { name, magnitude } = await req.json();

    // Validar que ambos campos estén presentes
    if (!name || !magnitude) {
      return NextResponse.json(
        { error: 'Nombre y magnitud son requeridos' },
        { status: 400 }
      );
    }

    // Crear el nuevo SensorType
    const createdType = await db.sensorType.create({
      data: { name, magnitude },
    });

    return NextResponse.json(createdType, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear SensorType:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}