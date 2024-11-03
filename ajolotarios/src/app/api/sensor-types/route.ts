import { NextResponse } from 'next/server';
import db from '@/lib/db'


export async function GET() {
  const sensorTypes = await db.sensorType.findMany();
  return NextResponse.json(sensorTypes);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { name } = data;
  if (!name) {
    return new NextResponse('Nombre es requerido', { status: 400 });
  }
  const createdType = await db.sensorType.create({ data: { name } });
  return NextResponse.json(createdType);
}
