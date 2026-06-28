import { cn } from '../../lib/utils';
import type { ToiletStatus } from '../../types';

interface StatusBadgeProps {
  status: ToiletStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'sufficient':
        return {
          text: '充足',
          bg: 'bg-success-50',
          textColor: 'text-success-600',
          dot: 'bg-success-500',
        };
      case 'insufficient':
        return {
          text: '不足',
          bg: 'bg-danger-50',
          textColor: 'text-danger-600',
          dot: 'bg-danger-500',
        };
      case 'maintenance':
        return {
          text: '维护中',
          bg: 'bg-warning-50',
          textColor: 'text-warning-600',
          dot: 'bg-warning-500',
        };
      default:
        return {
          text: '未知',
          bg: 'bg-gray-50',
          textColor: 'text-gray-600',
          dot: 'bg-gray-500',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bg,
        config.textColor,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.text}
    </span>
  );
}