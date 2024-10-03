// components/AuthenticatedHeader.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import { Bell, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const AuthenticatedHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
            src="/ajolotes.png"
            width={30}
            height={30}
            alt="Double point"
            />
            <span className="hidden font-bold sm:inline-block">
              Sistema de Monitoreo de Ajolotes
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">Inicio</Link>
            <Link href="/instalaciones" className="transition-colors hover:text-foreground/80 text-foreground/60">Instalaciones</Link>
            <Link href="/tanques" className="transition-colors hover:text-foreground/80 text-foreground/60">Tanques</Link>
            <Link href="/axolotlis" className="transition-colors hover:text-foreground/80 text-foreground/60">Ajolotes</Link>
            <Link href="/alertas" className="transition-colors hover:text-foreground/80 text-foreground/60">Alertas</Link>
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
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="@usuario" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
