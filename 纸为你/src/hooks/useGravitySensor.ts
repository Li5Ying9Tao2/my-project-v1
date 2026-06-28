import { useState, useEffect, useCallback } from 'react';
import type { SensorState, GravityData, WeightReading } from '../types';
import { gravitySensor } from '../sensor/GravitySensor';
import { checkSensorPermission, requestSensorPermission } from '../sensor/permission';

export function useGravitySensor() {
  const [state, setState] = useState<SensorState>(() => gravitySensor.getState());
  const [permission, setPermission] = useState<{
    granted: boolean;
    loading: boolean;
    rationale?: string;
  }>({ granted: false, loading: true });

  useEffect(() => {
    const checkPermission = async () => {
      const perm = await checkSensorPermission();
      setPermission({
        granted: perm.granted,
        loading: false,
        rationale: perm.rationale,
      });
    };
    checkPermission();
  }, []);

  const requestPermission = useCallback(async () => {
    setPermission((prev) => ({ ...prev, loading: true }));
    try {
      const result = await requestSensorPermission();
      setPermission({
        granted: result.granted,
        loading: false,
        rationale: result.rationale,
      });
      return result.granted;
    } catch (error) {
      setPermission({
        granted: false,
        loading: false,
        rationale: error instanceof Error ? error.message : '权限请求失败',
      });
      return false;
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      await gravitySensor.initialize();
      setState(gravitySensor.getState());
      return true;
    } catch (error) {
      setState(gravitySensor.getState());
      return false;
    }
  }, []);

  const calibrate = useCallback(async () => {
    try {
      const offset = await gravitySensor.calibrate();
      setState(gravitySensor.getState());
      return offset;
    } catch (error) {
      setState(gravitySensor.getState());
      throw error;
    }
  }, []);

  const tare = useCallback(() => {
    gravitySensor.tare();
    setState(gravitySensor.getState());
  }, []);

  const startListening = useCallback(() => {
    gravitySensor.startListening();
    setState(gravitySensor.getState());
  }, []);

  const stopListening = useCallback(() => {
    gravitySensor.stopListening();
    setState(gravitySensor.getState());
  }, []);

  useEffect(() => {
    const handleData = (_data: GravityData) => {
      setState((prev) => ({
        ...prev,
        lastReading: gravitySensor.getLastReading(),
        currentWeight: gravitySensor.getCurrentWeight(),
      }));
    };

    const handleStatusChange = (status: SensorState['status']) => {
      setState((prev) => ({ ...prev, status }));
    };

    const handleError = (error: Error) => {
      setState((prev) => ({ ...prev, error: error.message }));
    };

    gravitySensor.on('data', handleData);
    gravitySensor.on('status-change', handleStatusChange);
    gravitySensor.on('error', handleError);

    return () => {
      gravitySensor.off('data', handleData);
      gravitySensor.off('status-change', handleStatusChange);
      gravitySensor.off('error', handleError);
    };
  }, []);

  return {
    ...state,
    permissionGranted: permission.granted,
    permissionLoading: permission.loading,
    permissionRationale: permission.rationale,
    requestPermission,
    initialize,
    calibrate,
    tare,
    startListening,
    stopListening,
    isStable: gravitySensor.isStable(),
    sensorInstance: gravitySensor,
  };
}

export function useWeightMonitoring(toiletId?: string) {
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isStable, setIsStable] = useState(false);
  const [history, setHistory] = useState<WeightReading[]>([]);
  const maxHistory = 60;

  useEffect(() => {
    const handleWeightChange = (reading: WeightReading) => {
      setCurrentWeight(reading.weight);
      setIsStable(reading.isStable);
      setHistory((prev) => {
        const updated = [...prev, reading];
        if (updated.length > maxHistory) {
          return updated.slice(-maxHistory);
        }
        return updated;
      });
    };

    gravitySensor.on('weight-change', handleWeightChange);

    return () => {
      gravitySensor.off('weight-change', handleWeightChange);
    };
  }, [toiletId]);

  return {
    currentWeight,
    isStable,
    history,
    clearHistory: () => setHistory([]),
  };
}

export function useSensorErrorHandler() {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const handleError = (error: Error) => {
      setErrors((prev) => [...prev, error.message].slice(-10));
    };

    gravitySensor.on('error', handleError);

    return () => {
      gravitySensor.off('error', handleError);
    };
  }, []);

  return {
    errors,
    clearErrors: () => setErrors([]),
    latestError: errors[errors.length - 1] || null,
  };
}
