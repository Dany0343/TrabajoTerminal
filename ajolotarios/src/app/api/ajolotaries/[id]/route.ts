// app/api/ajolotaries/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Logging
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const ajolotary = await db.ajolotary.findUnique({
      where: { id: Number(params.id) },
      include: {
        users: true,
        tanks: true,
      },
    });
    if (!ajolotary) {
      return new NextResponse('Ajolotario no encontrado', { status: 404 });
    }
    
    // Add log
    await createLog(
      ActionType.READ,
      'Ajolotary',
      ajolotary.id,
      userId,
      `Lectura del ajolotario con ID ${ajolotary.id}`
    );

    return NextResponse.json(ajolotary);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener el ajolotario', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  try {
    const data = await request.json();
    const updatedAjolotary = await db.ajolotary.update({
      where: { id: Number(params.id) },
      data,
    });

    // Registrar el log de actualización
    await createLog(
      ActionType.UPDATE,
      'Ajolotary',
      updatedAjolotary.id,
      userId,
      JSON.stringify(data) // Almacena los cambios como JSON
    );

    return NextResponse.json(updatedAjolotary);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar el ajolotario', { status: 500 });
  }

  
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  try {
    await db.ajolotary.delete({
      where: { id: Number(params.id) },
    });

    // Registrar el log de eliminación
    await createLog(
      ActionType.DELETE,
      'Ajolotary',
      Number(params.id),
      userId,
      `Eliminación del ajolotario con ID ${params.id}`
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar el ajolotario', { status: 500 });
  }
}