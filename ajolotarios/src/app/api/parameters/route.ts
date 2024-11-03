// app/api/parameters/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Manejar GET para obtener todos los parámetros
export async function GET() {
  try {
    const parameters = await db.parameter.findMany();
    return NextResponse.json(parameters);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los parámetros' }, { status: 500 });
  }
}

// Manejar POST para crear un nuevo parámetro
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const newParameter = await db.parameter.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(newParameter, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear el parámetro' }, { status: 500 });
  }
}
