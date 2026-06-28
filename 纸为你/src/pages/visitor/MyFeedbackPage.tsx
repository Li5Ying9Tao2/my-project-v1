import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { getFeedbackTickets } from '../../data/mockData';
import { formatTimeAgo } from '../../lib/utils';
import type { FeedbackTicket } from '../../types';

export default function MyFeedbackPage() {
  const [tickets, setTickets] = useState<FeedbackTicket[]>([]);

  useEffect(() => {
    setTickets(getFeedbackTickets());
  }, []);

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

  const getProblemTypeText = (type: FeedbackTicket['problemType']) => {
    switch (type) {
      case 'empty':
        return '卫生纸用完';
      case 'malfunction':
        return '设备故障';
      case 'other':
        return '其他问题';
      default:
        return '未知';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">我的反馈</h2>

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">您还没有提交过反馈</p>
            <Link
              to="/visitor"
              className="inline-block mt-4 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              去地图看看
            </Link>
          </div>
        ) : (
          tickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.ticketStatus);
            return (
              <div
                key={ticket.ticketId}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {ticket.toiletInfo?.buildingName || '未知位置'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ticket.toiletInfo?.floor || '-'}楼 - {getProblemTypeText(ticket.problemType)}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.text}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{ticket.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatTimeAgo(ticket.createdAt)}
                  </span>
                  {ticket.ticketStatus === 'resolved' && (
                    <span className="flex items-center gap-1 text-success-600">
                      <CheckCircle size={12} />
                      已解决
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