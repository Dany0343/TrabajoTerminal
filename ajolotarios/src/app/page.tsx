'use client'

import { useEffect, useState } from 'react'
import { Bell, MessageSquare, User, LogOut, Settings, HelpCircle, Plus, Edit, Activity, Thermometer, Droplet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface Ajolotary {
  id: number
  name: string
  location: string
}

interface Tank {
  id: number
  name: string
  capacity: number
  status: string
}

interface Axolotl {
  id: number
  name: string
  age: number
  health: string
}

interface Alert {
  id: number
  alertType: string
  description: string
  priority: string
  status: string
}

export default function Dashboard() {
  const [ajolotaries, setAjolotaries] = useState<Ajolotary[]>([])
  const [tanks, setTanks] = useState<Tank[]>([])
  const [axolotls, setAxolotls] = useState<Axolotl[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ajolotariesRes, tanksRes, axolotlsRes, alertsRes] = await Promise.all([
          fetch('/api/ajolotaries'),
          fetch('/api/tanks'),
          fetch('/api/axolotls'),
          fetch('/api/alerts')
        ])

        const ajolotariesData = await ajolotariesRes.json()
        const tanksData = await tanksRes.json()
        const axolotlsData = await axolotlsRes.json()
        const alertsData = await alertsRes.json()

        setAjolotaries(ajolotariesData)
        setTanks(tanksData)
        setAxolotls(axolotlsData)
        setAlerts(alertsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const activeTanks = tanks.filter(tank => tank.status === 'ACTIVE')
  const criticalAlerts = alerts.filter(alert => alert.priority === 'HIGH' && alert.status === 'PENDING')

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
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
              <div className="text-2xl font-bold">{ajolotaries.length}</div>
              <p className="text-xs text-muted-foreground">Ajolotarios registrados</p>
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
              <div className="text-2xl font-bold">{activeTanks.length}</div>
              <p className="text-xs text-muted-foreground">De {tanks.length} tanques totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ajolotes Registrados</CardTitle>
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
              <div className="text-2xl font-bold">{axolotls.length}</div>
              <p className="text-xs text-muted-foreground">Ajolotes en el sistema</p>
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
              <div className="text-2xl font-bold">{criticalAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Alertas críticas pendientes</p>
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
                  Gráfico de Tendencias (Implementar con datos reales)
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
                  Mapa Interactivo (Implementar con ubicaciones reales)
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
                {alerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      alert.priority === 'HIGH' ? 'bg-red-500' :
                      alert.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="flex-1">{alert.description}</span>
                    <span className="text-muted-foreground">{alert.status}</span>
                  </div>
                ))}
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

        {/* Featured Tanks and Ajolotes */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Tanques Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tanks.slice(0, 3).map(tank => (
                  <div key={tank.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{tank.name}</h3>
                      <p className="text-sm text-muted-foreground">Capacidad: {tank.capacity}L</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span>--°C</span>
                      <Droplet className="h-4 w-4 text-muted-foreground" />
                      <span>pH --</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ajolotes Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {axolotls.slice(0, 3).map(axolotl => (
                  <div key={axolotl.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Ajolote" />
                      <AvatarFallback>AX</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{axolotl.name}</h3>
                      <p className="text-sm text-muted-foreground">Edad: {axolotl.age} años | Salud: {axolotl.health}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              © 2024 Sistema de Monitoreo de Ajolotes. Todos los derechos reservados.
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