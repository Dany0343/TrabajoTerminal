// src/app/api/sensor-types/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, magnitude } = await req.json();
    if (!name || !magnitude) {
      return NextResponse.json(
        { error: 'Nombre y magnitud son requeridos' },
        { status: 400 }
      );
    }
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

// Agregar el método GET
export async function GET() {
  try {
    // Obtener todos los tipos de sensores
    const sensorTypes = await db.sensorType.findMany({
      orderBy: {
        id: 'asc', // Ordenar por ID de forma ascendente
      },
    });
    
    return NextResponse.json(sensorTypes);
  } catch (error: any) {
    console.error('Error al obtener SensorTypes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Agregar el método PUT
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const data = await request.json();
  const { name, magnitude } = data;
  if (!name || !magnitude) {
    return new NextResponse(
      'Nombre y magnitud son requeridos',
      { status: 400 }
    );
  }
  const updatedType = await db.sensorType.update({
    where: { id },
    data: { name, magnitude },
  });
  return NextResponse.json(updatedType);
}