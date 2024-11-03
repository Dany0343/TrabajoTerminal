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
  DialogTrigger,
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
  // Otros campos según tu modelo
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newAlert, setNewAlert] = useState<
    Omit<Alert, "id" | "createdAt" | "measurement" | "resolver">
  >({
    measurementId: 0,
    alertType: "PARAMETER_OUT_OF_RANGE",
    description: "",
    priority: "MEDIUM",
    status: "PENDING",
    resolvedAt: "",
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // Obtener alertas
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((error) => console.error(error));

    // Obtener mediciones
    fetch("/api/measurements")
      .then((res) => res.json())
      .then((data) => setMeasurements(data))
      .catch((error) => console.error(error));

    // Obtener usuarios
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  const addOrUpdateAlert = async () => {
    if (isEditing && editingId !== null) {
      // Actualizar alerta
      const response = await fetch(`/api/alerts/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlert),
      });
      if (response.ok) {
        const updatedAlert = await response.json();
        setAlerts(
          alerts.map((alert) => (alert.id === editingId ? updatedAlert : alert))
        );
        setIsEditing(false);
        setEditingId(null);
      } else {
        console.error("Error al actualizar la alerta");
      }
    } else {
      // Agregar nueva alerta
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlert),
      });
      if (response.ok) {
        const createdAlert = await response.json();
        setAlerts([...alerts, createdAlert]);
      } else {
        console.error("Error al crear la alerta");
      }
    }
    // Restablecer formulario
    setNewAlert({
      measurementId: 0,
      alertType: "PARAMETER_OUT_OF_RANGE",
      description: "",
      priority: "MEDIUM",
      status: "PENDING",
      resolvedAt: "",
      resolvedBy: undefined,
      notes: "",
    });
  };

  const startEditing = (alert: Alert) => {
    setNewAlert({
      measurementId: alert.measurementId,
      alertType: alert.alertType,
      description: alert.description,
      priority: alert.priority,
      status: alert.status,
      resolvedAt: alert.resolvedAt || "",
      resolvedBy: alert.resolvedBy,
      notes: alert.notes || "",
    });
    setIsEditing(true);
    setEditingId(alert.id);
  };

  const deleteAlert = async (id: number) => {
    const response = await fetch(`/api/alerts/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setAlerts(alerts.filter((alert) => alert.id !== id));
    } else {
      console.error("Error al eliminar la alerta");
    }
  };

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "LOW":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "HIGH":
        return "bg-orange-500";
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
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Gestión de Alertas
          </CardTitle>
          <CardDescription>
            Monitorea y administra las alertas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((priority) => (
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Alertas</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />{" "}
              {isEditing ? "Editar Alerta" : "Agregar Alerta"}
            </Button>
          </DialogTrigger>
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
                <Textarea
                  id="description"
                  value={newAlert.description}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alertType" className="text-right">
                  Tipo de Alerta
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewAlert({
                      ...newAlert,
                      alertType: value as Alert["alertType"],
                    })
                  }
                  value={newAlert.alertType}
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
                    <SelectItem value="SYSTEM_ERROR">
                      Error de sistema
                    </SelectItem>
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
                    setNewAlert({
                      ...newAlert,
                      priority: value as Alert["priority"],
                    })
                  }
                  value={newAlert.priority}
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
                    setNewAlert({
                      ...newAlert,
                      status: value as Alert["status"],
                    })
                  }
                  value={newAlert.status}
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
                <Select
                  onValueChange={(value) =>
                    setNewAlert({ ...newAlert, measurementId: Number(value) })
                  }
                  value={
                    newAlert.measurementId
                      ? newAlert.measurementId.toString()
                      : ""
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una medición" />
                  </SelectTrigger>
                  <SelectContent>
                    {measurements.map((measurement) => (
                      <SelectItem
                        key={measurement.id}
                        value={measurement.id.toString()}
                      >
                        Medición {measurement.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Campos opcionales */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resolvedAt" className="text-right">
                  Fecha de Resolución
                </Label>
                <Input
                  id="resolvedAt"
                  type="date"
                  value={newAlert.resolvedAt}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, resolvedAt: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resolvedBy" className="text-right">
                  Resuelta por
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewAlert({ ...newAlert, resolvedBy: Number(value) })
                  }
                  value={
                    newAlert.resolvedBy ? newAlert.resolvedBy.toString() : ""
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notas
                </Label>
                <Textarea
                  id="notes"
                  value={newAlert.notes}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, notes: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addOrUpdateAlert}>
              {isEditing ? "Actualizar Alerta" : "Agregar Alerta"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

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
                  className={`${getPriorityColor(alert.priority)} text-white`}
                >
                  {alert.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(alert.status)} text-white`}>
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell>{alert.measurementId}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(alert)}
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
    </div>
  );
}
