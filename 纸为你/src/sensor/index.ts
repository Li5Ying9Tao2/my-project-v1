export { GravitySensor, gravitySensor } from './GravitySensor';
export { EventEmitter } from './eventEmitter';
export { SensorDataProcessor } from './dataProcessor';
export {
  checkSensorPermission,
  requestSensorPermission,
  clearSensorPermission,
  setSensorPermissionGranted,
} from './permission';

export type {
  SensorStatus,
  SensorAccuracy,
  GravityData,
  WeightReading,
  SensorConfig,
  SensorState,
  SensorEventMap,
  SensorErrorCode,
  SensorPermission,
} from '../types';

export { SensorError } from '../types';
