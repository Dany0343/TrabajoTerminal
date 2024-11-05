// components/AuthenticatedHeader.jsx
"use client";

import { useState } from 'react';
import Image from "next/image";
import { Bell, MessageSquare, User, LogOut, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

const AuthenticatedHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        {/* Sección de Logo y Navegación en Pantallas Grandes */}
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Image
              src="/logoAjolotarios.jpeg"
              width={30}
              height={30}
              alt="Double point"
            />
            <span className="hidden font-bold sm:inline-block">AjoloApp</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
              Inicio
            </Link>
            <Link href="/ajolotaries" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Ajolotarios
            </Link>
            <Link href="/tanks" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Tanques
            </Link>
            <Link href="/axolotls" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Ajolotes
            </Link>
            <Link href="/alerts" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Alertas
            </Link>
            <Link href="/measurements" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Medidas
            </Link>
            <Link href="/sensors" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Sensores
            </Link>
          </nav>
        </div>

        {/* Botones y Avatar */}
        <div className="flex items-center space-x-2">
          {/* Botón de Notificaciones */}
          <Button size="icon" variant="ghost" className="hidden md:inline-flex">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificaciones</span>
          </Button>

          {/* Menú Hamburguesa para Pantallas Pequeñas */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Abrir menú de navegación"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>

          {/* Dropdown de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@usuario" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Usuario</p>
                  <p className="text-xs leading-none text-muted-foreground">usuario@ejemplo.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/api/auth/signout" className="flex w-full items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay para cerrar el menú al hacer clic fuera */}
          <div
            className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
            onClick={toggleMobileMenu}
          ></div>

          {/* Menú Desplegable con Animaciones */}
          <div
            className={`md:hidden fixed top-14 left-0 w-full bg-background border-b z-40 transform ${
              isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            } transition-transform duration-300`}
          >
            <nav className="flex flex-col space-y-2 p-4">
              <Link
                href="/"
                className="transition-colors hover:text-foreground/80 text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/ajolotaries"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ajolotarios
              </Link>
              <Link
                href="/tanks"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tanques
              </Link>
              <Link
                href="/axolotls"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ajolotes
              </Link>
              <Link
                href="/alerts"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Alertas
              </Link>
              <Link
                href="/measurements"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Medidas
              </Link>
              <Link
                href="/sensors"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sensores
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default AuthenticatedHeader;
