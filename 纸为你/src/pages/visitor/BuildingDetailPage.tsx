import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockToilets, getBuildingById } from '../../data/mockData';
import type { Building, Toilet } from '../../types';

export default function BuildingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [building, setBuilding] = useState<Building | null>(null);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');

  useEffect(() => {
    if (id) {
      const b = getBuildingById(id);
      setBuilding(b || null);
      setToilets(mockToilets.filter((t) => t.buildingId === id));
    }
  }, [id]);

  if (!building) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <MapPin size={48} className="text-gray-300 mb-3" />
        <p className="text-gray-500">楼栋不存在</p>
        <button
          onClick={() => navigate('/visitor')}
          className="mt-4 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          返回地图
        </button>
      </div>
    );
  }

  const floors = Array.from(new Set(toilets.map((t) => t.floor))).sort((a, b) => a - b);

  const filteredToilets = selectedFloor === 'all'
    ? toilets
    : toilets.filter((t) => t.floor === selectedFloor);

  const getToiletTypeName = (type: Toilet['type']) => {
    switch (type) {
      case 'male': return '男卫生间';
      case 'female': return '女卫生间';
      case 'accessible': return '无障碍卫生间';
      default: return '未知';
    }
  };

  const insufficientCount = toilets.filter((t) => t.status === 'insufficient').length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/visitor')}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{building.name}</h2>
          <p className="text-sm text-gray-500">{building.location}</p>
        </div>
      </div>

      {insufficientCount > 0 && (
        <div className="mb-4 p-3 bg-danger-50 rounded-xl border border-danger-100">
          <div className="flex items-center gap-2 text-danger-700">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">
              该楼栋有 {insufficientCount} 个卫生间卫生纸不足
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setSelectedFloor('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedFloor === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          全部楼层
        </button>
        {floors.map((floor) => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFloor === floor
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {floor}楼
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredToilets.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">该楼层暂无卫生间数据</p>
          </div>
        ) : (
          filteredToilets.map((toilet) => (
            <div
              key={toilet.toiletId}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {getToiletTypeName(toilet.type)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {toilet.floor}楼 · {building.name}
                  </p>
                </div>
                <StatusBadge status={toilet.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">
                  剩余: <span className="font-medium text-gray-700">
                    {Math.round((toilet.currentWeight / toilet.initialWeight) * 100)}%
                  </span>
                </span>
                <span className="text-gray-400">
                  {toilet.currentWeight}g / {toilet.initialWeight}g
                </span>
              </div>

              <Link
                to={`/visitor/feedback/${toilet.toiletId}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors"
              >
                <Plus size={18} />
                <span>反馈问题</span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}