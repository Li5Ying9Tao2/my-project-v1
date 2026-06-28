import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockBuildings, mockToilets } from '../../data/mockData';
import type { Building, Toilet } from '../../types';

export default function MapPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [filter, setFilter] = useState<'all' | 'sufficient' | 'insufficient'>('all');

  useEffect(() => {
    setBuildings(mockBuildings);
    setToilets(mockToilets);
  }, []);

  const getBuildingToilets = (buildingId: string) => {
    return toilets.filter((t) => t.buildingId === buildingId);
  };

  const getBuildingStats = (buildingId: string) => {
    const buildingToilets = getBuildingToilets(buildingId);
    const sufficient = buildingToilets.filter((t) => t.status === 'sufficient').length;
    const insufficient = buildingToilets.filter((t) => t.status === 'insufficient').length;
    return { total: buildingToilets.length, sufficient, insufficient };
  };

  const filteredBuildings = buildings.filter((building) => {
    if (filter === 'all') return true;
    const buildingToilets = getBuildingToilets(building.id);
    if (filter === 'sufficient') {
      return buildingToilets.every((t) => t.status === 'sufficient');
    }
    return buildingToilets.some((t) => t.status === 'insufficient');
  });

  const getOverallStatus = (buildingId: string) => {
    const buildingToilets = getBuildingToilets(buildingId);
    if (buildingToilets.some((t) => t.status === 'insufficient')) return 'insufficient';
    if (buildingToilets.some((t) => t.status === 'maintenance')) return 'maintenance';
    return 'sufficient';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">校园地图</h2>
        <span className="text-sm text-gray-500">{filteredBuildings.length}个楼栋</span>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        {([
          { key: 'all', label: '全部' },
          { key: 'sufficient', label: '充足' },
          { key: 'insufficient', label: '有不足' },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredBuildings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">暂无符合条件的楼栋</p>
          </div>
        ) : (
          filteredBuildings.map((building) => {
            const stats = getBuildingStats(building.id);
            const overallStatus = getOverallStatus(building.id);

            return (
              <Link
                key={building.id}
                to={`/visitor/building/${building.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <MapPin size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{building.name}</h3>
                      <p className="text-sm text-gray-500">{building.location}</p>
                    </div>
                  </div>
                  <StatusBadge status={overallStatus} size="sm" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">
                      共<span className="font-medium text-gray-700">{stats.total}</span>个卫生间
                    </span>
                    {stats.sufficient > 0 && (
                      <span className="text-success-600">
                        {stats.sufficient}个充足
                      </span>
                    )}
                    {stats.insufficient > 0 && (
                      <span className="text-danger-600">
                        {stats.insufficient}个不足
                      </span>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </Link>
            );
          })
        )}
      </div>

      {toilets.some((t) => t.status === 'insufficient') && (
        <div className="mt-4 p-3 bg-warning-50 rounded-xl border border-warning-100">
          <div className="flex items-center gap-2 text-warning-700">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">
              当前有 {toilets.filter((t) => t.status === 'insufficient').length} 个卫生间卫生纸不足
            </span>
          </div>
        </div>
      )}
    </div>
  );
}