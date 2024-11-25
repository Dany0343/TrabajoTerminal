// src/app/layout.tsx
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Providers from "./providers"; // Importa el componente Providers

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ajolotarios",
  description: "Aplicación web para el manejo del sistema de Ajolotes",
  icons: {
    icon: [
      { url: "/ajolotes.png", sizes: "512x512", type: "image/png" },
      { url: "/logoAjolotarios.jpeg", sizes: "192x192", type: "image/jpeg" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/ajolotes.png" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Aplicación de monitoreo de parametros fisicoquimicos para ajolotes"
        />
      </Head>
      <body className={inter.className}>
        <Providers> {/* Envuelve con Providers */}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
