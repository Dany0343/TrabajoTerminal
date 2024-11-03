// app/api/axolotls/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';


export async function GET() {
  try {
    const axolotls = await db.axolotl.findMany({
      include: {
        tank: true, // Incluye datos del tanque relacionado
      },
    });
    return NextResponse.json(axolotls);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los ajolotes', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, species, age, health, size, weight, stage, tankId, observations } = data;

    // Validación de campos requeridos
    if (!name || !species || !age || !health || !size || !weight || !stage || !tankId) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const axolotl = await db.axolotl.create({
      data: {
        name,
        species,
        age,
        health,
        size,
        weight,
        stage,
        tankId,
        observations,
      },
    });

    return NextResponse.json(axolotl, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el ajolote', { status: 500 });
  }
}
