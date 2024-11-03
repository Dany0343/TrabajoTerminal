// app/api/ajolotaries/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const ajolotaries = await db.ajolotary.findMany();
    return NextResponse.json(ajolotaries);
  } catch (error) {
    return new NextResponse('Error al obtener los ajolotarios', { status: 500 });
  }
}
