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
  serialNumber: string;
  tankId?: number;
};

type SensorType = {
  id: number;
  name: string;
  magnitude: string;
};

export default function SensorsPage() {
  // Estado para Sensores
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [sensorTypes, setSensorTypes] = useState<SensorType[]>([]);
  const [newSensor, setNewSensor] = useState<
    Omit<Sensor, 'id' | 'device' | 'type'>
  >({
    model: '',
    serialNumber: '',
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

  // Estado para Gestión de SensorType
  const [isManageSensorTypeOpen, setIsManageSensorTypeOpen] = useState(false);
  const [newSensorType, setNewSensorType] = useState<SensorType>({
    id: 0,
    name: '',
    magnitude: '', // Inicializar magnitud
  });
  const [editingSensorType, setEditingSensorType] = useState<SensorType | null>(null);

  // Estado para Gestión de Device
  const [isManageDeviceOpen, setIsManageDeviceOpen] = useState(false);
    const [newDevice, setNewDevice] = useState<Device>({
    id: 0,
    name: '',
    serialNumber: '',
    tankId: 1, // Valor por defecto o puedes manejarlo con un select
  });
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  useEffect(() => {
    // Obtener Sensores
    fetch('/api/sensors')
      .then((res) => res.json())
      .then((data) => setSensors(data))
      .catch((error) => console.error(error));

    // Obtener Dispositivos
    fetch('/api/devices')
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));

    // Obtener Tipos de Sensor
    fetch('/api/sensor-types')
      .then((res) => res.json())
      .then((data) => setSensorTypes(data))
      .catch((error) => console.error(error));
  }, []);

  // Funciones CRUD para Sensores

  const addSensor = async () => {
    // Validar campos requeridos
    if (
      !newSensor.model ||
      !newSensor.serialNumber ||
      !newSensor.typeId ||
      !newSensor.status ||
      !newSensor.deviceId
    ) {
      alert('Faltan campos requeridos');
      return;
    }

    try {
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
          typeId: 0,
          status: 'ACTIVE',
          deviceId: 0,
          lastConnection: new Date().toISOString().slice(0, 16),
          calibratedAt: new Date().toISOString().slice(0, 16),
          nextCalibrationAt: new Date().toISOString().slice(0, 16),
        });
      } else {
        const errorText = await response.text();
        alert(`Error al crear el sensor: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al crear el sensor');
    }
  };

  const updateSensor = async () => {
    if (editingId !== null) {
      try {
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
            typeId: 0,
            status: 'ACTIVE',
            deviceId: 0,
            lastConnection: new Date().toISOString().slice(0, 16),
            calibratedAt: new Date().toISOString().slice(0, 16),
            nextCalibrationAt: new Date().toISOString().slice(0, 16),
          });
        } else {
          const errorText = await response.text();
          alert(`Error al actualizar el sensor: ${errorText}`);
        }
      } catch (error) {
        console.error(error);
        alert('Error al actualizar el sensor');
      }
    }
  };

  const startEditing = (sensor: Sensor) => {
    setNewSensor({
      model: sensor.model,
      serialNumber: sensor.serialNumber,
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
    if (!confirm('¿Estás seguro de que deseas eliminar este sensor?')) return;

    try {
      const response = await fetch(`/api/sensors/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSensors(sensors.filter((sensor) => sensor.id !== id));
      } else {
        const errorText = await response.text();
        alert(`Error al eliminar el sensor: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el sensor');
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

  // Funciones CRUD para SensorType

  const addSensorType = async () => {
    if (!newSensorType.name || !newSensorType.magnitude) {
      alert('El nombre y la magnitud del tipo de sensor son obligatorios');
      return;
    }

    try {
      const response = await fetch('/api/sensor-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newSensorType.name, 
          magnitude: newSensorType.magnitude 
        }),
      });
      if (response.ok) {
        const createdType = await response.json();
        setSensorTypes([...sensorTypes, createdType]);
        setNewSensorType({ id: 0, name: '', magnitude: '' });
        alert('Tipo de sensor agregado exitosamente');
      } else {
        const errorText = await response.text();
        alert(`Error al crear el tipo de sensor: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al crear el tipo de sensor');
    }
  };

  const updateSensorType = async () => {
    if (!editingSensorType || !editingSensorType.name || !editingSensorType.magnitude) {
      alert('El nombre y la magnitud del tipo de sensor son obligatorios');
      return;
    }

    try {
      const response = await fetch(`/api/sensor-types/${editingSensorType.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editingSensorType.name, 
          magnitude: editingSensorType.magnitude 
        }),
      });
      if (response.ok) {
        const updatedType = await response.json();
        setSensorTypes(
          sensorTypes.map((type) => (type.id === updatedType.id ? updatedType : type))
        );
        setEditingSensorType(null);
        setNewSensorType({ id: 0, name: '', magnitude: '' });
        alert('Tipo de sensor actualizado exitosamente');
      } else {
        const errorText = await response.text();
        alert(`Error al actualizar el tipo de sensor: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el tipo de sensor');
    }
  };

  const deleteSensorType = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tipo de sensor?')) return;

    try {
      const response = await fetch(`/api/sensor-types/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSensorTypes(sensorTypes.filter((type) => type.id !== id));
        alert('Tipo de sensor eliminado exitosamente');
      } else {
        const errorText = await response.text();
        alert(`Error al eliminar el tipo de sensor: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el tipo de sensor');
    }
  };

  const startEditingSensorType = (type: SensorType) => {
    setEditingSensorType(type);
    setNewSensorType(type);
  };

  // Funciones CRUD para Device

    const addDevice = async () => {
    if (!newDevice.name || !newDevice.serialNumber) {
      alert('El nombre y número de serie son obligatorios');
      return;
    }
  
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDevice.name,
          serialNumber: newDevice.serialNumber,
          tankId: newDevice.tankId || 1, // Asegúrate de manejar esto apropiadamente
        }),
      });
      if (response.ok) {
        const createdDevice = await response.json();
        setDevices([...devices, createdDevice]);
        setNewDevice({ id: 0, name: '', serialNumber: '' });
        alert('Dispositivo agregado exitosamente');
      } else {
        const errorText = await response.text();
        alert(`Error al crear el dispositivo: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al crear el dispositivo');
    }
  };
  
  const updateDevice = async () => {
    if (!editingDevice || !editingDevice.name || !editingDevice.serialNumber) {
      alert('El nombre y número de serie son obligatorios');
      return;
    }
  
    try {
      const response = await fetch(`/api/devices/${editingDevice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingDevice.name,
          serialNumber: editingDevice.serialNumber,
          tankId: editingDevice.tankId || 1, // Asegúrate de manejar esto apropiadamente
        }),
      });
      if (response.ok) {
        const updatedDevice = await response.json();
        setDevices(
          devices.map((device) => (device.id === updatedDevice.id ? updatedDevice : device))
        );
        setEditingDevice(null);
        setNewDevice({ id: 0, name: '', serialNumber: '' });
        alert('Dispositivo actualizado exitosamente');
      } else {
        const errorText = await response.text();
        alert(`Error al actualizar el dispositivo: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el dispositivo');
    }
  };

  const deleteDevice = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este dispositivo?')) return;

    try {
      const response = await fetch(`/api/devices/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDevices(devices.filter((device) => device.id !== id));
        alert('Dispositivo eliminado exitosamente');
      } else {
        const errorText = await response.text();
        alert(`Error al eliminar el dispositivo: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el dispositivo');
    }
  };

  const startEditingDevice = (device: Device) => {
    setEditingDevice(device);
    setNewDevice(device);
  };

  return (
    <div className="container mx-auto py-10">
      {/* Card de Título */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Sensores</CardTitle>
          <CardDescription>Administra los sensores de tu sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aquí podrías agregar un resumen o estadísticas de los sensores */}
        </CardContent>
      </Card>

      {/* Sección de Sensores */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Sensores</h2>
        <div className="flex space-x-2">
          {/* Botón para Agregar Sensor */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
                          {type.name} - {type.magnitude} {/* Mostrar magnitud */}
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
                {/* <div className="grid grid-cols-4 items-center gap-4">
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
                </div> */}
              </div>
              <Button onClick={addSensor}>Agregar Sensor</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Gestión de SensorType */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Gestión de Tipos de Sensor</h2>
        <div className="flex space-x-2">
          <Dialog open={isManageSensorTypeOpen} onOpenChange={setIsManageSensorTypeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Gestionar Tipos de Sensor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestionar Tipos de Sensor</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Tabla de Tipos de Sensor */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Magnitud</TableHead> {/* Nueva columna */}
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sensorTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell>{type.id}</TableCell>
                        <TableCell>{type.name}</TableCell>
                        <TableCell>{type.magnitude}</TableCell> {/* Mostrar magnitud */}
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditingSensorType(type)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteSensorType(type.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Formulario para Agregar/Editar Tipo de Sensor */}
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">
                    {editingSensorType ? 'Editar Tipo de Sensor' : 'Agregar Nuevo Tipo de Sensor'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <div>
                      <Label htmlFor="sensorTypeName">Nombre</Label>
                      <Input
                        id="sensorTypeName"
                        type="text"
                        value={editingSensorType ? editingSensorType.name : newSensorType.name}
                        onChange={(e) =>
                          editingSensorType
                            ? setEditingSensorType({ ...editingSensorType, name: e.target.value })
                            : setNewSensorType({ ...newSensorType, name: e.target.value })
                        }
                      />
                    </div>
                    {/* Campo para Magnitud */}
                    <div>
                      <Label htmlFor="sensorTypeMagnitude">Magnitud</Label>
                      <Input
                        id="sensorTypeMagnitude"
                        type="text"
                        value={editingSensorType ? editingSensorType.magnitude : newSensorType.magnitude}
                        onChange={(e) =>
                          editingSensorType
                            ? setEditingSensorType({ ...editingSensorType, magnitude: e.target.value })
                            : setNewSensorType({ ...newSensorType, magnitude: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={editingSensorType ? updateSensorType : addSensorType}
                      >
                        {editingSensorType ? 'Actualizar Tipo' : 'Agregar Tipo'}
                      </Button>
                      {editingSensorType && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingSensorType(null);
                            setNewSensorType({ id: 0, name: '', magnitude: '' });
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsManageSensorTypeOpen(false)}>Cerrar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Gestión de Device */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Gestión de Dispositivos</h2>
        <div className="flex space-x-2">
          <Dialog open={isManageDeviceOpen} onOpenChange={setIsManageDeviceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Gestionar Dispositivos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestionar Dispositivos</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Tabla de Dispositivos */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>{device.id}</TableCell>
                        <TableCell>{device.name}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditingDevice(device)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteDevice(device.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                                {/* Formulario para Agregar/Editar Device */}
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">
                    {editingDevice ? 'Editar Dispositivo' : 'Agregar Nuevo Dispositivo'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <div>
                      <Label htmlFor="deviceName">Nombre</Label>
                      <Input
                        id="deviceName"
                        type="text"
                        value={editingDevice ? editingDevice.name : newDevice.name}
                        onChange={(e) =>
                          editingDevice
                            ? setEditingDevice({ ...editingDevice, name: e.target.value })
                            : setNewDevice({ ...newDevice, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="serialNumber">Número de Serie</Label>
                      <Input
                        id="serialNumber"
                        type="text"
                        value={editingDevice ? editingDevice.serialNumber : newDevice.serialNumber}
                        onChange={(e) =>
                          editingDevice
                            ? setEditingDevice({ ...editingDevice, serialNumber: e.target.value })
                            : setNewDevice({ ...newDevice, serialNumber: e.target.value })
                        }
                      />
                    </div>
                    {/* Opcional: Agregar select para tankId si es necesario */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={editingDevice ? updateDevice : addDevice}
                      >
                        {editingDevice ? 'Actualizar Dispositivo' : 'Agregar Dispositivo'}
                      </Button>
                      {editingDevice && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingDevice(null);
                            setNewDevice({ id: 0, name: '', serialNumber: '' });
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsManageDeviceOpen(false)}>Cerrar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabla de Sensores */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Número de Serie</TableHead>
            <TableHead>Magnitud</TableHead> {/* Magnitud desde SensorType */}
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
              <TableCell>{sensor.type?.magnitude || 'N/A'}</TableCell> {/* Actualizado */}
              <TableCell>{sensor.type?.name || 'N/A'}</TableCell>
              <TableCell>{getStatusBadge(sensor.status)}</TableCell>
              <TableCell>{sensor.device?.name || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Botón para Editar Sensor */}
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
                        {/* Magnitud: Eliminado */}
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
                                  {type.name} - {type.magnitude} {/* Mostrar magnitud */}
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
                  {/* Botón para Eliminar Sensor */}
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
