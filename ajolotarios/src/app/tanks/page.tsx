'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, DropletIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Tank = {
  id: number
  name: string
  capacity: number
  currentOccupancy: number
  temperature: number
  ph: number
}

export default function TanksPage() {
  const [tanks, setTanks] = useState<Tank[]>([
    { id: 1, name: 'Tanque A', capacity: 100, currentOccupancy: 80, temperature: 22, ph: 7.2 },
    { id: 2, name: 'Tanque B', capacity: 150, currentOccupancy: 120, temperature: 23, ph: 7.0 },
    { id: 3, name: 'Tanque C', capacity: 200, currentOccupancy: 150, temperature: 21, ph: 7.5 },
  ])
  const [newTank, setNewTank] = useState<Omit<Tank, 'id'>>({ name: '', capacity: 0, currentOccupancy: 0, temperature: 20, ph: 7.0 })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const addOrUpdateTank = () => {
    if (isEditing && editingId !== null) {
      setTanks(tanks.map(tank => tank.id === editingId ? { ...newTank, id: editingId } : tank))
      setIsEditing(false)
      setEditingId(null)
    } else {
      setTanks([...tanks, { ...newTank, id: tanks.length + 1 }])
    }
    setNewTank({ name: '', capacity: 0, currentOccupancy: 0, temperature: 20, ph: 7.0 })
  }

  const startEditing = (tank: Tank) => {
    setNewTank(tank)
    setIsEditing(true)
    setEditingId(tank.id)
  }

  const deleteTank = (id: number) => {
    setTanks(tanks.filter(tank => tank.id !== id))
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Tanques</CardTitle>
          <CardDescription>Administra los tanques de tu sistema de ajolotes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tanks.slice(0, 3).map((tank) => (
              <Card key={tank.id}>
                <CardHeader>
                  <CardTitle>{tank.name}</CardTitle>
                  <CardDescription>Capacidad: {tank.capacity}L</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Ocupación:</span>
                      <span>{tank.currentOccupancy}L / {tank.capacity}L</span>
                    </div>
                    <Progress value={(tank.currentOccupancy / tank.capacity) * 100} />
                    <div className="flex justify-between items-center">
                      <span>Temperatura:</span>
                      <span>{tank.temperature}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>pH:</span>
                      <span>{tank.ph}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Tanques</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {isEditing ? 'Editar Tanque' : 'Agregar Tanque'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Tanque' : 'Agregar Nuevo Tanque'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  value={newTank.name}
                  onChange={(e) => setNewTank({...newTank, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacidad (L)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newTank.capacity}
                  onChange={(e) => setNewTank({...newTank, capacity: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="occupancy" className="text-right">Ocupación (L)</Label>
                <Input
                  id="occupancy"
                  type="number"
                  value={newTank.currentOccupancy}
                  onChange={(e) => setNewTank({...newTank, currentOccupancy: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={newTank.temperature}
                  onChange={(e) => setNewTank({...newTank, temperature: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ph" className="text-right">pH</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={newTank.ph}
                  onChange={(e) => setNewTank({...newTank, ph: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addOrUpdateTank}>{isEditing ? 'Actualizar Tanque' : 'Agregar Tanque'}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Ocupación Actual</TableHead>
            <TableHead>Temperatura</TableHead>
            <TableHead>pH</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tanks.map((tank) => (
            <TableRow key={tank.id}>
              <TableCell>{tank.name}</TableCell>
              <TableCell>{tank.capacity}L</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DropletIcon className="mr-2 h-4 w-4 text-blue-500" />
                  <span>{tank.currentOccupancy}L</span>
                  <Progress value={(tank.currentOccupancy / tank.capacity) * 100} className="ml-2 w-20" />
                </div>
              </TableCell>
              <TableCell>{tank.temperature}°C</TableCell>
              <TableCell>{tank.ph}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEditing(tank)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteTank(tank.id)}>
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