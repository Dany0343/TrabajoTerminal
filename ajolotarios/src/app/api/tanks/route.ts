// app/api/tanks/route.ts

import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ajolotaryIdParam = searchParams.get('ajolotaryId');

    // Construir el objeto 'where' para la consulta
    const where: any = {};
    if (ajolotaryIdParam) {
      const ajolotaryId = Number(ajolotaryIdParam);
      if (!isNaN(ajolotaryId)) {
        where.ajolotaryId = ajolotaryId;
      }
    }

    const tanks = await db.tank.findMany({
      where,
      include: {
        ajolotary: true, // Incluye datos del ajolotario relacionado
      },
    });
    return NextResponse.json(tanks);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al obtener los tanques', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, capacity, observations, status, ajolotaryId } = data;

    // Validación de campos requeridos
    if (!name || !capacity || !ajolotaryId) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const tank = await db.tank.create({
      data: {
        name,
        capacity,
        observations,
        status,
        ajolotaryId,
      },
      include: {
        ajolotary: true, // Incluir datos del ajolotario relacionado en la respuesta
      },
    });

    return NextResponse.json(tank, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error al crear el tanque', { status: 500 });
  }
}
