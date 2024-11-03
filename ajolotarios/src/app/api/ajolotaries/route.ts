// app/api/ajolotaries/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const ajolotaries = await db.ajolotary.findMany({
      include: {
        users: true,
        tanks: true,
      },
    });
    return NextResponse.json(ajolotaries);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los ajolotarios', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, location, description, permitNumber, active } = data;

    // Validación de campos requeridos
    if (!name || !location || !description || !permitNumber) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const ajolotary = await db.ajolotary.create({
      data: {
        name,
        location,
        description,
        permitNumber,
        active: active ?? true, // Por defecto es true si no se proporciona
      },
    });

    return NextResponse.json(ajolotary, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el ajolotario', { status: 500 });
  }
}
