import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        const userFound = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!userFound) throw new Error("No user found");
        console.log(userFound);
        const matchPassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );
        if (!matchPassword) throw new Error("Wrong password");
        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
          role: userFound.role, // Asegúrate de incluir el campo 'role' si lo necesitas
          // Incluye otros campos que necesites
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Cuando el usuario inicia sesión, agrega información adicional al token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name; // Ya está incluido por defecto, pero lo aseguramos
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Incluye los datos adicionales en la sesión
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
