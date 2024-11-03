// app/api/ajolotaries/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  try {
    const data = await request.json();
    const updatedAjolotary = await db.ajolotary.update({
      where: { id: Number(params.id) },
      data,
    });
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
  try {
    await db.ajolotary.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar el ajolotario', { status: 500 });
  }
}