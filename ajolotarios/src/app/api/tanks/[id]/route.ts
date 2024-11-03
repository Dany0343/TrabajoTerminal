// app/api/tanks/[id]/route.ts

import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
    return NextResponse.json(tank);
  } catch (error) {
    return new NextResponse('Error al obtener el tanque', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedTank = await db.tank.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updatedTank);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al actualizar el tanque', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.tank.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Error al eliminar el tanque', { status: 500 });
  }
}
