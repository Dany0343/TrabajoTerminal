// app/api/parameters/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Manejar GET para obtener todos los parámetros
export async function GET() {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const parameters = await db.parameter.findMany();

    // Registrar el log de lectura masiva
    await createLog(
      ActionType.READ,
      'Parameter',
      undefined,
      userId,
      `Lectura masiva de parámetros`
    );

    return NextResponse.json(parameters);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los parámetros' }, { status: 500 });
  }
}

// Manejar POST para crear un nuevo parámetro
export async function POST(request: NextRequest) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const newParameter = await db.parameter.create({
      data: {
        name,
        description,
      },
    });

    // Registrar el log de creación
    await createLog(
      ActionType.CREATE,
      'Parameter',
      newParameter.id,
      userId,
      JSON.stringify({ name, description })
    );

    return NextResponse.json(newParameter, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear el parámetro' }, { status: 500 });
  }
}
