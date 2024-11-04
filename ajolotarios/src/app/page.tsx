// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Bell, Plus, Edit, Activity, Thermometer, Droplet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/LoadingSpinner' 
import ParameterTrendsChart from '@/components/ParameterTrendsChart'

import { Ajolotary, Tank, Axolotl, Alert } from '@/types'

const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <LoadingSpinner /> })

export default function Dashboard() {
  const [ajolotaries, setAjolotaries] = useState<Ajolotary[]>([])
  const [tanks, setTanks] = useState<Tank[]>([])
  const [axolotls, setAxolotls] = useState<Axolotl[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ajolotariesRes, tanksRes, axolotlsRes, alertsRes] = await Promise.all([
          fetch('/api/ajolotaries'),
          fetch('/api/tanks'),
          fetch('/api/axolotls'),
          fetch('/api/alerts')
        ])

        if (!ajolotariesRes.ok || !tanksRes.ok || !axolotlsRes.ok || !alertsRes.ok) {
          throw new Error('Error al obtener los datos')
        }

        const [ajolotariesData, tanksData, axolotlsData, alertsData] = await Promise.all([
          ajolotariesRes.json(),
          tanksRes.json(),
          axolotlsRes.json(),
          alertsRes.json()
        ])

        setAjolotaries(ajolotariesData)
        setTanks(tanksData)
        setAxolotls(axolotlsData)
        setAlerts(alertsData)
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const activeTanks = tanks.filter(tank => tank.status === 'ACTIVE')
  const criticalAlerts = alerts.filter(alert => alert.priority === 'HIGH' && alert.status === 'PENDING')

  // Datos de ejemplo para el gráfico (puedes eliminarlos cuando tengas datos reales)
  const sampleMeasurements = [
    { dateTime: '2024-01-01T00:00:00Z', value: 20, parameterName: 'Temperatura' },
    { dateTime: '2024-01-02T00:00:00Z', value: 21, parameterName: 'Temperatura' },
    { dateTime: '2024-01-03T00:00:00Z', value: 19, parameterName: 'Temperatura' },
  ]

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Instalaciones</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ajolotaries.length}</div>
              <p className="text-xs text-muted-foreground">Ajolotarios registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tanques Activos</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTanks.length}</div>
              <p className="text-xs text-muted-foreground">De {tanks.length} tanques totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ajolotes Registrados</CardTitle>
              <Avatar className="h-4 w-4">
                <AvatarImage src="/placeholder.svg" alt="Ajolote" />
                <AvatarFallback>AX</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{axolotls.length}</div>
              <p className="text-xs text-muted-foreground">Ajolotes en el sistema</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
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
              {/* Usa datos de ejemplo mientras desarrollas */}
              <ParameterTrendsChart parameterName="Temperatura" measurements={sampleMeasurements} />
              {/* Cuando tengas datos reales, reemplaza sampleMeasurements con los datos reales */}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Mapa de Instalaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Map ajolotaries={ajolotaries} />
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
                    <span className="text-xs text-muted-foreground">{alert.status}</span>
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
                      <AvatarImage src="/placeholder.svg" alt="Ajolote" />
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
