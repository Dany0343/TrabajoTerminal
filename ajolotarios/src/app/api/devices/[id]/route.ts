// app/api/devices/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

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

  try {
    await db.device.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Dispositivo eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar el dispositivo' }, { status: 500 });
  }
}
