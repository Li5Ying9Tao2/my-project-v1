import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Notification } from '../../types';
import { formatTimeAgo } from '../../lib/utils';

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const getIconConfig = () => {
    switch (notification.type) {
      case 'warning':
        return {
          Icon: AlertTriangle,
          color: 'text-warning-500',
          bg: 'bg-warning-50',
        };
      case 'success':
        return {
          Icon: CheckCircle,
          color: 'text-success-500',
          bg: 'bg-success-50',
        };
      case 'error':
        return {
          Icon: XCircle,
          color: 'text-danger-500',
          bg: 'bg-danger-50',
        };
      default:
        return {
          Icon: Info,
          color: 'text-primary-500',
          bg: 'bg-primary-50',
        };
    }
  };

  const config = getIconConfig();
  const Icon = config.Icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl text-left transition-all active:scale-98',
        notification.read ? 'bg-white' : 'bg-primary-50 border border-primary-100'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg', config.bg)}>
          <Icon size={20} className={config.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-gray-800', !notification.read && 'text-primary-700')}>
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.timestamp)}</p>
        </div>
        {!notification.read && (
          <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
        )}
      </div>
    </button>
  );
}