// src/types.ts

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
  // Otras propiedades según tu esquema
  tank: Tank;
}

export interface Tank {
  id: number;
  name: string;
  capacity: number;
  status: string;
  ajolotaryId: number;
  // Otras propiedades según tu esquema
}

export interface SensorType {
  id: number;
  name: string;
  magnitude: string;
  // Otras propiedades según tu esquema
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
  // Otras propiedades según tu esquema
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

// model Alert {
//   id            Int         @id @default(autoincrement())
//   measurementId Int
//   alertType     AlertType
//   description   String      @db.Text
//   priority      Priority
//   status        AlertStatus @default(PENDING)
//   createdAt     DateTime    @default(now())
//   resolvedAt    DateTime?
//   resolvedBy    Int?
//   notes         String?
//   measurement   Measurement @relation(fields: [measurementId], references: [id], onDelete: Cascade)
//   resolver      User?       @relation(fields: [resolvedBy], references: [id])
// }

// enum AlertType {
//   PARAMETER_OUT_OF_RANGE
//   DEVICE_MALFUNCTION
//   MAINTENANCE_REQUIRED
//   SYSTEM_ERROR
//   CALIBRATION_NEEDED
//   HEALTH_ISSUE
// }

// num Priority {
//   HIGH
//   MEDIUM
//   LOW
// }

// model User {
//   id          Int         @id @default(autoincrement())
//   firstName   String      @db.VarChar(50)
//   lastName    String      @db.VarChar(50)
//   email       String      @unique @db.VarChar(100)
//   password    String
//   role        Role        @default(AJOLATORY_SUBSCRIBER)
//   phone       String      @db.VarChar(20)
//   ajolotaries Ajolotary[]
//   // createdBy     Int?
//   // creator       User?       @relation("UserCreator", fields: [createdBy], references: [id])
//   // createdUsers  User[]      @relation("UserCreator")
//   Alert       Alert[]
// }

// model Ajolotary {
//   id           Int     @id @default(autoincrement())
//   name         String  @db.VarChar(100)
//   location     String
//   description  String  @db.Text
//   permitNumber String  @db.VarChar(50)
//   active       Boolean @default(true)
//   users        User[]
//   tanks        Tank[]
// }


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
  resolver?: User;
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

export interface User {
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

export interface Ajolotary {
  id: number;
  name: string;
  location: string;
  description: string;
  permitNumber: string;
  active: boolean;
  users: User[];
  tanks: Tank[];
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AJOLATORY_ADMIN = 'AJOLATORY_ADMIN',
  AJOLATORY_SUBSCRIBER = 'AJOLATORY_SUBSCRIBER'
}


// model Axolotl {
//   id           Int          @id @default(autoincrement())
//   name         String       @db.VarChar(50)
//   species      String       @db.VarChar(50)
//   age          Int
//   health       HealthStatus
//   size         Decimal      @db.Decimal(10, 2)
//   weight       Decimal      @db.Decimal(10, 2)
//   stage        LifeStage
//   tankId       Int
//   tank         Tank         @relation(fields: [tankId], references: [id], onDelete: Cascade)
//   observations String[]
// }

// enum HealthStatus {
//   HEALTHY
//   SICK
//   CRITICAL
//   RECOVERING
//   QUARANTINE
// }

// enum LifeStage {
//   EGG
//   LARVAE
//   JUVENILE
//   ADULT
//   BREEDING
// }

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