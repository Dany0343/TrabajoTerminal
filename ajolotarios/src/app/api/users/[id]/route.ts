// app/api/users/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

// logging 
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
    const user = await db.user.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (user) {

      // Registrar el log de lectura
      await createLog(
        ActionType.READ,
        'User',
        user.id,
        userId,
        `Lectura de los datos del usuario con ID ${user.id}`
      );

      return NextResponse.json(user);
    } else {
      return new NextResponse('Usuario no encontrado', { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los datos del usuario', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const body = await request.json();
    const { role } = body;

    const updatedUser = await db.user.update({
      where: { id: Number(params.id) },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    // Registrar el log de actualización
    await createLog(
      ActionType.UPDATE,
      'User',
      updatedUser.id,
      userId,
      `Actualización del rol del usuario a ${role}`
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar el usuario', { status: 500 });
  }
}
