// app/api/axolotls/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

// logging
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const axolotl = await db.axolotl.findUnique({
      where: { id: Number(params.id) },
      include: {
        tank: true,
      },
    });
    if (!axolotl) {
      return new NextResponse('Ajolote no encontrado', { status: 404 });
    }

    // Registrar el log de lectura
    await createLog(
      ActionType.READ,
      'Axolotl',
      axolotl.id,
      userId,
      `Lectura del ajolote con ID ${axolotl.id}`
    );

    return NextResponse.json(axolotl);
  } catch (error) {
    return new NextResponse('Error al obtener el ajolote', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const data = await request.json();
    const updatedAxolotl = await db.axolotl.update({
      where: { id: Number(params.id) },
      data: {
        ...data,
        size: data.size ? Number(data.size) : undefined,
        weight: data.weight ? Number(data.weight) : undefined
      },
    });

    // Registrar el log de actualización
    await createLog(
      ActionType.UPDATE,
      'Axolotl',
      updatedAxolotl.id,
      userId,
      JSON.stringify(data)
    );

    return NextResponse.json(updatedAxolotl);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar el ajolote', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    await db.axolotl.delete({
      where: { id: Number(params.id) },
    });

    // Registrar el log de eliminación
    await createLog(
      ActionType.DELETE,
      'Axolotl',
      Number(params.id),
      userId,
      `Eliminación del ajolote con ID ${params.id}`
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Error al eliminar el ajolote', { status: 500 });
  }
}