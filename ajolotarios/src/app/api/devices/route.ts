// app/api/devices/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const devices = await db.device.findMany({
      include: {
        tank: true, // Incluir información del tanque asociado
      },
    });
    return NextResponse.json(devices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los dispositivos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, serialNumber, tankId } = await request.json();

    // Validaciones básicas
    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    if (!serialNumber) {
      return NextResponse.json({ error: 'El número de serie es obligatorio' }, { status: 400 });
    }
    if (!tankId) {
      return NextResponse.json({ error: 'El ID del tanque es obligatorio' }, { status: 400 });
    }

    // Verificar si el tanque existe
    const tankExists = await db.tank.findUnique({ where: { id: tankId } });
    if (!tankExists) {
      return NextResponse.json({ error: 'Tanque no encontrado' }, { status: 404 });
    }

    // Crear el dispositivo
    const newDevice = await db.device.create({
      data: {
        name,
        serialNumber,
        tank: {
          connect: { id: tankId },
        },
      },
      include: {
        tank: true, // Incluir información del tanque en la respuesta
      },
    });

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') { // Error de unicidad en Prisma
      return NextResponse.json({ error: 'El número de serie ya existe' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear el dispositivo' }, { status: 500 });
  }
}
