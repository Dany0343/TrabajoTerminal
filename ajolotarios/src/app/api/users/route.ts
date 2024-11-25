// app/api/users/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

// logging 
import { createLog } from '@/lib/logger';
import { ActionType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const users = await db.user.findMany();

    // Registrar el log de lectura masiva
    await createLog(
      ActionType.READ,
      'User',
      undefined,
      userId,
      `Lectura masiva de usuarios`
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json('Error al obtener los usuarios', { status: 500 });
  }
}
