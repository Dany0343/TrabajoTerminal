// app/api/sensor-statuses/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'

export async function GET() {
  try {
    const sensorStatuses = await db.sensorStatus.findMany();
    return NextResponse.json(sensorStatuses);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los estados de sensor', { status: 500 });
  }
}
