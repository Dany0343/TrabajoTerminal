'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from '@/components/ui/switch'

type Ajolotary = {
  id: number
  name: string
  location: string
  description: string
  permitNumber: string
  active: boolean
  users: User[]
  tanks: Tank[]
}

type User = {
  id: number
  firstName: string
  lastName: string
}

type Tank = {
  id: number
  name: string
}

export default function AjolotariesPage() {
  const [ajolotaries, setAjolotaries] = useState<Ajolotary[]>([])
  const [newAjolotary, setNewAjolotary] = useState<Omit<Ajolotary, 'id' | 'users' | 'tanks'>>({
    name: '',
    location: '',
    description: '',
    permitNumber: '',
    active: true,
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Obtener ajolotarios
    fetch('/api/ajolotaries')
      .then((res) => res.json())
      .then((data) => setAjolotaries(data))
      .catch((error) => console.error(error))
  }, [])

  const addAjolotary = async () => {
    // Agregar nuevo ajolotario
    const response = await fetch('/api/ajolotaries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAjolotary),
    })
    if (response.ok) {
      const createdAjolotary = await response.json()
      setAjolotaries([...ajolotaries, createdAjolotary])
      setIsAddDialogOpen(false)
      // Restablecer formulario
      setNewAjolotary({
        name: '',
        location: '',
        description: '',
        permitNumber: '',
        active: true,
      })
    } else {
      console.error('Error al crear el ajolotario')
    }
  }

  const updateAjolotary = async () => {
    if (editingId !== null) {
      // Actualizar ajolotario
      const response = await fetch(`/api/ajolotaries/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAjolotary),
      })
      if (response.ok) {
        const updatedAjolotary = await response.json()
        setAjolotaries(ajolotaries.map((ajolotary) => (ajolotary.id === editingId ? updatedAjolotary : ajolotary)))
        setIsEditDialogOpen(false)
        setEditingId(null)
        // Restablecer formulario
        setNewAjolotary({
          name: '',
          location: '',
          description: '',
          permitNumber: '',
          active: true,
        })
      } else {
        console.error('Error al actualizar el ajolotario')
      }
    }
  }

  const startEditing = (ajolotary: Ajolotary) => {
    setNewAjolotary({
      name: ajolotary.name,
      location: ajolotary.location,
      description: ajolotary.description,
      permitNumber: ajolotary.permitNumber,
      active: ajolotary.active,
    })
    setEditingId(ajolotary.id)
    setIsEditDialogOpen(true)
  }

  const deleteAjolotary = async (id: number) => {
    const response = await fetch(`/api/ajolotaries/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      setAjolotaries(ajolotaries.filter((ajolotary) => ajolotary.id !== id))
    } else {
      console.error('Error al eliminar el ajolotario')
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Ajolotarios</CardTitle>
          <CardDescription>Administra los ajolotarios de tu sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ajolotaries.slice(0, 3).map((ajolotary) => (
              <Card key={ajolotary.id}>
                <CardHeader>
                  <CardTitle>{ajolotary.name}</CardTitle>
                  <CardDescription>{ajolotary.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{ajolotary.description}</p>
                  <p className="mt-2">Permiso: {ajolotary.permitNumber}</p>
                  <p className="mt-2">Estado: {ajolotary.active ? 'Activo' : 'Inactivo'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Ajolotarios</h2>
        {/* Botón para agregar ajolotario */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Agregar Ajolotario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Ajolotario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  value={newAjolotary.name}
                  onChange={(e) => setNewAjolotary({ ...newAjolotary, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Ubicación</Label>
                <Input
                  id="location"
                  value={newAjolotary.location}
                  onChange={(e) => setNewAjolotary({ ...newAjolotary, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Textarea
                  id="description"
                  value={newAjolotary.description}
                  onChange={(e) => setNewAjolotary({ ...newAjolotary, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="permitNumber" className="text-right">Número de Permiso</Label>
                <Input
                  id="permitNumber"
                  value={newAjolotary.permitNumber}
                  onChange={(e) => setNewAjolotary({ ...newAjolotary, permitNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">Activo</Label>
                <Switch
                  id="active"
                  checked={newAjolotary.active}
                  onCheckedChange={(value) => setNewAjolotary({ ...newAjolotary, active: value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addAjolotary}>Agregar Ajolotario</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Número de Permiso</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ajolotaries.map((ajolotary) => (
            <TableRow key={ajolotary.id}>
              <TableCell className="font-medium">{ajolotary.name}</TableCell>
              <TableCell>{ajolotary.location}</TableCell>
              <TableCell>{ajolotary.permitNumber}</TableCell>
              <TableCell>
                <Badge className={`${ajolotary.active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {ajolotary.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Botón para editar ajolotario */}
                  <Dialog open={isEditDialogOpen && editingId === ajolotary.id} onOpenChange={(open) => {
                    if (!open) {
                      setIsEditDialogOpen(false)
                      setEditingId(null)
                      // Restablecer formulario
                      setNewAjolotary({
                        name: '',
                        location: '',
                        description: '',
                        permitNumber: '',
                        active: true,
                      })
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => startEditing(ajolotary)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Ajolotario</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Nombre</Label>
                          <Input
                            id="name"
                            value={newAjolotary.name}
                            onChange={(e) => setNewAjolotary({ ...newAjolotary, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="location" className="text-right">Ubicación</Label>
                          <Input
                            id="location"
                            value={newAjolotary.location}
                            onChange={(e) => setNewAjolotary({ ...newAjolotary, location: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="description" className="text-right">Descripción</Label>
                          <Textarea
                            id="description"
                            value={newAjolotary.description}
                            onChange={(e) => setNewAjolotary({ ...newAjolotary, description: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="permitNumber" className="text-right">Número de Permiso</Label>
                          <Input
                            id="permitNumber"
                            value={newAjolotary.permitNumber}
                            onChange={(e) => setNewAjolotary({ ...newAjolotary, permitNumber: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="active" className="text-right">Activo</Label>
                          <Switch
                            id="active"
                            checked={newAjolotary.active}
                            onCheckedChange={(value) => setNewAjolotary({ ...newAjolotary, active: value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <Button onClick={updateAjolotary}>Actualizar Ajolotario</Button>
                    </DialogContent>
                  </Dialog>

                  <Button variant="destructive" size="sm" onClick={() => deleteAjolotary(ajolotary.id)}>
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
