import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BatteryIndicator } from '../../components/ui/BatteryIndicator';
import { mockToilets, mockDevices } from '../../data/mockData';
import { formatTimeAgo } from '../../lib/utils';
import type { Toilet } from '../../types';

export default function AdminDashboard() {
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [filter, setFilter] = useState<'all' | 'insufficient' | 'maintenance'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setToilets(mockToilets);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setToilets([...mockToilets]);
    setRefreshing(false);
  };

  const filteredToilets = toilets.filter((toilet) => {
    if (filter === 'all') return true;
    return toilet.status === filter;
  });

  const insufficientCount = toilets.filter((t) => t.status === 'insufficient').length;
  const maintenanceCount = toilets.filter((t) => t.status === 'maintenance').length;

  const getDeviceForToilet = (toiletId: string) => {
    return mockDevices.find((d) => d.toiletId === toiletId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">卫生纸预警</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors active:scale-95"
        >
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-danger-50 rounded-xl p-4 border border-danger-100">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-danger-500" />
            <span className="text-sm text-danger-600 font-medium">不足</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{insufficientCount}</p>
          <p className="text-xs text-danger-400 mt-1">个卫生间</p>
        </div>
        <div className="bg-warning-50 rounded-xl p-4 border border-warning-100">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={18} className="text-warning-500" />
            <span className="text-sm text-warning-600 font-medium">维护中</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{maintenanceCount}</p>
          <p className="text-xs text-warning-400 mt-1">个卫生间</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        {(['all', 'insufficient', 'maintenance'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f === 'all' ? '全部' : f === 'insufficient' ? '不足' : '维护中'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredToilets.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <CheckCircle size={48} className="mx-auto text-success-300 mb-3" />
            <p className="text-gray-500">暂无{filter === 'all' ? '' : filter === 'insufficient' ? '不足' : '维护中'}的卫生间</p>
          </div>
        ) : (
          filteredToilets.map((toilet) => {
            const device = getDeviceForToilet(toilet.toiletId);
            return (
              <div
                key={toilet.toiletId}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {toilet.buildingName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {toilet.floor}楼 - {toilet.type === 'male' ? '男' : toilet.type === 'female' ? '女' : '无障碍'}
                    </p>
                  </div>
                  <StatusBadge status={toilet.status} size="sm" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-500">当前重量: </span>
                      <span className="font-medium text-gray-700">
                        {toilet.currentWeight}g / {toilet.initialWeight}g
                      </span>
                    </div>
                  </div>
                  {device && (
                    <BatteryIndicator level={device.batteryLevel} size="sm" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-400">
                    最后更新: {formatTimeAgo(toilet.lastUpdated)}
                  </span>
                  {device && (
                    <span className="text-xs text-gray-400">
                      设备: {device.deviceId}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}