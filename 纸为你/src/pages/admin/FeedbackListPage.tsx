import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ChevronRight, Clock } from 'lucide-react';
import { getFeedbackTickets } from '../../data/mockData';
import { formatTimeAgo } from '../../lib/utils';
import type { FeedbackTicket } from '../../types';

export default function FeedbackListPage() {
  const [tickets, setTickets] = useState<FeedbackTicket[]>([]);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'verified' | 'resolved'>('all');

  useEffect(() => {
    setTickets(getFeedbackTickets());
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    return ticket.ticketStatus === filter;
  });

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">用户反馈</h2>
        <span className="text-sm text-gray-500">{filteredTickets.length}条反馈</span>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        {(['all', 'submitted', 'verified', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f === 'all' ? '全部' : f === 'submitted' ? '待处理' : f === 'verified' ? '已核实' : '已解决'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">暂无反馈</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.ticketStatus);
            return (
              <Link
                key={ticket.ticketId}
                to={`/admin/feedback/${ticket.ticketId}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
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
                  <span className="flex items-center gap-1">
                    {ticket.userType === 'student' ? '学生' : ticket.userType === 'staff' ? '教职工' : '匿名'}
                    <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}