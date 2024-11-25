// lib/auth.js

import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db"; // Asegúrate de que esta ruta sea correcta
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        const userFound = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!userFound) throw new Error("No se encontró el usuario");

        const matchPassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );
        if (!matchPassword) throw new Error("Contraseña incorrecta");

        return {
          id: userFound.id,
          name: userFound.username, // Asegúrate de que 'username' exista
          email: userFound.email,
          role: userFound.role, // Incluye 'role'
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Añade 'role' al token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // Añade 'role' a la sesión
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
