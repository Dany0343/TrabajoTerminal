// src/app/api/sensor-types/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

     // Registrar el log de creación
    await createLog(
      ActionType.CREATE,
      'SensorType',
      createdType.id,
      userId,
      JSON.stringify({ name, magnitude })
    );

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

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    // Obtener todos los tipos de sensores
    const sensorTypes = await db.sensorType.findMany({
      orderBy: {
        id: 'asc', // Ordenar por ID de forma ascendente
      },
    });

    // Registrar el log de lectura masiva
    await createLog(
      ActionType.READ,
      'SensorType',
      undefined,
      userId,
      `Lectura masiva de tipos de sensores`
    );
    
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

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

  // Registrar el log de actualización
  await createLog(
    ActionType.UPDATE,
    'SensorType',
    updatedType.id,
    userId,
    JSON.stringify({ name, magnitude })
  );

  return NextResponse.json(updatedType);
}