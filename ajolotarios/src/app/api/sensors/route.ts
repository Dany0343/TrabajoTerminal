// app/api/sensors/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'


export async function GET() {
  try {
    const sensors = await db.sensor.findMany({
      include: {
        type: true,
        status: true,
        device: true,
      },
    });
    return NextResponse.json(sensors);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los sensores', { status: 500 });
  }
}
