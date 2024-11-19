// src/app/api/sensor-types/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const data = await request.json();
  const { name, magnitude } = data;

  // Validar que ambos campos estén presentes
  if (!name || !magnitude) {
    return NextResponse.json(
      { error: 'Nombre y magnitud son requeridos' },
      { status: 400 }
    );
  }

  try {
    const updatedType = await db.sensorType.update({
      where: { id },
      data: { name, magnitude },
    });
    return NextResponse.json(updatedType);
  } catch (error: any) {
    console.error('Error al actualizar SensorType:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
