// app/api/tanks/[id]/route.ts

import { NextResponse } from 'next/server';
import db from "@/lib/db";

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const tank = await db.tank.findUnique({
      where: { id: Number(params.id) },
      include: {
        ajolotary: true,
      },
    });
    if (!tank) {
      return new NextResponse('Tanque no encontrado', { status: 404 });
    }

    // Registrar el log de lectura
    await createLog(
      ActionType.READ,
      'Tank',
      tank.id,
      userId,
      `Lectura del tanque con ID ${tank.id}`
    );

    return NextResponse.json(tank);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener el tanque', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const data = await request.json();
    const updatedTank = await db.tank.update({
      where: { id: Number(params.id) },
      data,
      include: {
        ajolotary: true, // Incluir datos del ajolotario relacionado en la respuesta
      },
    });

    // Registrar el log de actualización
    await createLog(
      ActionType.UPDATE,
      'Tank',
      updatedTank.id,
      userId,
      JSON.stringify(data)
    );

    return NextResponse.json(updatedTank);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar el tanque', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    await db.tank.delete({
      where: { id: Number(params.id) },
    });

    // Registrar el log de eliminación
    await createLog(
      ActionType.DELETE,
      'Tank',
      Number(params.id),
      userId,
      `Eliminación del tanque con ID ${params.id}`
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar el tanque', { status: 500 });
  }
}
