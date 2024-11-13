// app/api/users/[id]/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.user.findUnique({
      where: { id: Number(params.id) },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (user) {
      return NextResponse.json(user);
    } else {
      return new NextResponse('Usuario no encontrado', { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los datos del usuario', { status: 500 });
  }
}
