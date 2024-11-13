// app/api/axolotls/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ajolotaryIdParam = searchParams.get('ajolotaryId');

    // Construir el objeto 'where' para la consulta
    const where: any = {};
    if (ajolotaryIdParam) {
      const ajolotaryId = Number(ajolotaryIdParam);
      if (!isNaN(ajolotaryId)) {
        where.tank = {
          ajolotaryId: ajolotaryId,
        };
      }
    }

    const axolotls = await db.axolotl.findMany({
      where,
      include: {
        tank: {
          include: {
            ajolotary: true, // Incluir detalles del ajolotary
          },
        },
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
    if (!name || !species || age === undefined || !health || size === undefined || weight === undefined || !stage || !tankId) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const axolotl = await db.axolotl.create({
      data: {
        name,
        species,
        age,
        health,
        size: Number(size),
        weight: Number(weight),
        stage,
        tankId,
        observations,
      },
      include: {
        tank: {
          include: {
            ajolotary: true,
          },
        },
      },
    });

    return NextResponse.json(axolotl, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el ajolote', { status: 500 });
  }
}
