import type { GravityData, SensorConfig, WeightReading } from '../types';

export class SensorDataProcessor {
  private config: SensorConfig;
  private filteredData: GravityData | null = null;
  private history: GravityData[] = [];
  private maxHistorySize: number = 100;

  constructor(config: SensorConfig) {
    this.config = config;
  }

  applyLowPassFilter(data: GravityData): GravityData {
    if (!this.filteredData) {
      this.filteredData = { ...data };
      return { ...data };
    }

    const alpha = this.config.lowPassFilterAlpha;
    this.filteredData = {
      x: this.filteredData.x + alpha * (data.x - this.filteredData.x),
      y: this.filteredData.y + alpha * (data.y - this.filteredData.y),
      z: this.filteredData.z + alpha * (data.z - this.filteredData.z),
      timestamp: data.timestamp,
      accuracy: data.accuracy,
    };

    return { ...this.filteredData };
  }

  applyHighPassFilter(data: GravityData): GravityData {
    const previous = this.history[this.history.length - 1];
    if (!previous) {
      this.history.push(data);
      return { ...data };
    }

    const alpha = 0.9;
    const highPassData: GravityData = {
      x: alpha * (previous.x + data.x - previous.x),
      y: alpha * (previous.y + data.y - previous.y),
      z: alpha * (previous.z + data.z - previous.z),
      timestamp: data.timestamp,
      accuracy: data.accuracy,
    };

    this.addToHistory(data);
    return highPassData;
  }

  calculateMagnitude(data: GravityData): number {
    return Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
  }

  calculateWeightFromGravity(
    data: GravityData,
    zeroOffset: GravityData,
    weightPerUnit: number
  ): number {
    const dx = data.x - zeroOffset.x;
    const dy = data.y - zeroOffset.y;
    const dz = data.z - zeroOffset.z;
    const deltaMagnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return deltaMagnitude * weightPerUnit;
  }

  checkStability(windowSize: number = 10): boolean {
    if (this.history.length < windowSize) {
      return false;
    }

    const recent = this.history.slice(-windowSize);
    const magnitudes = recent.map((d) => this.calculateMagnitude(d));

    const avg = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    const variance =
      magnitudes.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) /
      magnitudes.length;
    const stdDev = Math.sqrt(variance);

    return stdDev < this.config.stabilityThreshold;
  }

  calculateRollingAverage(windowSize: number = 5): GravityData | null {
    if (this.history.length < windowSize) {
      return null;
    }

    const recent = this.history.slice(-windowSize);
    const avgX = recent.reduce((sum, d) => sum + d.x, 0) / windowSize;
    const avgY = recent.reduce((sum, d) => sum + d.y, 0) / windowSize;
    const avgZ = recent.reduce((sum, d) => sum + d.z, 0) / windowSize;

    return {
      x: avgX,
      y: avgY,
      z: avgZ,
      timestamp: Date.now(),
      accuracy: 'medium',
    };
  }

  detectSpike(currentData: GravityData, threshold: number = 2): boolean {
    if (this.history.length < 2) return false;

    const previous = this.history[this.history.length - 1];
    const delta = Math.abs(
      this.calculateMagnitude(currentData) - this.calculateMagnitude(previous)
    );

    return delta > threshold;
  }

  getWeightReading(data: GravityData, zeroOffset: GravityData, weightPerUnit: number): WeightReading {
    const filteredData = this.applyLowPassFilter(data);
    const weight = this.calculateWeightFromGravity(filteredData, zeroOffset, weightPerUnit);
    const isStable = this.checkStability(this.config.stabilityWindowSize);

    return {
      weight,
      timestamp: data.timestamp,
      rawData: filteredData,
      isStable,
    };
  }

  reset(): void {
    this.filteredData = null;
    this.history = [];
  }

  getHistory(): GravityData[] {
    return [...this.history];
  }

  private addToHistory(data: GravityData): void {
    this.history.push(data);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }
}
