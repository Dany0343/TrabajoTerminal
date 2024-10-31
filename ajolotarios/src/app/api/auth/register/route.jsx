import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req) {
  const { firstName, lastName, email, password, phone = '' } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const emailExists = await db.user.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAt = new Date();
    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone, // Aquí se utilizará el valor por defecto ('') si no se proporciona
        role: "SUPER_ADMIN", // Cambiar a 'USER' si se desea un rol de usuario normal
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}