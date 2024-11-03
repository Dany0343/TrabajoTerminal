// app/api/parameters/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'


export async function GET() {
  try {
    const parameters = await db.parameter.findMany();
    return NextResponse.json(parameters);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los parámetros', { status: 500 });
  }
}
