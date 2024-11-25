// src/app/api/loggs/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { Role } from "@/types/types";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  
  try {
    const where: any = {
      // Exclude READ operations
      action: {
        in: ['CREATE', 'UPDATE', 'DELETE']
      }
    };
    
    // Add other filters
    if (searchParams.get("userId")) where.userId = parseInt(searchParams.get("userId")!);
    if (searchParams.get("action")) where.action = searchParams.get("action");
    if (searchParams.get("entity")) where.entity = searchParams.get("entity");
    
    // Date filters
    if (searchParams.get("startDate") || searchParams.get("endDate")) {
      where.timestamp = {};
      if (searchParams.get("startDate")) where.timestamp.gte = new Date(searchParams.get("startDate")!);
      if (searchParams.get("endDate")) where.timestamp.lte = new Date(searchParams.get("endDate")!);
    }

    const [total, logs] = await Promise.all([
      db.log.count({ where }),
      db.log.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          timestamp: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      })
    ]);

    return NextResponse.json({
      data: logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}