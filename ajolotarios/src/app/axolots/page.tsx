'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from '@/components/ui/textarea'

type Axolotl = {
  id: number
  name: string
  species: string
  age: number
  health: 'HEALTHY' | 'SICK' | 'CRITICAL' | 'RECOVERING' | 'QUARANTINE'
  size: number
  weight: number
  stage: 'EGG' | 'LARVAE' | 'JUVENILE' | 'ADULT' | 'BREEDING'
  tankId: number
  tank?: Tank
  observations: string[]
}

type Tank = {
  id: number
  name: string
}

export default function AxolotlsPage() {
  const [axolotls, setAxolotls] = useState<Axolotl[]>([])
  const [tanks, setTanks] = useState<Tank[]>([])
  const [newAxolotl, setNewAxolotl] = useState<Omit<Axolotl, 'id' | 'tank'>>({
    name: '',
    species: '',
    age: 0,
    health: 'HEALTHY',
    size: 0,
    weight: 0,
    stage: 'JUVENILE',
    tankId: 0,
    observations: [],
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Obtener ajolotes
    fetch('/api/axolots')
      .then((res) => res.json())
      .then((data) => setAxolotls(data))
      .catch((error) => console.error(error))

    // Obtener tanques
    fetch('/api/tanks')
      .then((res) => res.json())
      .then((data) => setTanks(data))
      .catch((error) => console.error(error))
  }, [])

  const addOrUpdateAxolotl = async () => {
    if (isEditing && editingId !== null) {
      // Actualizar ajolote
      const response = await fetch(`/api/axolotls/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAxolotl),
      })
      if (response.ok) {
        const updatedAxolotl = await response.json()
        setAxolotls(axolotls.map((axolotl) => (axolotl.id === editingId ? updatedAxolotl : axolotl)))
        setIsEditing(false)
        setEditingId(null)
      } else {
        console.error('Error al actualizar el ajolote')
      }
    } else {
      // Agregar nuevo ajolote
      const response = await fetch('/api/axolotls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAxolotl),
      })
      if (response.ok) {
        const createdAxolotl = await response.json()
        setAxolotls([...axolotls, createdAxolotl])
      } else {
        console.error('Error al crear el ajolote')
      }
    }
    // Restablecer formulario
    setNewAxolotl({
      name: '',
      species: '',
      age: 0,
      health: 'HEALTHY',
      size: 0,
      weight: 0,
      stage: 'JUVENILE',
      tankId: 0,
      observations: [],
    })
  }

  const startEditing = (axolotl: Axolotl) => {
    setNewAxolotl({
      name: axolotl.name,
      species: axolotl.species,
      age: axolotl.age,
      health: axolotl.health,
      size: axolotl.size,
      weight: axolotl.weight,
      stage: axolotl.stage,
      tankId: axolotl.tankId,
      observations: axolotl.observations,
    })
    setIsEditing(true)
    setEditingId(axolotl.id)
  }

  const deleteAxolotl = async (id: number) => {
    const response = await fetch(`/api/axolotls/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      setAxolotls(axolotls.filter((axolotl) => axolotl.id !== id))
    } else {
      console.error('Error al eliminar el ajolote')
    }
  }

  const getHealthColor = (health: Axolotl['health']) => {
    switch (health) {
      case 'HEALTHY': return 'text-green-500'
      case 'RECOVERING': return 'text-blue-500'
      case 'SICK': return 'text-yellow-500'
      case 'CRITICAL': return 'text-red-500'
      case 'QUARANTINE': return 'text-purple-500'
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
                      <span>{axolotl.tank?.name || ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Salud:</span>
                      <span className={getHealthColor(axolotl.health)}>{axolotl.health}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Etapa:</span>
                      <span>{axolotl.stage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Especie:</span>
                      <span>{axolotl.species}</span>
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
                <Label htmlFor="species" className="text-right">Especie</Label>
                <Input
                  id="species"
                  value={newAxolotl.species}
                  onChange={(e) => setNewAxolotl({...newAxolotl, species: e.target.value})}
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
                <Label htmlFor="health" className="text-right">Salud</Label>
                <Select
                  onValueChange={(value) => setNewAxolotl({...newAxolotl, health: value as Axolotl['health']})}
                  value={newAxolotl.health}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona el estado de salud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEALTHY">Saludable</SelectItem>
                    <SelectItem value="RECOVERING">Recuperándose</SelectItem>
                    <SelectItem value="SICK">Enfermo</SelectItem>
                    <SelectItem value="CRITICAL">Crítico</SelectItem>
                    <SelectItem value="QUARANTINE">En cuarentena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="size" className="text-right">Tamaño (cm)</Label>
                <Input
                  id="size"
                  type="number"
                  value={newAxolotl.size}
                  onChange={(e) => setNewAxolotl({...newAxolotl, size: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right">Peso (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={newAxolotl.weight}
                  onChange={(e) => setNewAxolotl({...newAxolotl, weight: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stage" className="text-right">Etapa de Vida</Label>
                <Select
                  onValueChange={(value) => setNewAxolotl({...newAxolotl, stage: value as Axolotl['stage']})}
                  value={newAxolotl.stage}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona la etapa de vida" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EGG">Huevo</SelectItem>
                    <SelectItem value="LARVAE">Larva</SelectItem>
                    <SelectItem value="JUVENILE">Juvenil</SelectItem>
                    <SelectItem value="ADULT">Adulto</SelectItem>
                    <SelectItem value="BREEDING">Reproductivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tank" className="text-right">Tanque</Label>
                <Select
                  onValueChange={(value) => setNewAxolotl({...newAxolotl, tankId: Number(value)})}
                  value={newAxolotl.tankId.toString()}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un tanque" />
                  </SelectTrigger>
                  <SelectContent>
                    {tanks.map((tank) => (
                      <SelectItem key={tank.id} value={tank.id.toString()}>
                        {tank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="observations" className="text-right">Observaciones</Label>
                <Textarea
                  id="observations"
                  value={newAxolotl.observations.join('\n')}
                  onChange={(e) => setNewAxolotl({...newAxolotl, observations: e.target.value.split('\n')})}
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
            <TableHead>Especie</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Tanque</TableHead>
            <TableHead>Salud</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {axolotls.map((axolotl) => (
            <TableRow key={axolotl.id}>
              <TableCell className="font-medium">{axolotl.name}</TableCell>
              <TableCell>{axolotl.species}</TableCell>
              <TableCell>{axolotl.age} años</TableCell>
              <TableCell>{axolotl.tank?.name || ''}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Heart className={`mr-2 h-4 w-4 ${getHealthColor(axolotl.health)}`} />
                  <span>{axolotl.health}</span>
                </div>
              </TableCell>
              <TableCell>{axolotl.stage}</TableCell>
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
