'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, AlertTriangle, Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Alert = {
  id: number
  message: string
  severity: 'Baja' | 'Media' | 'Alta'
  date: string
  tank: string
  status: 'Activa' | 'Resuelta'
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, message: 'Temperatura alta en Tanque A', severity: 'Alta', date: '2024-03-10', tank: 'Tanque A', status: 'Activa' },
    { id: 2, message: 'Nivel de pH bajo en Tanque B', severity: 'Media', date: '2024-03-09', tank: 'Tanque B', status: 'Activa' },
    { id: 3, message: 'Nivel de oxígeno bajo en Tanque C', severity: 'Baja', date: '2024-03-08', tank: 'Tanque C', status: 'Resuelta' },
  ])
  const [newAlert, setNewAlert] = useState<Omit<Alert, 'id'>>({ message: '', severity: 'Baja', date: '', tank: '', status: 'Activa' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const addOrUpdateAlert = () => {
    if (isEditing && editingId !== null) {
      setAlerts(alerts.map(alert => alert.id === editingId ? { ...newAlert, id: editingId } : alert))
      setIsEditing(false)
      setEditingId(null)
    } else {
      setAlerts([...alerts, { ...newAlert, id: alerts.length + 1 }])
    }
    setNewAlert({ message: '', severity: 'Baja', date: '', tank: '', status: 'Activa' })
  }

  const startEditing = (alert: Alert) => {
    setNewAlert(alert)
    setIsEditing(true)
    setEditingId(alert.id)
  }

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'Baja': return 'bg-green-500'
      case 'Media': return 'bg-yellow-500'
      case 'Alta': return 'bg-red-500'
    }
  }

  const getStatusColor = (status: Alert['status']) => {
    return status === 'Activa' ? 'bg-blue-500' : 'bg-gray-500'
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Alertas</CardTitle>
          <CardDescription>Monitorea y administra las alertas del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Baja', 'Media', 'Alta'].map((severity) => (
              <Card key={severity}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className={`mr-2 h-5 w-5 ${getSeverityColor(severity as Alert['severity'])}`} />
                    Alertas {severity}s
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {alerts.filter(alert => alert.severity === severity && alert.status === 'Activa').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Alertas activas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Alertas</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {isEditing ? 'Editar Alerta' : 'Agregar Alerta'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Alerta' : 'Agregar Nueva Alerta'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">Mensaje</Label>
                <Input
                  id="message"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">Severidad</Label>
                <Select onValueChange={(value) => setNewAlert({...newAlert, severity: value as Alert['severity']})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona la severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAlert.date}
                  onChange={(e) => setNewAlert({...newAlert, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tank" className="text-right">Tanque</Label>
                <Input
                  id="tank"
                  value={newAlert.tank}
                  onChange={(e) => setNewAlert({...newAlert, tank: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Estado</Label>
                <Select onValueChange={(value) => setNewAlert({...newAlert, status: value as Alert['status']})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Resuelta">Resuelta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addOrUpdateAlert}>{isEditing ? 'Actualizar Alerta' : 'Agregar Alerta'}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mensaje</TableHead>
            <TableHead>Severidad</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tanque</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.message}</TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                  {alert.severity}
                </Badge>
              </TableCell>
              <TableCell>{alert.date}</TableCell>
              <TableCell>{alert.tank}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(alert.status)} text-white`}>
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEditing(alert)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteAlert(alert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}