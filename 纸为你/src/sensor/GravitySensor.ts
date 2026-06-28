import type {
  GravityData,
  WeightReading,
  SensorConfig,
  SensorState,
} from '../types';
import { SensorError } from '../types';
import { EventEmitter } from './eventEmitter';
import { SensorDataProcessor } from './dataProcessor';
import { checkSensorPermission, requestSensorPermission } from './permission';

const DEFAULT_CONFIG: SensorConfig = {
  samplingRate: 50,
  calibrationThreshold: 0.5,
  stabilityThreshold: 2,
  stabilityWindowSize: 10,
  autoZero: true,
  lowPassFilterAlpha: 0.1,
};

export class GravitySensor extends EventEmitter {
  private config: SensorConfig;
  private state: SensorState;
  private dataProcessor: SensorDataProcessor;
  private sensorInstance: Accelerometer | null = null;
  private isListening: boolean = false;
  private stabilityBuffer: GravityData[] = [];
  private lastWeightReading: WeightReading | null = null;
  private weightPerUnit: number = 1;

  constructor(config?: Partial<SensorConfig>) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.dataProcessor = new SensorDataProcessor(this.config);
    this.state = {
      status: 'idle',
      error: null,
      currentWeight: 0,
      zeroOffset: { x: 0, y: 0, z: 0, timestamp: 0, accuracy: 'medium' },
      isCalibrated: false,
      lastReading: null,
      batteryLevel: 100,
    };
  }

  getState(): Readonly<SensorState> {
    return { ...this.state };
  }

  getConfig(): Readonly<SensorConfig> {
    return { ...this.config };
  }

  async isSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    return 'Accelerometer' in window;
  }

  async initialize(): Promise<void> {
    if (this.state.status === 'initializing') {
      return;
    }

    if (!(await this.isSupported())) {
      throw new SensorError(
        'NOT_SUPPORTED',
        '当前设备不支持加速度传感器'
      );
    }

    this.updateState({ status: 'initializing', error: null });

    try {
      const permission = await checkSensorPermission();
      if (!permission.granted) {
        const result = await requestSensorPermission();
        if (!result.granted) {
          throw new SensorError(
            'PERMISSION_DENIED',
            '传感器权限被拒绝，请在设置中启用传感器权限'
          );
        }
      }

      this.sensorInstance = new Accelerometer({
        frequency: this.config.samplingRate,
        referenceFrame: 'device',
      });

      this.sensorInstance.addEventListener('reading', this.handleReading);
      this.sensorInstance.addEventListener('error', this.handleError);

      this.sensorInstance.start();
      this.isListening = true;

      this.updateState({ status: 'ready' });
      this.emit('status-change', 'ready');

      if (this.config.autoZero) {
        setTimeout(() => this.calibrate(), 1000);
      }
    } catch (error) {
      const sensorError = this.wrapError(error, 'INITIALIZATION_FAILED');
      this.updateState({
        status: 'error',
        error: sensorError.message,
      });
      this.emit('error', sensorError);
      throw sensorError;
    }
  }

  async calibrate(): Promise<GravityData> {
    if (this.state.status !== 'ready') {
      throw new SensorError(
        'NOT_CONNECTED',
        '传感器未就绪，无法校准'
      );
    }

    return new Promise((resolve, reject) => {
      const calibrationTimeout = setTimeout(() => {
        reject(
          new SensorError(
            'CALIBRATION_FAILED',
            '校准超时，请确保设备静止后重试'
          )
        );
      }, 5000);

      const samples: GravityData[] = [];
      const sampleCount = 50;

      const collectSample = (data: GravityData) => {
        samples.push(data);
        if (samples.length >= sampleCount) {
          this.off('data', collectSample);
          clearTimeout(calibrationTimeout);

          const avgX = samples.reduce((sum, s) => sum + s.x, 0) / samples.length;
          const avgY = samples.reduce((sum, s) => sum + s.y, 0) / samples.length;
          const avgZ = samples.reduce((sum, s) => sum + s.z, 0) / samples.length;

          const offset: GravityData = {
            x: avgX,
            y: avgY,
            z: avgZ,
            timestamp: Date.now(),
            accuracy: 'high',
          };

          this.state.zeroOffset = offset;
          this.state.isCalibrated = true;

          this.weightPerUnit = this.calculateWeightPerUnit(offset);

          this.emit('calibration-complete', offset);
          resolve(offset);
        }
      };

      this.on('data', collectSample);
    });
  }

  tared(): boolean {
    return this.state.isCalibrated;
  }

  tare(): void {
    if (this.state.lastReading) {
      this.state.zeroOffset = this.state.lastReading.rawData;
      this.state.isCalibrated = true;
    }
  }

  startListening(): void {
    if (this.isListening || !this.sensorInstance) return;
    this.sensorInstance.start();
    this.isListening = true;
  }

  stopListening(): void {
    if (!this.isListening || !this.sensorInstance) return;
    this.sensorInstance.stop();
    this.isListening = false;
  }

  getCurrentWeight(): number {
    return this.state.currentWeight;
  }

  getLastReading(): WeightReading | null {
    return this.state.lastReading;
  }

  isStable(): boolean {
    if (this.stabilityBuffer.length < this.config.stabilityWindowSize) {
      return false;
    }

    const recent = this.stabilityBuffer.slice(-this.config.stabilityWindowSize);
    const magnitudes = recent.map((d) =>
      Math.sqrt(d.x * d.x + d.y * d.y + d.z * d.z)
    );

    const avg = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    const variance =
      magnitudes.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) /
      magnitudes.length;
    const stdDev = Math.sqrt(variance);

    return stdDev < this.config.stabilityThreshold;
  }

  destroy(): void {
    this.stopListening();
    if (this.sensorInstance) {
      this.sensorInstance.removeEventListener('reading', this.handleReading);
      this.sensorInstance.removeEventListener('error', this.handleError);
      this.sensorInstance = null;
    }
    this.removeAllListeners();
    this.updateState({ status: 'idle' });
    this.emit('status-change', 'idle');
  }

  private handleReading = () => {
    if (!this.sensorInstance) return;

    const data: GravityData = {
      x: this.sensorInstance.x,
      y: this.sensorInstance.y,
      z: this.sensorInstance.z,
      timestamp: performance.now(),
      accuracy: 'high',
    };

    const filteredData = this.dataProcessor.applyLowPassFilter(data);

    this.stabilityBuffer.push(filteredData);
    if (this.stabilityBuffer.length > 100) {
      this.stabilityBuffer.shift();
    }

    const weight = this.calculateWeight(filteredData);
    const isStable = this.isStable();

    const reading: WeightReading = {
      weight,
      timestamp: Date.now(),
      rawData: filteredData,
      isStable,
    };

    this.state.currentWeight = weight;
    this.state.lastReading = reading;

    this.emit('data', filteredData);

    if (
      !this.lastWeightReading ||
      Math.abs(this.lastWeightReading.weight - weight) > 5
    ) {
      this.emit('weight-change', reading);
      this.lastWeightReading = reading;
    }
  };

  private handleError = (event: Event) => {
    const sensorEvent = event as unknown as SensorErrorEvent;
    const error = new SensorError(
      'READ_FAILED',
      sensorEvent.error?.message || '传感器读取失败',
      { error: sensorEvent.error }
    );
    this.state.error = error.message;
    this.state.status = 'error';
    this.emit('error', error);
  };

  private calculateWeight(data: GravityData): number {
    if (!this.state.isCalibrated) {
      const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
      return magnitude * 100;
    }

    const dx = data.x - this.state.zeroOffset.x;
    const dy = data.y - this.state.zeroOffset.y;
    const dz = data.z - this.state.zeroOffset.z;
    const deltaMagnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return deltaMagnitude * this.weightPerUnit;
  }

  private calculateWeightPerUnit(_offset: GravityData): number {
    return 100;
  }

  private updateState(partial: Partial<SensorState>): void {
    this.state = { ...this.state, ...partial };
    if ('status' in partial) {
      this.emit('status-change', this.state.status);
    }
  }

  private wrapError(error: unknown, defaultCode: SensorError['code']): SensorError {
    if (error instanceof SensorError) return error;
    return new SensorError(
      defaultCode,
      error instanceof Error ? error.message : String(error)
    );
  }
}

export const gravitySensor = new GravitySensor();
