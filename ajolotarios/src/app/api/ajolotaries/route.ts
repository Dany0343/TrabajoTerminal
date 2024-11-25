// app/api/ajolotaries/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Logging
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const ajolotaries = await db.ajolotary.findMany({
      include: {
        users: true,
        tanks: true,
      },
    });

    // Registrar el log de lectura masiva
    await createLog(
      ActionType.READ,
      'Ajolotary',
      undefined, // No hay un entityId específico
      userId,
      `Lectura de todos los ajolotarios`
    );

    return NextResponse.json(ajolotaries);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los ajolotarios', { status: 500 });
  }
}

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;


  try {
    const data = await request.json();
    const { name, location, description, permitNumber, active } = data;

    // Validación de campos requeridos
    if (!name || !location || !description || !permitNumber) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const ajolotary = await db.ajolotary.create({
      data: {
        name,
        location,
        description,
        permitNumber,
        active: active ?? true, // Por defecto es true si no se proporciona
      },
    });

    // Registrar el log de creación
    await createLog(
      ActionType.CREATE,
      'Ajolotary',
      ajolotary.id,
      userId,
      JSON.stringify(data)
    );

    return NextResponse.json(ajolotary, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el ajolotario', { status: 500 });
  }
}
