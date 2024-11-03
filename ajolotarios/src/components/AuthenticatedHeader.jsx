// components/AuthenticatedHeader.jsx
"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Bell, MessageSquare, User, LogOut } from 'lucide-react';
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
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null; // O muestra un loader
  }

  if (!session) {
    // Si el usuario no está autenticado, puedes mostrar un header alternativo o redirigir al inicio de sesión
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src="/logoAjolotarios.jpeg" width={30} height={30} alt="Logo" />
              <span className="hidden font-bold sm:inline-block">AjoloApp</span>
            </Link>
          </div>
          <div>
            <Link href="/auth/login" className="text-sm font-medium text-foreground">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Datos del usuario autenticado
  const { user } = session;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logoAjolotarios.jpeg" width={30} height={30} alt="Logo" />
            <span className="hidden font-bold sm:inline-block">AjoloApp</span>
          </Link>
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
            <Link href="/axolots" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Ajolotes
            </Link>
            <Link href="/alerts" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Alertas
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="relative h-8 w-full justify-start text-sm font-normal md:w-40 md:flex">
              <span className="hidden lg:inline-flex">Buscar...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
          <Button size="icon" variant="ghost">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificaciones</span>
          </Button>
          <Button size="icon" variant="ghost">
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Mensajes</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name || user.email} />
                  <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/api/auth/signout" className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;