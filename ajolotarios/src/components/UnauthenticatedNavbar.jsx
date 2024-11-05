// components/UnauthenticatedNavbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from 'lucide-react'; // Importar iconos de menú y cierre

const UnauthenticatedNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logoAjolotarios.jpeg"
            width={50}
            height={50}
            alt="Company's logo"
            className="rounded-lg"
          />
          <p className="text-xl font-semibold ml-2">AjoloApp</p>
        </Link>

        {/* Enlaces de Navegación para Pantallas Grandes */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="font-semibold text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link href="/auth/login" className="font-semibold text-gray-700 hover:text-gray-900">
            Iniciar sesión
          </Link>
          <Link href="/auth/register" className="font-semibold text-gray-700 hover:text-gray-900">
            Registrarse
          </Link>
        </nav>

        {/* Botón de Menú Hamburguesa para Pantallas Pequeñas */}
        <button
          className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú de Navegación Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 px-4 py-3">
            <Link
              href="/"
              className="font-semibold text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
            >
              Home
            </Link>
            <Link
              href="/auth/login"
              className="font-semibold text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="font-semibold text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Registrarse
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default UnauthenticatedNavbar;
