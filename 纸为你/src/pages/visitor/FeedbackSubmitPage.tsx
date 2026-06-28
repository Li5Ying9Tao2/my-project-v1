import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { mockToilets, getBuildingById } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { Toilet, ProblemType } from '../../types';

export default function FeedbackSubmitPage() {
  const { toiletId } = useParams<{ toiletId: string }>();
  const navigate = useNavigate();
  const { addFeedbackTicket } = useAppStore();

  const [toilet, setToilet] = useState<Toilet | null>(null);
  const [problemType, setProblemType] = useState<ProblemType>('empty');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (toiletId) {
      const t = mockToilets.find((toilet) => toilet.toiletId === toiletId);
      setToilet(t || null);
    }
  }, [toiletId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('请输入问题描述');
      return;
    }

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const ticket = {
      ticketId: Date.now(),
      toiletId: toiletId || '',
      toiletInfo: toilet || undefined,
      userType: 'anonymous' as const,
      problemType,
      description: description.trim(),
      ticketStatus: 'submitted' as const,
      createdAt: new Date(),
      isDeleted: false,
    };

    addFeedbackTicket(ticket);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-success-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">反馈已提交</h2>
        <p className="text-gray-600 text-center mb-6">
          感谢您的反馈，管理员已收到通知<br />正在尽快处理中
        </p>
        <button
          onClick={() => navigate('/visitor')}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
        >
          返回地图
        </button>
      </div>
    );
  }

  if (!toilet) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle size={48} className="text-gray-300 mb-3" />
        <p className="text-gray-500">卫生间不存在</p>
        <button
          onClick={() => navigate('/visitor')}
          className="mt-4 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          返回地图
        </button>
      </div>
    );
  }

  const building = getBuildingById(toilet.buildingId);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">反馈问题</h2>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <MapPin size={20} className="text-primary-500" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{building?.name || '未知'}</p>
            <p className="text-sm text-gray-500">
              {toilet.floor}楼 · {toilet.type === 'male' ? '男' : toilet.type === 'female' ? '女' : '无障碍'}卫生间
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            问题类型
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'empty', label: '卫生纸用完' },
              { key: 'malfunction', label: '设备故障' },
              { key: 'other', label: '其他问题' },
            ] as const).map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setProblemType(type.key)}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  problemType === type.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            问题描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请详细描述您遇到的问题..."
            rows={4}
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-danger-50 border border-danger-100 rounded-xl">
            <p className="text-sm text-danger-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={20} />
              <span>提交反馈</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}