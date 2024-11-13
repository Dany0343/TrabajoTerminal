// componente: AlertsPage.jsx

"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

type Measurement = {
  id: number;
  device: Device;
  sensor: Sensor;
  dateTime: string;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

type Device = {
  id: number;
  name: string;
};

type Sensor = {
  id: number;
  type: SensorType;
};

type SensorType = {
  id: number;
  name: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formAlert, setFormAlert] = useState<
    Omit<Alert, "id" | "createdAt" | "measurement" | "resolver">
  >({
    measurementId: 0,
    alertType: "PARAMETER_OUT_OF_RANGE",
    description: "",
    priority: "MEDIUM",
    status: "PENDING",
    resolvedAt: "",
    resolvedBy: undefined,
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [filters, setFilters] = useState({
    alertType: "ALL",
    priority: "ALL",
    status: "ALL",
    measurementId: "ALL",
    resolverId: "ALL",
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        let url = `/api/alerts?page=${filters.page}&limit=${filters.limit}`;

        if (filters.alertType !== "ALL") {
          url += `&alertType=${filters.alertType}`;
        }
        if (filters.priority !== "ALL") {
          url += `&priority=${filters.priority}`;
        }
        if (filters.status !== "ALL") {
          url += `&status=${filters.status}`;
        }
        if (filters.measurementId !== "ALL") {
          url += `&measurementId=${filters.measurementId}`;
        }
        if (filters.resolverId !== "ALL") {
          url += `&resolverId=${filters.resolverId}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Error al obtener las alertas');
        }
        const data = await res.json();
        setAlerts(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlerts();
  }, [filters]);

  useEffect(() => {
    // Obtener mediciones
    const fetchMeasurements = async () => {
      try {
        const res = await fetch("/api/measurements");
        if (!res.ok) {
          throw new Error("Error al obtener las mediciones");
        }
        const data = await res.json();
        setMeasurements(data.data); 
      } catch (error) {
        console.error(error);
      }
    };
  
    // Obtener usuarios
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const data = await res.json();
        setUsers(data); 
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchMeasurements();
    fetchUsers();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formAlert.description.trim()) {
      errors.description = "La descripción es obligatoria.";
    }
    if (formAlert.measurementId === 0) {
      errors.measurementId = "Selecciona una medición.";
    }
    if (formAlert.status === "RESOLVED") {
      if (!formAlert.resolvedAt) {
        errors.resolvedAt = "Selecciona una fecha de resolución.";
      }
      if (!formAlert.resolvedBy) {
        errors.resolvedBy = "Selecciona quién resolvió la alerta.";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addOrUpdateAlert = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response;
      if (isEditing && editingId !== null) {
        // Actualizar alerta
        response = await fetch(`/api/alerts/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formAlert),
        });
      } else {
        // Agregar nueva alerta
        response = await fetch("/api/alerts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formAlert),
        });
      }

      if (response.ok) {
        const updatedOrCreatedAlert = await response.json();
        if (isEditing) {
          setAlerts(
            alerts.map((alert) =>
              alert.id === editingId ? updatedOrCreatedAlert : alert
            )
          );
        } else {
          setAlerts([...alerts, updatedOrCreatedAlert]);
        }
        setIsEditing(false);
        setEditingId(null);
        setIsDialogOpen(false);
        alert(
          isEditing ? "Alerta actualizada exitosamente." : "Alerta agregada exitosamente."
        );
        // Reset filters if needed
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error al procesar la alerta:", error);
      alert("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
    }

    // Restablecer formulario
    setFormAlert({
      measurementId: 0,
      alertType: "PARAMETER_OUT_OF_RANGE",
      description: "",
      priority: "MEDIUM",
      status: "PENDING",
      resolvedAt: "",
      resolvedBy: undefined,
      notes: "",
    });
    setFormErrors({});
  };

  const openAddDialog = () => {
    setIsEditing(false);
    setFormAlert({
      measurementId: 0,
      alertType: "PARAMETER_OUT_OF_RANGE",
      description: "",
      priority: "MEDIUM",
      status: "PENDING",
      resolvedAt: "",
      resolvedBy: undefined,
      notes: "",
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (alert: Alert) => {
    setIsEditing(true);
    setEditingId(alert.id);
    setFormAlert({
      measurementId: alert.measurementId,
      alertType: alert.alertType,
      description: alert.description,
      priority: alert.priority,
      status: alert.status,
      resolvedAt: alert.resolvedAt || "",
      resolvedBy: alert.resolvedBy,
      notes: alert.notes || "",
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const deleteAlert = async (id: number) => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar esta alerta? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAlerts(alerts.filter((alert) => alert.id !== id));
        alert("Alerta eliminada exitosamente.");
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error al eliminar la alerta:", error);
      alert("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
    }
  };

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "LOW":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "HIGH":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: Alert["status"]) => {
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

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Alertas</CardTitle>
          <CardDescription>Monitorea y administra las alertas del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["HIGH", "MEDIUM", "LOW"].map((priority) => (
              <Card key={priority}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle
                      className={`mr-2 h-5 w-5 ${getPriorityColor(
                        priority as Alert["priority"]
                      )}`}
                    />
                    Prioridad {priority}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {
                      alerts.filter(
                        (alert) =>
                          alert.priority === priority &&
                          alert.status !== "RESOLVED"
                      ).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Alertas activas
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-semibold">Lista de Alertas</h2>
        <div className="flex flex-wrap gap-4">
          <Select
            name="alertType"
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                alertType: value,
                page: 1,
              }))
            }
            value={filters.alertType}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Tipo de Alerta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las Alertas</SelectItem>
              <SelectItem value="PARAMETER_OUT_OF_RANGE">
                Parámetro fuera de rango
              </SelectItem>
              <SelectItem value="DEVICE_MALFUNCTION">
                Fallo de dispositivo
              </SelectItem>
              <SelectItem value="MAINTENANCE_REQUIRED">
                Requiere mantenimiento
              </SelectItem>
              <SelectItem value="SYSTEM_ERROR">Error de sistema</SelectItem>
              <SelectItem value="CALIBRATION_NEEDED">
                Necesita calibración
              </SelectItem>
              <SelectItem value="HEALTH_ISSUE">
                Problema de salud
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            name="priority"
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                priority: value,
                page: 1,
              }))
            }
            value={filters.priority}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las Prioridades</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
              <SelectItem value="MEDIUM">Media</SelectItem>
              <SelectItem value="LOW">Baja</SelectItem>
            </SelectContent>
          </Select>

          <Select
            name="status"
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value,
                page: 1,
              }))
            }
            value={filters.status}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los Estados</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="ACKNOWLEDGED">Reconocida</SelectItem>
              <SelectItem value="RESOLVED">Resuelta</SelectItem>
              <SelectItem value="ESCALATED">Escalada</SelectItem>
            </SelectContent>
          </Select>

          <Select
            name="measurementId"
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                measurementId: value,
                page: 1,
              }))
            }
            value={filters.measurementId}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Medición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las Mediciones</SelectItem>
              {measurements.map((measurement) => (
                <SelectItem key={measurement.id} value={measurement.id.toString()}>
                  Medición {measurement.id} - Dispositivo: {measurement.device?.name || 'N/A'}, Sensor: {measurement.sensor?.type?.name || 'N/A'}, Fecha: {formatDateTime(measurement.dateTime)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            name="resolverId"
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                resolverId: value,
                page: 1,
              }))
            }
            value={filters.resolverId}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Resuelto por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los Usuarios</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Alerta
          </Button>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex justify-end items-center space-x-2 mb-4">
        <Button
          disabled={filters.page === 1}
          onClick={() => handlePageChange(filters.page - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {filters.page} de {totalPages}
        </span>
        <Button
          disabled={filters.page === totalPages}
          onClick={() => handlePageChange(filters.page + 1)}
        >
          Siguiente
        </Button>
      </div>

      {/* Diálogo para Agregar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Alerta" : "Agregar Nueva Alerta"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  value={formAlert.description}
                  onChange={(e) =>
                    setFormAlert({ ...formAlert, description: e.target.value })
                  }
                  className={`w-full ${
                    formErrors.description ? "border-red-500" : ""
                  }`}
                />
                {formErrors.description && (
                  <span className="text-red-500 text-sm">
                    {formErrors.description}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertType" className="text-right">
                Tipo de Alerta
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormAlert({
                    ...formAlert,
                    alertType: value as Alert["alertType"],
                  })
                }
                value={formAlert.alertType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona el tipo de alerta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARAMETER_OUT_OF_RANGE">
                    Parámetro fuera de rango
                  </SelectItem>
                  <SelectItem value="DEVICE_MALFUNCTION">
                    Fallo de dispositivo
                  </SelectItem>
                  <SelectItem value="MAINTENANCE_REQUIRED">
                    Requiere mantenimiento
                  </SelectItem>
                  <SelectItem value="SYSTEM_ERROR">Error de sistema</SelectItem>
                  <SelectItem value="CALIBRATION_NEEDED">
                    Necesita calibración
                  </SelectItem>
                  <SelectItem value="HEALTH_ISSUE">
                    Problema de salud
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Prioridad
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormAlert({
                    ...formAlert,
                    priority: value as Alert["priority"],
                  })
                }
                value={formAlert.priority}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormAlert({
                    ...formAlert,
                    status: value as Alert["status"],
                  })
                }
                value={formAlert.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="ACKNOWLEDGED">Reconocida</SelectItem>
                  <SelectItem value="RESOLVED">Resuelta</SelectItem>
                  <SelectItem value="ESCALATED">Escalada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="measurementId" className="text-right">
                Medición
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    setFormAlert({ ...formAlert, measurementId: Number(value) })
                  }
                  value={
                    formAlert.measurementId
                      ? formAlert.measurementId.toString()
                      : ""
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una medición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas las Mediciones</SelectItem>
                    {measurements.map((measurement) => (
                      <SelectItem
                        key={measurement.id}
                        value={measurement.id.toString()}
                      >
                        Medición {measurement.id} - Dispositivo: {measurement.device?.name || 'N/A'}, Sensor: {measurement.sensor?.type?.name || 'N/A'}, Fecha: {formatDateTime(measurement.dateTime)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.measurementId && (
                  <span className="text-red-500 text-sm">
                    {formErrors.measurementId}
                  </span>
                )}
              </div>
            </div>
            {/* Campos opcionales */}
            {formAlert.status === "RESOLVED" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resolvedAt" className="text-right">
                    Fecha de Resolución
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="resolvedAt"
                      type="date"
                      value={formAlert.resolvedAt}
                      onChange={(e) =>
                        setFormAlert({
                          ...formAlert,
                          resolvedAt: e.target.value,
                        })
                      }
                      className={`w-full ${
                        formErrors.resolvedAt ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.resolvedAt && (
                      <span className="text-red-500 text-sm">
                        {formErrors.resolvedAt}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resolvedBy" className="text-right">
                    Resuelta por
                  </Label>
                  <div className="col-span-3">
                    <Select
                      onValueChange={(value) =>
                        setFormAlert({
                          ...formAlert,
                          resolvedBy: Number(value),
                        })
                      }
                      value={
                        formAlert.resolvedBy
                          ? formAlert.resolvedBy.toString()
                          : ""
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos los Usuarios</SelectItem>
                        {users.map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id.toString()}
                          >
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.resolvedBy && (
                      <span className="text-red-500 text-sm">
                        {formErrors.resolvedBy}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right">
                Notas
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="notes"
                  value={formAlert.notes}
                  onChange={(e) =>
                    setFormAlert({ ...formAlert, notes: e.target.value })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <Button onClick={addOrUpdateAlert} className="mt-4">
            {isEditing ? "Actualizar Alerta" : "Agregar Alerta"}
          </Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Medición</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.description}</TableCell>
              <TableCell>
                <Badge
                  className={`${getPriorityColor(
                    alert.priority
                  )} text-white`}
                >
                  {alert.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={`${getStatusColor(alert.status)} text-white`}
                >
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell>
                {alert.measurement
                  ? `Medición ${alert.measurement.id} - Dispositivo: ${alert.measurement.device?.name || 'N/A'}, Sensor: ${alert.measurement.sensor?.type?.name || 'N/A'}, Fecha: ${formatDateTime(alert.measurement.dateTime)}`
                  : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(alert)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación Inferior */}
      <div className="flex justify-end items-center space-x-2 mt-4">
        <Button
          disabled={filters.page === 1}
          onClick={() => handlePageChange(filters.page - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {filters.page} de {totalPages}
        </span>
        <Button
          disabled={filters.page === totalPages}
          onClick={() => handlePageChange(filters.page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
