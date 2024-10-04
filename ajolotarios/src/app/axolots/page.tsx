'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Axolotl = {
  id: number
  name: string
  age: number
  tank: string
  health: 'Excelente' | 'Buena' | 'Regular' | 'Mala'
  color: string
  lastFed: string
}

export default function AxolotlsPage() {
  const [axolotls, setAxolotls] = useState<Axolotl[]>([
    { id: 1, name: 'Axolotl A', age: 2, tank: 'Tanque A', health: 'Excelente', color: 'Rosa', lastFed: '2024-03-10' },
    { id: 2, name: 'Axolotl B', age: 1, tank: 'Tanque B', health: 'Buena', color: 'Blanco', lastFed: '2024-03-09' },
    { id: 3, name: 'Axolotl C', age: 3, tank: 'Tanque A', health: 'Regular', color: 'Negro', lastFed: '2024-03-08' },
  ])
  const [newAxolotl, setNewAxolotl] = useState<Omit<Axolotl, 'id'>>({ name: '', age: 0, tank: '', health: 'Excelente', color: '', lastFed: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const addOrUpdateAxolotl = () => {
    if (isEditing && editingId !== null) {
      setAxolotls(axolotls.map(axolotl => axolotl.id === editingId ? { ...newAxolotl, id: editingId } : axolotl))
      setIsEditing(false)
      setEditingId(null)
    } else {
      setAxolotls([...axolotls, { ...newAxolotl, id: axolotls.length + 1 }])
    }
    setNewAxolotl({ name: '', age: 0, tank: '', health: 'Excelente', color: '', lastFed: '' })
  }

  const startEditing = (axolotl: Axolotl) => {
    setNewAxolotl(axolotl)
    setIsEditing(true)
    setEditingId(axolotl.id)
  }

  const deleteAxolotl = (id: number) => {
    setAxolotls(axolotls.filter(axolotl => axolotl.id !== id))
  }

  const getHealthColor = (health: Axolotl['health']) => {
    switch (health) {
      case 'Excelente': return 'text-green-500'
      case 'Buena': return 'text-blue-500'
      case 'Regular': return 'text-yellow-500'
      case 'Mala': return 'text-red-500'
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Ajolotes</CardTitle>
          <CardDescription>Administra los ajolotes de tu sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {axolotls.slice(0, 3).map((axolotl) => (
              <Card key={axolotl.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${axolotl.name}`} />
                      <AvatarFallback>{axolotl.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{axolotl.name}</CardTitle>
                      <CardDescription>Edad: {axolotl.age} años</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Tanque:</span>
                      <span>{axolotl.tank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Salud:</span>
                      <span className={getHealthColor(axolotl.health)}>{axolotl.health}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Color:</span>
                      <span>{axolotl.color}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Última alimentación:</span>
                      <span>{axolotl.lastFed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Ajolotes</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {isEditing ? 'Editar Ajolote' : 'Agregar Ajolote'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Ajolote' : 'Agregar Nuevo Ajolote'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  value={newAxolotl.name}
                  onChange={(e) => setNewAxolotl({...newAxolotl, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  value={newAxolotl.age}
                  onChange={(e) => setNewAxolotl({...newAxolotl, age: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tank" className="text-right">Tanque</Label>
                <Input
                  id="tank"
                  value={newAxolotl.tank}
                  onChange={(e) => setNewAxolotl({...newAxolotl, tank: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="health" className="text-right">Salud</Label>
                <Select onValueChange={(value) => setNewAxolotl({...newAxolotl, health: value as Axolotl['health']})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona el estado de salud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excelente">Excelente</SelectItem>
                    <SelectItem value="Buena">Buena</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Mala">Mala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">Color</Label>
                <Input
                  id="color"
                  value={newAxolotl.color}
                  onChange={(e) => setNewAxolotl({...newAxolotl, color: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastFed" className="text-right">Última alimentación</Label>
                <Input
                  id="lastFed"
                  type="date"
                  value={newAxolotl.lastFed}
                  onChange={(e) => setNewAxolotl({...newAxolotl, lastFed: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addOrUpdateAxolotl}>{isEditing ? 'Actualizar Ajolote' : 'Agregar Ajolote'}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Tanque</TableHead>
            <TableHead>Salud</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Última alimentación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {axolotls.map((axolotl) => (
            <TableRow key={axolotl.id}>
              <TableCell className="font-medium">{axolotl.name}</TableCell>
              <TableCell>{axolotl.age} años</TableCell>
              <TableCell>{axolotl.tank}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Heart className={`mr-2 h-4 w-4 ${getHealthColor(axolotl.health)}`} />
                  <span>{axolotl.health}</span>
                </div>
              </TableCell>
              <TableCell>{axolotl.color}</TableCell>
              <TableCell>{axolotl.lastFed}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEditing(axolotl)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteAxolotl(axolotl.id)}>
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