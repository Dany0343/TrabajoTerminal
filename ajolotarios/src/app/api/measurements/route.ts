// app/api/measurements/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const measurements = await db.measurement.findMany();
    return NextResponse.json(measurements);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener las mediciones', { status: 500 });
  }
}
