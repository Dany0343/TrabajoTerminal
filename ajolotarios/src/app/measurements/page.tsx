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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Definir tipos separados para los parámetros del formulario
type FormMeasurementParameter = {
  id?: number; // Opcional, ya que no existe al crear uno nuevo
  parameterId: number;
  value: number;
};

type FormMeasurement = {
  dateTime: string;
  deviceId?: number;
  sensorId?: number;
  isValid: boolean;
  parameters: FormMeasurementParameter[];
};

// Otros tipos según tu esquema Prisma
type Measurement = {
  id: number;
  dateTime: string;
  deviceId: number;
  sensorId: number;
  isValid: boolean;
  device?: Device;
  sensor?: Sensor;
  parameters: MeasurementParameter[];
  alerts: Alert[];
};

type MeasurementParameter = {
  id: number;
  parameterId: number;
  value: number;
  measurementId: number;
  parameter?: Parameter;
};

type Device = {
  id: number;
  name: string;
};

type Sensor = {
  id: number;
  model: string;
  serialNumber: string;
  typeId: number;
  statusId: number;
  magnitude: string;
  type?: SensorType;
  status?: SensorStatus;
};

type SensorType = {
  id: number;
  name: string;
};

type SensorStatus = {
  id: number;
  status: string;
};

type Parameter = {
  id: number;
  name: string;
};

