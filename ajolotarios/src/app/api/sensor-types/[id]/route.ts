import { NextResponse } from 'next/server';
import db from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const data = await request.json();
  const { name } = data;
  if (!name) {
    return new NextResponse('Nombre es requerido', { status: 400 });
  }
  const updatedType = await db.sensorType.update({
    where: { id },
    data: { name },
  });
  return NextResponse.json(updatedType);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  await db.sensorType.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
