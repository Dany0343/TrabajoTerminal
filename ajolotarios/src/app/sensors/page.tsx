'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type SensorStatus = 'ACTIVE' | 'INACTIVE' | 'FAULTY' | 'CALIBRATING';

type Sensor = {
  id: number;
  model: string;
  serialNumber: string;
  magnitude: string;
  typeId: number;
  status: SensorStatus;
  deviceId: number;
  lastConnection: string;
  calibratedAt: string;
  nextCalibrationAt: string;
  device?: Device;
  type?: SensorType;
};

type Device = {
  id: number;
  name: string;
};

type SensorType = {
  id: number;
  name: string;
};

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [sensorTypes, setSensorTypes] = useState<SensorType[]>([]);
  const [newSensor, setNewSensor] = useState<
    Omit<Sensor, 'id' | 'device' | 'type'>
  >({
    model: '',
    serialNumber: '',
    magnitude: '',
    typeId: 0,
    status: 'ACTIVE',
    deviceId: 0,
    lastConnection: new Date().toISOString().slice(0, 16),
    calibratedAt: new Date().toISOString().slice(0, 16),
    nextCalibrationAt: new Date().toISOString().slice(0, 16),
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // Obtener sensores
    fetch('/api/sensors')
      .then((res) => res.json())
      .then((data) => setSensors(data))
      .catch((error) => console.error(error));

    // Obtener dispositivos
    fetch('/api/devices')
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));

    // Obtener tipos de sensor
    fetch('/api/sensor-types')
      .then((res) => res.json())
      .then((data) => setSensorTypes(data))
      .catch((error) => console.error(error));
  }, []);

  const addSensor = async () => {
    // Validar campos requeridos
    if (
      !newSensor.model ||
      !newSensor.serialNumber ||
      !newSensor.magnitude ||
      !newSensor.typeId ||
      !newSensor.status ||
      !newSensor.deviceId
    ) {
      console.error('Faltan campos requeridos');
      return;
    }

    const response = await fetch('/api/sensors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSensor),
    });
    if (response.ok) {
      const createdSensor = await response.json();
      setSensors([...sensors, createdSensor]);
      setIsAddDialogOpen(false);
      // Restablecer formulario
      setNewSensor({
        model: '',
        serialNumber: '',
        magnitude: '',
        typeId: 0,
        status: 'ACTIVE',
        deviceId: 0,
        lastConnection: new Date().toISOString().slice(0, 16),
        calibratedAt: new Date().toISOString().slice(0, 16),
        nextCalibrationAt: new Date().toISOString().slice(0, 16),
      });
    } else {
      console.error('Error al crear el sensor');
    }
  };

  const updateSensor = async () => {
    if (editingId !== null) {
      const response = await fetch(`/api/sensors/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSensor),
      });
      if (response.ok) {
        const updatedSensor = await response.json();
        setSensors(
          sensors.map((sensor) => (sensor.id === editingId ? updatedSensor : sensor))
        );
        setIsEditDialogOpen(false);
        setEditingId(null);
        // Restablecer formulario
        setNewSensor({
          model: '',
          serialNumber: '',
          magnitude: '',
          typeId: 0,
          status: 'ACTIVE',
          deviceId: 0,
          lastConnection: new Date().toISOString().slice(0, 16),
          calibratedAt: new Date().toISOString().slice(0, 16),
          nextCalibrationAt: new Date().toISOString().slice(0, 16),
        });
      } else {
        console.error('Error al actualizar el sensor');
      }
    }
  };

  const startEditing = (sensor: Sensor) => {
    setNewSensor({
      model: sensor.model,
      serialNumber: sensor.serialNumber,
      magnitude: sensor.magnitude,
      typeId: sensor.typeId,
      status: sensor.status,
      deviceId: sensor.deviceId,
      lastConnection: sensor.lastConnection.slice(0, 16),
      calibratedAt: sensor.calibratedAt.slice(0, 16),
      nextCalibrationAt: sensor.nextCalibrationAt
        ? sensor.nextCalibrationAt.slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });
    setEditingId(sensor.id);
    setIsEditDialogOpen(true);
  };

  const deleteSensor = async (id: number) => {
    const response = await fetch(`/api/sensors/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setSensors(sensors.filter((sensor) => sensor.id !== id));
    } else {
      console.error('Error al eliminar el sensor');
    }
  };

  const getStatusBadge = (status: SensorStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 text-white">Activo</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-gray-500 text-white">Inactivo</Badge>;
      case 'FAULTY':
        return <Badge className="bg-red-500 text-white">Defectuoso</Badge>;
      case 'CALIBRATING':
        return <Badge className="bg-yellow-500 text-white">Calibrando</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Sensores</CardTitle>
          <CardDescription>Administra los sensores de tu sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aquí podrías agregar un resumen o estadísticas de los sensores */}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Sensores</h2>
        {/* Botón para agregar sensor */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Agregar Sensor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Sensor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Modelo */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">Modelo</Label>
                <Input
                  id="model"
                  value={newSensor.model}
                  onChange={(e) => setNewSensor({ ...newSensor, model: e.target.value })}
                  className="col-span-3"
                />
              </div>
              {/* Número de Serie */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serialNumber" className="text-right">Número de Serie</Label>
                <Input
                  id="serialNumber"
                  value={newSensor.serialNumber}
                  onChange={(e) => setNewSensor({ ...newSensor, serialNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              {/* Magnitud */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="magnitude" className="text-right">Magnitud</Label>
                <Input
                  id="magnitude"
                  value={newSensor.magnitude}
                  onChange={(e) => setNewSensor({ ...newSensor, magnitude: e.target.value })}
                  className="col-span-3"
                />
              </div>
              {/* Tipo de Sensor */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="typeId" className="text-right">Tipo de Sensor</Label>
                <Select
                  onValueChange={(value) => setNewSensor({ ...newSensor, typeId: Number(value) })}
                  value={newSensor.typeId ? newSensor.typeId.toString() : ''}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensorTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Estado del Sensor */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Estado del Sensor</Label>
                <Select
                  onValueChange={(value) => setNewSensor({ ...newSensor, status: value as SensorStatus })}
                  value={newSensor.status || ''}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="INACTIVE">Inactivo</SelectItem>
                    <SelectItem value="FAULTY">Defectuoso</SelectItem>
                    <SelectItem value="CALIBRATING">Calibrando</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Dispositivo */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deviceId" className="text-right">Dispositivo</Label>
                <Select
                  onValueChange={(value) => setNewSensor({ ...newSensor, deviceId: Number(value) })}
                  value={newSensor.deviceId ? newSensor.deviceId.toString() : ''}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device.id} value={device.id.toString()}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Fechas */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastConnection" className="text-right">Última Conexión</Label>
                <Input
                  id="lastConnection"
                  type="datetime-local"
                  value={newSensor.lastConnection}
                  onChange={(e) => setNewSensor({ ...newSensor, lastConnection: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="calibratedAt" className="text-right">Calibrado En</Label>
                <Input
                  id="calibratedAt"
                  type="datetime-local"
                  value={newSensor.calibratedAt}
                  onChange={(e) => setNewSensor({ ...newSensor, calibratedAt: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextCalibrationAt" className="text-right">Próxima Calibración</Label>
                <Input
                  id="nextCalibrationAt"
                  type="datetime-local"
                  value={newSensor.nextCalibrationAt}
                  onChange={(e) => setNewSensor({ ...newSensor, nextCalibrationAt: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addSensor}>Agregar Sensor</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Sensores */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Número de Serie</TableHead>
            <TableHead>Magnitud</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Dispositivo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensors.map((sensor) => (
            <TableRow key={sensor.id}>
              <TableCell className="font-medium">{sensor.model}</TableCell>
              <TableCell>{sensor.serialNumber}</TableCell>
              <TableCell>{sensor.magnitude}</TableCell>
              <TableCell>{sensor.type?.name || ''}</TableCell>
              <TableCell>{getStatusBadge(sensor.status)}</TableCell>
              <TableCell>{sensor.device?.name || ''}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Botón para editar sensor */}
                  <Dialog
                    open={isEditDialogOpen && editingId === sensor.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsEditDialogOpen(false);
                        setEditingId(null);
                        // Restablecer formulario
                        setNewSensor({
                          model: '',
                          serialNumber: '',
                          magnitude: '',
                          typeId: 0,
                          status: 'ACTIVE',
                          deviceId: 0,
                          lastConnection: new Date().toISOString().slice(0, 16),
                          calibratedAt: new Date().toISOString().slice(0, 16),
                          nextCalibrationAt: new Date().toISOString().slice(0, 16),
                        });
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(sensor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Sensor</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {/* Modelo */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="model" className="text-right">Modelo</Label>
                          <Input
                            id="model"
                            value={newSensor.model}
                            onChange={(e) => setNewSensor({ ...newSensor, model: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        {/* Número de Serie */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="serialNumber" className="text-right">Número de Serie</Label>
                          <Input
                            id="serialNumber"
                            value={newSensor.serialNumber}
                            onChange={(e) => setNewSensor({ ...newSensor, serialNumber: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        {/* Magnitud */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="magnitude" className="text-right">Magnitud</Label>
                          <Input
                            id="magnitude"
                            value={newSensor.magnitude}
                            onChange={(e) => setNewSensor({ ...newSensor, magnitude: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        {/* Tipo de Sensor */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="typeId" className="text-right">Tipo de Sensor</Label>
                          <Select
                            onValueChange={(value) => setNewSensor({ ...newSensor, typeId: Number(value) })}
                            value={newSensor.typeId ? newSensor.typeId.toString() : ''}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {sensorTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Estado del Sensor */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">Estado del Sensor</Label>
                          <Select
                            onValueChange={(value) => setNewSensor({ ...newSensor, status: value as SensorStatus })}
                            value={newSensor.status || ''}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Activo</SelectItem>
                              <SelectItem value="INACTIVE">Inactivo</SelectItem>
                              <SelectItem value="FAULTY">Defectuoso</SelectItem>
                              <SelectItem value="CALIBRATING">Calibrando</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Dispositivo */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="deviceId" className="text-right">Dispositivo</Label>
                          <Select
                            onValueChange={(value) => setNewSensor({ ...newSensor, deviceId: Number(value) })}
                            value={newSensor.deviceId ? newSensor.deviceId.toString() : ''}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecciona un dispositivo" />
                            </SelectTrigger>
                            <SelectContent>
                              {devices.map((device) => (
                                <SelectItem key={device.id} value={device.id.toString()}>
                                  {device.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Fechas */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="lastConnection" className="text-right">Última Conexión</Label>
                          <Input
                            id="lastConnection"
                            type="datetime-local"
                            value={newSensor.lastConnection}
                            onChange={(e) => setNewSensor({ ...newSensor, lastConnection: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="calibratedAt" className="text-right">Calibrado En</Label>
                          <Input
                            id="calibratedAt"
                            type="datetime-local"
                            value={newSensor.calibratedAt}
                            onChange={(e) => setNewSensor({ ...newSensor, calibratedAt: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nextCalibrationAt" className="text-right">Próxima Calibración</Label>
                          <Input
                            id="nextCalibrationAt"
                            type="datetime-local"
                            value={newSensor.nextCalibrationAt}
                            onChange={(e) => setNewSensor({ ...newSensor, nextCalibrationAt: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <Button onClick={updateSensor}>Actualizar Sensor</Button>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Botón para eliminar sensor */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSensor(sensor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