type Alert = {
  id: number;
  measurementId: number;
  alertType:
    | "PARAMETER_OUT_OF_RANGE"
    | "DEVICE_MALFUNCTION"
    | "MAINTENANCE_REQUIRED"
    | "SYSTEM_ERROR"
    | "CALIBRATION_NEEDED"
    | "HEALTH_ISSUE";
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED" | "ESCALATED";
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: number;
  notes?: string;
  measurement?: Measurement;
  resolver?: User;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  
  const [formMeasurement, setFormMeasurement] = useState<FormMeasurement>({
    dateTime: new Date().toISOString().slice(0, 16),
    deviceId: undefined,
    sensorId: undefined,
    isValid: true,
    parameters: [],
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    // Obtener mediciones
    fetch('/api/measurements')
      .then((res) => res.json())
      .then((data) => setMeasurements(data))
      .catch((error) => console.error(error));
    
    // Obtener dispositivos
    fetch('/api/devices')
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
    
    // Obtener sensores
    fetch('/api/sensors')
      .then((res) => res.json())
      .then((data) => setSensors(data))
      .catch((error) => console.error(error));
    
    // Obtener parámetros
    fetch('/api/parameters')
      .then((res) => res.json())
      .then((data) => setParameters(data))
      .catch((error) => console.error(error));
  }, []);
  
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formMeasurement.dateTime) {
      errors.dateTime = 'La fecha y hora son obligatorias.';
    }
    if (!formMeasurement.deviceId) {
      errors.deviceId = 'Selecciona un dispositivo.';
    }
    if (!formMeasurement.sensorId) {
      errors.sensorId = 'Selecciona un sensor.';
    }
    if (!formMeasurement.parameters || formMeasurement.parameters.length === 0) {
      errors.parameters = 'Agrega al menos un parámetro.';
    } else {
      formMeasurement.parameters.forEach((param, index) => {
        if (!param.parameterId) {
          errors[`parameterId_${index}`] = 'Selecciona un parámetro.';
        }
        if (param.value === undefined || param.value === null) {
          errors[`value_${index}`] = 'Ingresa un valor.';
        }
      });
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const addOrUpdateMeasurement = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      let response;
      if (isEditing && editingId !== null) {
        // Actualizar medición
        response = await fetch(`/api/measurements/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formMeasurement),
        });
        if (response.ok) {
          const updatedMeasurement = await response.json();
          setMeasurements(
            measurements.map((measurement) =>
              measurement.id === editingId ? updatedMeasurement : measurement
            )
          );
          setSuccessMessage('Medición actualizada exitosamente.');
        } else {
          throw new Error('Error al actualizar la medición.');
        }
      } else {
        // Agregar nueva medición
        response = await fetch('/api/measurements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formMeasurement),
        });
        if (response.ok) {
          const createdMeasurement = await response.json();
          setMeasurements([...measurements, createdMeasurement]);
          setSuccessMessage('Medición agregada exitosamente.');
        } else {
          throw new Error('Error al crear la medición.');
        }
      }
      
      // Cerrar diálogo y restablecer formulario
      setIsEditing(false);
      setEditingId(null);
      setIsDialogOpen(false);
      setFormMeasurement({
        dateTime: new Date().toISOString().slice(0, 16),
        deviceId: undefined,
        sensorId: undefined,
        isValid: true,
        parameters: [],
      });
      setFormErrors({});
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Ocurrió un error inesperado.');
    }
  };
  
  const openAddDialog = () => {
    setIsEditing(false);
    setFormMeasurement({
      dateTime: new Date().toISOString().slice(0, 16),
      deviceId: undefined,
      sensorId: undefined,
      isValid: true,
      parameters: [],
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (measurement: Measurement) => {
    setIsEditing(true);
    setEditingId(measurement.id);
    setFormMeasurement({
      dateTime: measurement.dateTime,
      deviceId: measurement.deviceId,
      sensorId: measurement.sensorId,
      isValid: measurement.isValid,
      parameters: measurement.parameters.map((param) => ({
        id: param.id, // Incluir el id para ediciones
        parameterId: param.parameterId,
        value: param.value,
      })),
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };
  
  const deleteMeasurement = async (id: number) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar esta medición? Esta acción no se puede deshacer.'
    );
    if (!confirmDelete) {
      return;
    }
    
    try {
      const response = await fetch(`/api/measurements/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMeasurements(measurements.filter((measurement) => measurement.id !== id));
        setSuccessMessage('Medición eliminada exitosamente.');
      } else {
        throw new Error('Error al eliminar la medición.');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Ocurrió un error inesperado.');
    }
  };
  
  const addParameterField = () => {
    setFormMeasurement((prev) => ({
      ...prev,
      parameters: [
        ...(prev.parameters || []),
        { parameterId: 0, value: 0 }, // id es opcional
      ],
    }));
  };
  
  const removeParameterField = (index: number) => {
    setFormMeasurement((prev) => ({
      ...prev,
      parameters: prev.parameters?.filter((_, i) => i !== index),
    }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`parameterId_${index}`];
      delete newErrors[`value_${index}`];
      return newErrors;
    });
  };
  
  const getPriorityColor = (priority: "HIGH" | "MEDIUM" | "LOW") => {
    switch (priority) {
      case "LOW":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "HIGH":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const getStatusColor = (status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED" | "ESCALATED") => {
    switch (status) {
      case "PENDING":
        return "bg-blue-500";
      case "ACKNOWLEDGED":
        return "bg-indigo-500";
      case "RESOLVED":
        return "bg-green-500";
      case "ESCALATED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      {/* Mensajes de éxito y error */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="ml-4">
            X
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
          <button onClick={() => setErrorMessage('')} className="ml-4">
            X
          </button>
        </div>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Mediciones</CardTitle>
          <CardDescription>Administra las mediciones del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aquí podrías agregar un resumen o estadísticas de las mediciones */}
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Mediciones</h2>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Medición
        </Button>
      </div>
      
      {/* Diálogo para Agregar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Medición' : 'Agregar Nueva Medición'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Fecha y Hora */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateTime" className="text-right">
                Fecha y Hora
              </Label>
              <div className="col-span-3">
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formMeasurement.dateTime}
                  onChange={(e) =>
                    setFormMeasurement({ ...formMeasurement, dateTime: e.target.value })
                  }
                  className={`w-full ${
                    formErrors.dateTime ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.dateTime && (
                  <span className="text-red-500 text-sm">{formErrors.dateTime}</span>
                )}
              </div>
            </div>
            
            {/* Dispositivo */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deviceId" className="text-right">
                Dispositivo
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    setFormMeasurement({ ...formMeasurement, deviceId: Number(value) })
                  }
                  value={
                    formMeasurement.deviceId
                      ? formMeasurement.deviceId.toString()
                      : ''
                  }
                >
                  <SelectTrigger className="w-full">
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
                {formErrors.deviceId && (
                  <span className="text-red-500 text-sm">{formErrors.deviceId}</span>
                )}
              </div>
            </div>
            
            {/* Sensor */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sensorId" className="text-right">
                Sensor
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    setFormMeasurement({ ...formMeasurement, sensorId: Number(value) })
                  }
                  value={
                    formMeasurement.sensorId
                      ? formMeasurement.sensorId.toString()
                      : ''
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un sensor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensors.map((sensor) => (
                      <SelectItem key={sensor.id} value={sensor.id.toString()}>
                        {sensor.model} - {sensor.serialNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.sensorId && (
                  <span className="text-red-500 text-sm">{formErrors.sensorId}</span>
                )}
              </div>
            </div>
            
            {/* Parámetros */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Parámetros</Label>
              <div className="col-span-3 space-y-2">
                {formMeasurement.parameters && formMeasurement.parameters.length > 0 ? (
                  formMeasurement.parameters.map((param, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {/* Selector de Parámetro */}
                      <Select
                        onValueChange={(value) => {
                          const updatedParams = [...(formMeasurement.parameters || [])];
                          updatedParams[index].parameterId = Number(value);
                          setFormMeasurement({ ...formMeasurement, parameters: updatedParams });
                        }}
                        value={
                          param.parameterId
                            ? param.parameterId.toString()
                            : ''
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un parámetro" />
                        </SelectTrigger>
                        <SelectContent>
                          {parameters.map((parameter) => (
                            <SelectItem key={parameter.id} value={parameter.id.toString()}>
                              {parameter.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Error de Parámetro */}
                      {formErrors[`parameterId_${index}`] && (
                        <span className="text-red-500 text-sm">
                          {formErrors[`parameterId_${index}`]}
                        </span>
                      )}
                      
                      {/* Input de Valor */}
                      <Input
                        type="number"
                        placeholder="Valor"
                        value={param.value}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          const updatedParams = [...(formMeasurement.parameters || [])];
                          updatedParams[index].value = value;
                          setFormMeasurement({ ...formMeasurement, parameters: updatedParams });
                        }}
                        className={`w-24 ${
                          formErrors[`value_${index}`] ? 'border-red-500' : ''
                        }`}
                      />
                      {/* Error de Valor */}
                      {formErrors[`value_${index}`] && (
                        <span className="text-red-500 text-sm">
                          {formErrors[`value_${index}`]}
                        </span>
                      )}
                      
                      {/* Botón para eliminar parámetro */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeParameterField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500">No hay parámetros agregados.</span>
                )}
                {formErrors.parameters && (
                  <span className="text-red-500 text-sm">{formErrors.parameters}</span>
                )}
                <Button variant="outline" size="sm" onClick={addParameterField}>
                  <Plus className="mr-2 h-4 w-4" /> Agregar Parámetro
                </Button>
              </div>
            </div>
            
            {/* Campo isValid */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isValid" className="text-right">
                ¿Es válida?
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    setFormMeasurement({ ...formMeasurement, isValid: value === 'true' })
                  }
                  value={formMeasurement.isValid ? 'true' : 'false'}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={addOrUpdateMeasurement}>
              {isEditing ? 'Actualizar Medición' : 'Agregar Medición'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Dispositivo</TableHead>
            <TableHead>Sensor</TableHead>
            <TableHead>Parámetros</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measurements.map((measurement) => (
            <TableRow key={measurement.id}>
              <TableCell className="font-medium">
                {new Date(measurement.dateTime).toLocaleString()}
              </TableCell>
              <TableCell>{measurement.device?.name || 'N/A'}</TableCell>
              <TableCell>
                {measurement.sensor?.model || 'N/A'} - {measurement.sensor?.serialNumber || 'N/A'}
              </TableCell>
              <TableCell>
                {measurement.parameters.length > 0 ? (
                  measurement.parameters.map((param) => (
                    <div key={param.id || param.parameterId}>
                      {param.parameter?.name || 'Parámetro Desconocido'}: {param.value}
                    </div>
                  ))
                ) : (
                  <span>N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Botón para editar medición */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(measurement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {/* Botón para eliminar medición */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMeasurement(measurement.id)}
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
