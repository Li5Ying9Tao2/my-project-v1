import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, BatteryLow, RefreshCw, CheckCircle } from 'lucide-react';
import { BatteryIndicator } from '../../components/ui/BatteryIndicator';
import { getSensorIssues, mockDevices } from '../../data/mockData';
import { formatTimeAgo } from '../../lib/utils';
import type { SensorIssue } from '../../types';

export default function SensorMonitorPage() {
  const [issues, setIssues] = useState<SensorIssue[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setIssues(getSensorIssues());
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIssues(getSensorIssues());
    setRefreshing(false);
  };

  const handleDismiss = (issueId: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
  };

  const lowBatteryIssues = issues.filter((i) => i.batteryLevel < 20);
  const sensorErrorIssues = issues.filter((i) => i.issue.includes('传感器'));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">传感器监控</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors active:scale-95"
        >
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-warning-50 rounded-xl p-4 border border-warning-100">
          <div className="flex items-center gap-2 mb-1">
            <BatteryLow size={18} className="text-warning-500" />
            <span className="text-sm text-warning-600 font-medium">低电量</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{lowBatteryIssues.length}</p>
          <p className="text-xs text-warning-400 mt-1">设备</p>
        </div>
        <div className="bg-danger-50 rounded-xl p-4 border border-danger-100">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-danger-500" />
            <span className="text-sm text-danger-600 font-medium">传感器异常</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{sensorErrorIssues.length}</p>
          <p className="text-xs text-danger-400 mt-1">设备</p>
        </div>
      </div>

      <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Activity size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">传感器系统运行正常</p>
            <p className="text-sm text-gray-500">
              共监测 {mockDevices.length} 个设备, 其中 {issues.length} 个需要注意
            </p>
          </div>
        </div>
      </div>

      <h3 className="font-medium text-gray-700 mb-3">异常告警</h3>

      <div className="space-y-3">
        {issues.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <CheckCircle size={48} className="mx-auto text-success-300 mb-3" />
            <p className="text-gray-500">所有传感器运行正常</p>
          </div>
        ) : (
          issues.map((issue) => {
            const isLowBattery = issue.batteryLevel < 20;
            const isSensorError = issue.issue.includes('传感器');

            return (
              <div
                key={issue.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isLowBattery ? 'bg-warning-50' : isSensorError ? 'bg-danger-50' : 'bg-gray-50'
                    }`}
                  >
                    {isLowBattery ? (
                      <BatteryLow size={20} className="text-warning-500" />
                    ) : isSensorError ? (
                      <AlertTriangle size={20} className="text-danger-500" />
                    ) : (
                      <Activity size={20} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {issue.bathroomLocation}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{issue.issue}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{formatTimeAgo(issue.detectedAt)}</span>
                        <span className="font-mono">{issue.deviceId}</span>
                      </div>
                      <BatteryIndicator level={issue.batteryLevel} size="sm" />
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismiss(issue.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}