import { Bell, MessageSquare, User, LogOut, Settings, HelpCircle, Plus, Edit, Activity, Thermometer, Droplet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <img src="/placeholder.svg?height=30&width=30" alt="Logo" className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Axolotl Management System</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a className="transition-colors hover:text-foreground/80 text-foreground" href="/">Inicio</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/instalaciones">Instalaciones</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/tanques">Tanques</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/axolotlis">Axolotlis</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/alertas">Alertas</a>
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
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@usuario" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Instalaciones</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tanques Activos</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">54</div>
              <p className="text-xs text-muted-foreground">+8 desde la última semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Axolotlis Registrados</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">321</div>
              <p className="text-xs text-muted-foreground">+18 este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">3 críticas, 4 medias, 2 bajas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Map */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Tendencias de Parámetros Ambientales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {/* Aquí iría el componente de gráfico real */}
                <div className="flex items-center justify-center h-full bg-muted rounded-md">
                  Gráfico de Tendencias
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Mapa de Instalaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {/* Aquí iría el componente de mapa real */}
                <div className="flex items-center justify-center h-full bg-muted rounded-md">
                  Mapa Interactivo
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Alertas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="flex-1">Temperatura alta en Tanque A1</span>
                  <span className="text-muted-foreground">Hace 5 min</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="flex-1">Nivel de pH fuera de rango en Tanque B3</span>
                  <span className="text-muted-foreground">Hace 20 min</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="flex-1">Mantenimiento programado para Instalación 2</span>
                  <span className="text-muted-foreground">En 2 horas</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Nueva Instalación
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Registrar Nuevo Tanque
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  Generar Informe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Tanks and Axolotls */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Tanques Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Tanque A1</h3>
                    <p className="text-sm text-muted-foreground">Capacidad: 100L</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span>23°C</span>
                    <Droplet className="h-4 w-4 text-muted-foreground" />
                    <span>pH 7.2</span>
                  </div>
                </div>
                <Progress value={80} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Axolotlis Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Axolotl" />
                    <AvatarFallback>AX</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Axolotl #123</h3>
                    <p className="text-sm text-muted-foreground">Edad: 2 años | Salud: Excelente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              © 2023 Axolotl Management System. Todos los derechos reservados.
            </p>
          </div>
          <p className="text-center text-sm md:text-left">
            <a href="#" className="font-medium underline underline-offset-4">Términos</a> |{" "}
            <a href="#" className="font-medium underline underline-offset-4">Privacidad</a> |{" "}
            <a href="#" className="font-medium underline underline-offset-4">Contacto</a>
          </p>
        </div>
      </footer>
    </div>
  )
}