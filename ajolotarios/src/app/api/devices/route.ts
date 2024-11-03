// app/api/devices/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'


export async function GET() {
  try {
    const devices = await db.device.findMany({
      include: {
        sensors: true,
      },
    });
    return NextResponse.json(devices);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los dispositivos', { status: 500 });
  }
}
