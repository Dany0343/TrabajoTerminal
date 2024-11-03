// app/api/parameters/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Obtener el ID desde los parámetros de la ruta
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const updatedParameter = await db.parameter.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedParameter, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar el parámetro' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await db.parameter.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Parámetro eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar el parámetro' }, { status: 500 });
  }
}
