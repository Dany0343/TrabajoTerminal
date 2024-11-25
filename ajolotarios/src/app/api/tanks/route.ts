// app/api/tanks/route.ts

import { NextResponse } from 'next/server';
import db from "@/lib/db";

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const { searchParams } = new URL(request.url);
    const ajolotaryIdParam = searchParams.get('ajolotaryId');

    // Construir el objeto 'where' para la consulta
    const where: any = {};
    if (ajolotaryIdParam) {
      const ajolotaryId = Number(ajolotaryIdParam);
      if (!isNaN(ajolotaryId)) {
        where.ajolotaryId = ajolotaryId;
      }
    }

    const tanks = await db.tank.findMany({
      where,
      include: {
        ajolotary: true, // Incluye datos del ajolotario relacionado
      },
    });

    // Registrar el log de lectura masiva
    await createLog(
      ActionType.READ,
      'Tank',
      undefined,
      userId,
      `Lectura masiva de tanques con filtro ajolotaryId=${ajolotaryIdParam}`
    );

    return NextResponse.json(tanks);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los tanques', { status: 500 });
  }
}

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const data = await request.json();
    const { name, capacity, observations, status, ajolotaryId } = data;

    // Validación de campos requeridos
    if (!name || !capacity || !ajolotaryId) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const tank = await db.tank.create({
      data: {
        name,
        capacity,
        observations,
        status,
        ajolotaryId,
      },
      include: {
        ajolotary: true, // Incluir datos del ajolotario relacionado en la respuesta
      },
    });

    // Registrar el log de creación
    await createLog(
      ActionType.CREATE,
      'Tank',
      tank.id,
      userId,
      JSON.stringify({ name, capacity, observations, status, ajolotaryId })
    );

    return NextResponse.json(tank, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el tanque', { status: 500 });
  }
}
