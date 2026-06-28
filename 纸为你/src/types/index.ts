export type ToiletStatus = 'sufficient' | 'insufficient' | 'maintenance';

export type DeviceStatus = 'online' | 'offline' | 'maintenance';

export type TicketStatus = 'submitted' | 'verified' | 'resolved' | 'escalated';

export type ProblemType = 'empty' | 'malfunction' | 'other';

export type UserRole = 'admin' | 'visitor';

export interface Building {
  id: string;
  name: string;
  location: string;
  floors: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Toilet {
  toiletId: string;
  buildingId: string;
  buildingName?: string;
  floor: number;
  type: 'male' | 'female' | 'accessible';
  coordinates: {
    lat: number;
    lng: number;
  };
  initialWeight: number;
  currentWeight: number;
  status: ToiletStatus;
  lastUpdated: Date;
  deviceId?: string;
}

export interface Device {
  deviceId: string;
  toiletId: string;
  deviceStatus: DeviceStatus;
  batteryLevel: number;
  lastHeartbeat: Date;
  firmwareVersion: string;
  installedAt: Date;
}

export interface StatusRecord {
  recordId: number;
  toiletId: string;
  status: ToiletStatus;
  weight: number;
  recordTime: Date;
  dataSource: 'sensor' | 'manual';
}

export interface FeedbackTicket {
  ticketId: number;
  toiletId: string;
  toiletInfo?: Toilet;
  userType: 'student' | 'staff' | 'anonymous';
  problemType: ProblemType;
  description: string;
  photoUrl?: string;
  ticketStatus: TicketStatus;
  createdAt: Date;
  resolvedAt?: Date;
  isDeleted: boolean;
}

export interface TicketOperation {
  operationId: number;
  ticketId: number;
  operator: string;
  operationType: 'verify' | 'resolve' | 'escalate';
  remarks?: string;
  operationTime: Date;
}

export interface SensorIssue {
  id: string;
  toiletId: string;
  bathroomLocation: string;
  issue: string;
  detectedAt: Date;
  deviceId: string;
  batteryLevel: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  role: string;
  building?: string;
}

export interface SystemConfig {
  weightThreshold: number;
  batteryWarningThreshold: number;
  heartbeatInterval: number;
  dataUploadInterval: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  relatedToiletId?: string;
}

// ==================== 重力传感器相关类型定义 ====================

export type SensorStatus = 'idle' | 'initializing' | 'ready' | 'error' | 'unavailable';

export type SensorAccuracy = 'unreliable' | 'low' | 'medium' | 'high';

export interface GravityData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
  accuracy: SensorAccuracy;
}

export interface WeightReading {
  weight: number;
  timestamp: number;
  rawData: GravityData;
  isStable: boolean;
}

export interface SensorConfig {
  samplingRate: number;
  calibrationThreshold: number;
  stabilityThreshold: number;
  stabilityWindowSize: number;
  autoZero: boolean;
  lowPassFilterAlpha: number;
}

export interface SensorState {
  status: SensorStatus;
  error: string | null;
  currentWeight: number;
  zeroOffset: GravityData;
  isCalibrated: boolean;
  lastReading: WeightReading | null;
  batteryLevel: number;
}

export interface SensorEventMap {
  'data': (data: GravityData) => void;
  'weight-change': (reading: WeightReading) => void;
  'status-change': (status: SensorStatus) => void;
  'error': (error: SensorError) => void;
  'calibration-complete': (offset: GravityData) => void;
  'low-battery': (level: number) => void;
}

export class SensorError extends Error {
  code: SensorErrorCode;
  details?: Record<string, unknown>;

  constructor(code: SensorErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'SensorError';
    this.code = code;
    this.details = details;
  }
}

export type SensorErrorCode =
  | 'NOT_SUPPORTED'
  | 'PERMISSION_DENIED'
  | 'NOT_CONNECTED'
  | 'INITIALIZATION_FAILED'
  | 'READ_FAILED'
  | 'CALIBRATION_FAILED'
  | 'CONNECTION_LOST'
  | 'BATTERY_LOW'
  | 'UNKNOWN';

export interface SensorPermission {
  granted: boolean;
  canRequest: boolean;
  rationale?: string;
}