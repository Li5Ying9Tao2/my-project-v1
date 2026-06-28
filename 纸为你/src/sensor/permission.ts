import type { SensorPermission } from '../types';
import { SensorError } from '../types';

const SENSOR_PERMISSION_KEY = 'zhiweini_sensor_permission';

export async function checkSensorPermission(): Promise<SensorPermission> {
  if (typeof navigator === 'undefined') {
    return {
      granted: false,
      canRequest: false,
      rationale: '非浏览器环境，无法使用传感器',
    };
  }

  if (!('Accelerometer' in window)) {
    return {
      granted: false,
      canRequest: false,
      rationale: '当前设备不支持加速度传感器',
    };
  }

  if (typeof navigator.permissions !== 'undefined' && 'query' in navigator.permissions) {
    try {
      const result = await navigator.permissions.query({
        name: 'accelerometer' as PermissionName,
      });

      const granted = result.state === 'granted';
      return {
        granted,
        canRequest: result.state === 'prompt',
        rationale: result.state === 'denied' ? '传感器权限被拒绝，请在浏览器设置中启用' : undefined,
      };
    } catch (error) {
      console.warn('查询传感器权限失败:', error);
    }
  }

  const saved = localStorage.getItem(SENSOR_PERMISSION_KEY);
  if (saved !== null) {
    return {
      granted: saved === 'granted',
      canRequest: saved !== 'denied',
    };
  }

  return {
    granted: false,
    canRequest: true,
  };
}

export async function requestSensorPermission(): Promise<SensorPermission> {
  if (typeof navigator === 'undefined') {
    return {
      granted: false,
      canRequest: false,
      rationale: '非浏览器环境，无法使用传感器',
    };
  }

  try {
    const sensor = new Accelerometer({ frequency: 10 });
    sensor.start();

    return new Promise((resolve) => {
      const handleReading = () => {
        sensor.stop();
        sensor.removeEventListener('reading', handleReading);
        sensor.removeEventListener('error', handleError);
        localStorage.setItem(SENSOR_PERMISSION_KEY, 'granted');
        resolve({ granted: true, canRequest: true });
      };

      const handleError = (event: Event) => {
        const sensorEvent = event as unknown as SensorErrorEvent;
        sensor.stop();
        sensor.removeEventListener('reading', handleReading);
        sensor.removeEventListener('error', handleError);
        localStorage.setItem(SENSOR_PERMISSION_KEY, 'denied');
        resolve({
          granted: false,
          canRequest: false,
          rationale: sensorEvent.error?.message || '传感器访问被拒绝',
        });
      };

      sensor.addEventListener('reading', handleReading);
      sensor.addEventListener('error', handleError);

      setTimeout(() => {
        sensor.stop();
        sensor.removeEventListener('reading', handleReading);
        sensor.removeEventListener('error', handleError);
        localStorage.setItem(SENSOR_PERMISSION_KEY, 'granted');
        resolve({ granted: true, canRequest: true });
      }, 1000);
    });
  } catch (error) {
    if (error instanceof SensorError) {
      throw error;
    }

    throw new SensorError(
      'PERMISSION_DENIED',
      error instanceof Error ? error.message : '无法获取传感器权限'
    );
  }
}

export function clearSensorPermission(): void {
  localStorage.removeItem(SENSOR_PERMISSION_KEY);
}

export function setSensorPermissionGranted(granted: boolean): void {
  localStorage.setItem(SENSOR_PERMISSION_KEY, granted ? 'granted' : 'denied');
}
