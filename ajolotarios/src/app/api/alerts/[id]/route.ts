// app/api/alerts/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await db.alert.findUnique({
      where: { id: Number(params.id) },
      include: {
        measurement: true,
      },
    });
    if (!alert) {
      return new NextResponse('Alerta no encontrada', { status: 404 });
    }
    return NextResponse.json(alert);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener la alerta', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedAlert = await db.alert.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar la alerta', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.alert.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al eliminar la alerta', { status: 500 });
  }
}
