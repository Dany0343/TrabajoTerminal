'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Tank = {
  id: number
  name: string
  capacity: number
  observations: string
  status: string
  ajolotaryId: number
  ajolotary?: Ajolotary
}

type Ajolotary = {
  id: number
  name: string
}

export default function TanksPage() {
  const [tanks, setTanks] = useState<Tank[]>([])
  const [filteredTanks, setFilteredTanks] = useState<Tank[]>([])
  const [ajolotaries, setAjolotaries] = useState<Ajolotary[]>([])
  const [selectedAjolotaryId, setSelectedAjolotaryId] = useState<number | 'ALL'>('ALL')
  const [formTank, setFormTank] = useState<Omit<Tank, 'id'>>({
    name: '',
    capacity: 0,
    observations: '',
    status: 'ACTIVE',
    ajolotaryId: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        let url = '/api/tanks';
        if (selectedAjolotaryId !== 'ALL') {
          url += `?ajolotaryId=${selectedAjolotaryId}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Error al obtener los tanques');
        }
        const data = await res.json();
        setFilteredTanks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTanks();
  }, [selectedAjolotaryId, isDialogOpen]); // Refrescar al cambiar el filtro o al abrir/cerrar el diálogo

  useEffect(() => {
    // Obtener ajolotarios
    const fetchAjolotaries = async () => {
      try {
        const res = await fetch('/api/ajolotaries');
        if (!res.ok) {
          throw new Error('Error al obtener los ajolotarios');
        }
        const data = await res.json();
        setAjolotaries(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAjolotaries();
  }, [])

  const addOrUpdateTank = async () => {
    try {
      if (isEditing && editingId !== null) {
        // Actualizar tanque
        const response = await fetch(`/api/tanks/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formTank),
        })
        if (response.ok) {
          const updatedTank = await response.json()
          setTanks(tanks.map((tank) => (tank.id === editingId ? updatedTank : tank)))
          setIsEditing(false)
          setEditingId(null)
        } else {
          console.error('Error al actualizar el tanque')
          // Opcional: Manejar el error en la UI
        }
      } else {
        // Agregar nuevo tanque
        const response = await fetch('/api/tanks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formTank),
        })
        if (response.ok) {
          const createdTank = await response.json()
          setTanks([...tanks, createdTank])
        } else {
          console.error('Error al crear el tanque')
          // Opcional: Manejar el error en la UI
        }
      }
      // Restablecer formulario y cerrar diálogo
      setFormTank({
        name: '',
        capacity: 0,
        observations: '',
        status: 'ACTIVE',
        ajolotaryId: 0,
      })
      setIsDialogOpen(false)
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error('Error en addOrUpdateTank:', error)
      // Opcional: Manejar el error en la UI
    }
  }

  const openAddDialog = () => {
    setIsEditing(false)
    setFormTank({
      name: '',
      capacity: 0,
      observations: '',
      status: 'ACTIVE',
      ajolotaryId: 0,
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (tank: Tank) => {
    setIsEditing(true)
    setEditingId(tank.id)
    setFormTank({
      name: tank.name,
      capacity: tank.capacity,
      observations: tank.observations,
      status: tank.status,
      ajolotaryId: tank.ajolotaryId,
    })
    setIsDialogOpen(true)
  }

  const deleteTank = async (id: number) => {
    try {
      const response = await fetch(`/api/tanks/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTanks(tanks.filter((tank) => tank.id !== id))
      } else {
        console.error('Error al eliminar el tanque')
        // Opcional: Manejar el error en la UI
      }
    } catch (error) {
      console.error('Error en deleteTank:', error)
      // Opcional: Manejar el error en la UI
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Tanques</CardTitle>
          <CardDescription>Administra los tanques de tu sistema de ajolotes</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Puedes agregar componentes de resumen aquí */}
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Tanques</h2>
        <div className="flex space-x-4">
          {/* Selector para Filtrar por Ajolotario */}
          <Select
            onValueChange={(value) => {
              if (value === 'ALL') {
                setSelectedAjolotaryId('ALL');
              } else {
                setSelectedAjolotaryId(Number(value));
              }
            }}
            value={selectedAjolotaryId.toString()}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por Ajolotario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los Ajolotarios</SelectItem>
              {ajolotaries.map((ajolotary) => (
                <SelectItem key={ajolotary.id} value={ajolotary.id.toString()}>
                  {ajolotary.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Tanque
          </Button>
        </div>
      </div>

      {/* Diálogo para Agregar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Tanque' : 'Agregar Nuevo Tanque'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input
                id="name"
                value={formTank.name}
                onChange={(e) => setFormTank({ ...formTank, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacidad (L)</Label>
              <Input
                id="capacity"
                type="number"
                value={formTank.capacity}
                onChange={(e) => setFormTank({ ...formTank, capacity: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observations" className="text-right">Observaciones</Label>
              <Input
                id="observations"
                value={formTank.observations}
                onChange={(e) => setFormTank({ ...formTank, observations: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Estado</Label>
              <Select
                onValueChange={(value) => setFormTank({ ...formTank, status: value })}
                value={formTank.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                  <SelectItem value="QUARANTINE">Cuarentena</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ajolotary" className="text-right">Ajolotario</Label>
              <Select
                onValueChange={(value) => setFormTank({ ...formTank, ajolotaryId: Number(value) })}
                value={formTank.ajolotaryId.toString()}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar ajolotario" />
                </SelectTrigger>
                <SelectContent>
                  {ajolotaries.map((ajolotary) => (
                    <SelectItem key={ajolotary.id} value={ajolotary.id.toString()}>
                      {ajolotary.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addOrUpdateTank} className="mt-4">
            {isEditing ? 'Actualizar Tanque' : 'Agregar Tanque'}
          </Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Observaciones</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Ajolotario</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTanks.map((tank) => (
            <TableRow key={tank.id}>
              <TableCell>{tank.name}</TableCell>
              <TableCell>{tank.capacity} L</TableCell>
              <TableCell>{tank.observations}</TableCell>
              <TableCell>{tank.status}</TableCell>
              <TableCell>{tank.ajolotary?.name || ''}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(tank)}>
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