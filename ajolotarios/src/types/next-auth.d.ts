// src/types/next-auth.d.ts

import NextAuth from "next-auth";
import { Role } from "./types"; 

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      role: Role; // Añade la propiedad 'role'
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    role: Role; // Añade la propiedad 'role'
  }
}
