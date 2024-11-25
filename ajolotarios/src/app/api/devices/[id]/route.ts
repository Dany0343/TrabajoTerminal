// app/api/devices/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const { name, serialNumber, tankId } = await request.json();

    // Validaciones básicas
    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    if (!serialNumber) {
      return NextResponse.json({ error: 'El número de serie es obligatorio' }, { status: 400 });
    }
    if (!tankId) {
      return NextResponse.json({ error: 'El ID del tanque es obligatorio' }, { status: 400 });
    }

    // Verificar si el tanque existe
    const tankExists = await db.tank.findUnique({ where: { id: tankId } });
    if (!tankExists) {
      return NextResponse.json({ error: 'Tanque no encontrado' }, { status: 404 });
    }

    // Actualizar el dispositivo
    const updatedDevice = await db.device.update({
      where: { id: Number(id) },
      data: {
        name,
        serialNumber,
        tank: {
          connect: { id: tankId },
        },
      },
      include: {
        tank: true, // Incluir información del tanque en la respuesta
      },
    });

    // Registrar el log de actualización
    await createLog(
      ActionType.UPDATE,
      'Device',
      updatedDevice.id,
      userId,
      JSON.stringify({ name, serialNumber, tankId })
    );

    return NextResponse.json(updatedDevice, { status: 200 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') { // Error de unicidad en Prisma
      return NextResponse.json({ error: 'El número de serie ya existe' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al actualizar el dispositivo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    await db.device.delete({
      where: { id: Number(id) },
    });
    // Registrar el log de eliminación
     await createLog(
      ActionType.DELETE,
      'Device',
      Number(id),
      userId,
      `Eliminación del dispositivo con serialNumber ${id}`
    );

    return NextResponse.json({ message: 'Dispositivo eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar el dispositivo' }, { status: 500 });
  }
}
