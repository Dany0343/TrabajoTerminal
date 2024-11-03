// app/api/axolotls/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';


export async function GET(request: Request, { params }: { params: { id: string } }) {
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
    return NextResponse.json(axolotl);
  } catch (error) {
    return new NextResponse('Error al obtener el ajolote', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedAxolotl = await db.axolotl.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updatedAxolotl);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar el ajolote', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.axolotl.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Error al eliminar el ajolote', { status: 500 });
  }
}