// src/app/dashboard/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { Bell, FileText, Thermometer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/LoadingSpinner' 
import AjolotarySelector from '@/components/AjolotarySelector'
import MeasurementHistory from '@/components/MeasurementHistory'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import useSWR from 'swr'

import { Ajolotary, Tank, Axolotl, Alert, Measurement } from '@/types'

// Dynamically import the Map component with no SSR and a loading spinner
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false, 
  loading: () => <LoadingSpinner /> 
})

// Definir un fetcher para SWR
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error(`Error al fetch: ${res.statusText}`)
  }
  return res.json()
})

export default function Dashboard() {
  // Estados para la selección de Ajolotary
  const [selectedAjolotary, setSelectedAjolotary] = useState<Ajolotary | null>(null)

  // Utilizar SWR para cada fuente de datos
  const { data: ajolotariesData, error: ajolotariesError } = useSWR<Ajolotary[]>('/api/ajolotaries', fetcher)
  const { data: tanksData, error: tanksError } = useSWR<Tank[]>('/api/tanks', fetcher)
  const { data: axolotlsData, error: axolotlsError } = useSWR<Axolotl[]>('/api/axolotls', fetcher)
  
  // Para alerts y measurements, usamos SWR con parámetros para obtener todos los datos necesarios
  // Puedes ajustar el limit según tus necesidades
  const { data: alertsResponse, error: alertsError } = useSWR<{ data: Alert[]; total: number; page: number; totalPages: number }>('/api/alerts?page=1&limit=1000', fetcher)
  const { data: measurementsResponse, error: measurementsError } = useSWR<{ data: Measurement[]; total: number; page: number; totalPages: number }>('/api/measurements?page=1&limit=1000', fetcher)

  // Manejo de errores de cualquier SWR
  const error = ajolotariesError || tanksError || axolotlsError || alertsError || measurementsError

  // Manejo de loading: cuando cualquiera de los SWR está cargando
  const isLoading = !ajolotariesData || !tanksData || !axolotlsData || !alertsResponse || !measurementsResponse

  // Extraer los datos de alerts y measurements
  const alerts = alertsResponse?.data || []
  const measurements = measurementsResponse?.data || []

  // Filtrar tanques activos
  const activeTanks = useMemo(() => tanksData?.filter(tank => tank.status === 'ACTIVE') || [], [tanksData])

  // Filtrar alertas críticas
  const criticalAlerts = useMemo(() => alerts.filter(alert => alert.priority === 'HIGH' && alert.status === 'PENDING'), [alerts])

  // Filtrar mediciones según la instalación seleccionada
  const filteredMeasurements = useMemo(() => {
    if (selectedAjolotary) {
      return measurements.filter(m => m.device.tank.ajolotaryId === selectedAjolotary.id)
    }
    return measurements
  }, [selectedAjolotary, measurements])

  // Función para generar PDF
  const generatePDF = async () => {
    const input = document.getElementById('report-content') // Captura solo esta sección

    if (!input) {
      alert('No se encontró el contenido para el informe.')
      return
    }

    const doc = new jsPDF('p', 'pt', 'a4')

    await html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const imgProps = doc.getImageProperties(imgData)
      const pdfWidth = doc.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    })

    // Fecha de hoy
    const today = new Date()
    const nombreArchivo = `informe-ajolotarios-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.pdf`

    doc.save(nombreArchivo)
  }

  // Manejo de estados de carga y errores
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message || 'Error desconocido'}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

        {/* Selector de Instalaciones */}
        <AjolotarySelector 
          ajolotaries={ajolotariesData} 
          onSelect={setSelectedAjolotary} 
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Instalaciones</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ajolotariesData.length}</div>
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
              <p className="text-xs text-muted-foreground">De {tanksData.length} tanques totales</p>
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
              <div className="text-2xl font-bold">{axolotlsData.length}</div>
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

        {/* Histórico de Mediciones */}
        <div id="report-content">
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Mediciones</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMeasurements.length > 0 ? (
                  <MeasurementHistory measurements={filteredMeasurements} />
                ) : (
                  <div className="text-center text-muted">No hay mediciones disponibles.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
          <Card className="col-span-7">
            <CardHeader>
              <CardTitle>Mapa de Instalaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Map ajolotaries={selectedAjolotary ? [selectedAjolotary] : ajolotariesData} />
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
              {criticalAlerts.length > 0 ? (
                <div className="space-y-4">
                  {criticalAlerts.slice(0, 3).map(alert => (
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
              ) : (
                <div className="text-center text-muted">No hay alertas recientes.</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start flex items-center" 
                  onClick={() => generatePDF()}
                >
                  <FileText className="mr-2 h-4 w-4" />
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
              {tanksData.length > 0 ? (
                <div className="space-y-4">
                  {tanksData.slice(0, 3).map(tank => (
                    <div key={tank.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{tank.name}</h3>
                        <p className="text-sm text-muted-foreground">Capacidad: {tank.capacity}L</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">No hay tanques destacados.</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ajolotes Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              {axolotlsData.length > 0 ? (
                <div className="space-y-4">
                  {axolotlsData.slice(0, 3).map(axolotl => (
                    <div key={axolotl.id} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="Ajolote" />
                        <AvatarFallback>AX</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{axolotl.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Edad: {axolotl.age} años | Salud: {axolotl.health}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">No hay ajolotes destacados.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              © 2024 AjoloApp. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
