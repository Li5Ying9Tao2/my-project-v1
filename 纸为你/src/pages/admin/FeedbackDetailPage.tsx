import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle, Phone, Clock, User } from 'lucide-react';
import { getFeedbackTicketById, mockDevices, mockEmergencyContacts } from '../../data/mockData';
import { formatDateTime } from '../../lib/utils';
import { BatteryIndicator } from '../../components/ui/BatteryIndicator';
import type { FeedbackTicket } from '../../types';

export default function FeedbackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<FeedbackTicket | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      const t = getFeedbackTicketById(parseInt(id));
      setTicket(t || null);
    }
  }, [id]);

  const handleVerify = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTicket((prev) => (prev ? { ...prev, ticketStatus: 'verified' } : null));
    setProcessing(false);
  };

  const handleResolve = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTicket((prev) =>
      prev ? { ...prev, ticketStatus: 'resolved', resolvedAt: new Date() } : null
    );
    setProcessing(false);
  };

  const handleEscalate = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTicket((prev) => (prev ? { ...prev, ticketStatus: 'escalated' } : null));
    setProcessing(false);
  };

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle size={48} className="text-gray-300 mb-3" />
        <p className="text-gray-500">反馈不存在</p>
        <button
          onClick={() => navigate('/admin/feedback')}
          className="mt-4 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          返回列表
        </button>
      </div>
    );
  }

  const device = ticket.toiletId ? mockDevices.find((d) => d.toiletId === ticket.toiletId) : null;
  const contact = mockEmergencyContacts[0];

  const getStatusConfig = (status: FeedbackTicket['ticketStatus']) => {
    switch (status) {
      case 'submitted':
        return { text: '待处理', color: 'text-warning-600', bg: 'bg-warning-50' };
      case 'verified':
        return { text: '已核实', color: 'text-primary-600', bg: 'bg-primary-50' };
      case 'resolved':
        return { text: '已解决', color: 'text-success-600', bg: 'bg-success-50' };
      case 'escalated':
        return { text: '已升级', color: 'text-danger-600', bg: 'bg-danger-50' };
      default:
        return { text: '未知', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const statusConfig = getStatusConfig(ticket.ticketStatus);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/admin/feedback')}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">反馈详情</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800">
                {ticket.toiletInfo?.buildingName || '未知位置'}
              </h3>
              <p className="text-sm text-gray-500">
                {ticket.toiletInfo?.floor || '-'}楼 -{' '}
                {ticket.toiletInfo?.type === 'male'
                  ? '男'
                  : ticket.toiletInfo?.type === 'female'
                  ? '女'
                  : '无障碍'}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}
            >
              {statusConfig.text}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User size={16} className="text-gray-400" />
              <span>
                反馈人:{' '}
                {ticket.userType === 'student'
                  ? '学生'
                  : ticket.userType === 'staff'
                  ? '教职工'
                  : '匿名用户'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} className="text-gray-400" />
              <span>提交时间: {formatDateTime(ticket.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-2">问题描述</h4>
          <p className="text-gray-600 text-sm">{ticket.description}</p>
        </div>

        {device && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-3">设备信息</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">设备ID</span>
                <span className="text-gray-700 font-mono">{device.deviceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">电池电量</span>
                <BatteryIndicator level={device.batteryLevel} showLabel size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">固件版本</span>
                <span className="text-gray-700">{device.firmwareVersion}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-3">紧急联系方式</h4>
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-primary-600" />
              <div>
                <p className="font-medium text-gray-800">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.role}</p>
              </div>
            </div>
            <span className="text-primary-600 font-medium">{contact.phone}</span>
          </a>
        </div>

        {ticket.ticketStatus !== 'resolved' && ticket.ticketStatus !== 'escalated' && (
          <div className="space-y-2">
            {ticket.ticketStatus === 'submitted' && (
              <button
                onClick={handleVerify}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50"
              >
                <Check size={20} />
                <span>核实并标记</span>
              </button>
            )}
            <button
              onClick={handleResolve}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success-600 text-white rounded-xl font-medium hover:bg-success-700 active:bg-success-800 transition-colors disabled:opacity-50"
            >
              <Check size={20} />
              <span>标记为已解决</span>
            </button>
            <button
              onClick={handleEscalate}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-warning-600 text-white rounded-xl font-medium hover:bg-warning-700 active:bg-warning-800 transition-colors disabled:opacity-50"
            >
              <AlertTriangle size={20} />
              <span>转维修</span>
            </button>
          </div>
        )}

        {ticket.resolvedAt && (
          <div className="bg-success-50 rounded-xl p-4 border border-success-100">
            <p className="text-success-600 text-sm">
              已于 {formatDateTime(ticket.resolvedAt)} 解决
            </p>
          </div>
        )}
      </div>
    </div>
  );
}