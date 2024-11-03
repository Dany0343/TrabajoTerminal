// app/api/users/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los usuarios', { status: 500 });
  }
}
