// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "./types"; // Asegúrate de que la ruta sea correcta

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number;
    role: Role;
  }

  interface Session extends DefaultSession {
    user: {
      id: number;
      role: Role;
    } & DefaultSession["user"];
  }
}

export {}; 
