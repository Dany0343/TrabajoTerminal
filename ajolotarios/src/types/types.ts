// src/types/types.ts

export interface Parameter {
  id: number;
  name: string;
  description?: string;
}

export interface MeasurementParameter {
  id: number;
  measurementId: number;
  parameterId: number;
  value: number;
  measurement: Measurement;
  parameter: Parameter;
}

export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  status: string;
  tankId: number;
  tank: Tank;
}

export interface Tank {
  id: number;
  name: string;
  capacity: number;
  status: string;
  ajolotaryId: number;
}

export interface SensorType {
  id: number;
  name: string;
  magnitude: string;
}

export interface Sensor {
  id: number;
  model: string;
  serialNumber: string;
  lastConnection?: string; // Usa string si viene como ISO string desde la API
  typeId: number;
  deviceId: number;
  calibratedAt?: string; // Usa string si viene como ISO string desde la API
  type: SensorType;
  status: string;
}

export interface Measurement {
  id: number;
  dateTime: string;
  deviceId: number;
  sensorId: number;
  device: {
    id: number;
    name: string;
    serialNumber: string;
    status: string;
    tankId: number;
    tank: Tank;
  };
  sensor: Sensor;
  alerts: Alert[];
  parameters: MeasurementParameter[];
  isValid: boolean;
}


export interface Alert {
  id: number;
  measurementId: number;
  alertType: AlertType;
  description: string;
  priority: Priority;
  status: AlertStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: number;
  notes?: string;
  measurement: Measurement;
  resolver?: AppUser;
}

export enum AlertType {
  PARAMETER_OUT_OF_RANGE = 'PARAMETER_OUT_OF_RANGE',
  DEVICE_MALFUNCTION = 'DEVICE_MALFUNCTION',
  MAINTENANCE_REQUIRED = 'MAINTENANCE_REQUIRED',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  CALIBRATION_NEEDED = 'CALIBRATION_NEEDED',
  HEALTH_ISSUE = 'HEALTH_ISSUE',
}

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum AlertStatus {
  PENDING = "PENDING",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  RESOLVED = "RESOLVED",
  ESCALATED = "ESCALATED"
}

export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  ajolotaries: Ajolotary[];
  alerts: Alert[];
}

export interface Log {
  id: number;
  userId: number | null;
  action: ActionType;
  entity: string;
  entityId: number | null;
  timestamp: Date;
  details: string | null;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export enum ActionType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface Ajolotary {
  id: number;
  name: string;
  location: string;
  description: string;
  permitNumber: string;
  active: boolean;
  users: AppUser[];
  tanks: Tank[];
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AJOLATORY_ADMIN = 'AJOLATORY_ADMIN',
  AJOLATORY_SUBSCRIBER = 'AJOLATORY_SUBSCRIBER'
}


export interface Axolotl {
  id: number;
  name: string;
  species: string;
  age: number;
  health: HealthStatus;
  size: number;
  weight: number;
  stage: LifeStage;
  tankId: number;
  tank: Tank;
  observations: string[];
}

export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  SICK = 'SICK',
  CRITICAL = 'CRITICAL',
  RECOVERING = 'RECOVERING',
  QUARANTINE = 'QUARANTINE',
}

export enum LifeStage {
  EGG = 'EGG',
  LARVAE = 'LARVAE',
  JUVENILE = 'JUVENILE',
  ADULT = 'ADULT',
  BREEDING = 'BREEDING',
}