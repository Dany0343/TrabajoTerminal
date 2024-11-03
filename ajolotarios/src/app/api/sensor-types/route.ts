// app/api/sensor-types/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'

export async function GET() {
  try {
    const sensorTypes = await db.sensorType.findMany();
    return NextResponse.json(sensorTypes);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los tipos de sensor', { status: 500 });
  }
}
