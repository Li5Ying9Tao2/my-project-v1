/// <reference types="vite/client" />

// Web Sensor API Type Declarations
interface SensorOptions {
  frequency?: number;
  referenceFrame?: 'device' | 'screen';
}

interface Sensor extends EventTarget {
  readonly activated: boolean;
  readonly hasReading: boolean;
  readonly timestamp: number | null;
  start(): void;
  stop(): void;
  onreading: ((this: Sensor, ev: Event) => unknown) | null;
  onactivate: ((this: Sensor, ev: Event) => unknown) | null;
  onerror: ((this: Sensor, ev: SensorErrorEvent) => unknown) | null;
  addEventListener(type: 'reading', listener: (this: Sensor, ev: Event) => unknown, options?: AddEventListenerOptions | boolean): void;
  addEventListener(type: 'activate', listener: (this: Sensor, ev: Event) => unknown, options?: AddEventListenerOptions | boolean): void;
  addEventListener(type: 'error', listener: (this: Sensor, ev: SensorErrorEvent) => unknown, options?: AddEventListenerOptions | boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void;
  removeEventListener(type: 'reading', listener: (this: Sensor, ev: Event) => unknown, options?: EventListenerOptions | boolean): void;
  removeEventListener(type: 'activate', listener: (this: Sensor, ev: Event) => unknown, options?: EventListenerOptions | boolean): void;
  removeEventListener(type: 'error', listener: (this: Sensor, ev: SensorErrorEvent) => unknown, options?: EventListenerOptions | boolean): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void;
}

declare var Sensor: {
  prototype: Sensor;
  new(options?: SensorOptions): Sensor;
};

interface Accelerometer extends Sensor {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

declare var Accelerometer: {
  prototype: Accelerometer;
  new(options?: SensorOptions): Accelerometer;
};

interface SensorErrorEvent extends Event {
  readonly error: DOMException;
}

declare var SensorErrorEvent: {
  prototype: SensorErrorEvent;
  new(type: string, eventInitDict?: SensorErrorEventInit): SensorErrorEvent;
};

interface SensorErrorEventInit extends EventInit {
  error: DOMException;
}

interface PermissionDescriptor {
  name: PermissionName | string;
}

type PermissionName =
  | 'geolocation'
  | 'notifications'
  | 'push'
  | 'midi'
  | 'camera'
  | 'microphone'
  | 'speaker'
  | 'device-info'
  | 'background-sync'
  | 'bluetooth'
  | 'persistent-storage'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'nfc'
  | 'display-capture';
