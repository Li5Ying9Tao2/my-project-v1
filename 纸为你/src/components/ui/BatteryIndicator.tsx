import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BatteryIndicatorProps {
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BatteryIndicator({ level, showLabel = false, size = 'md' }: BatteryIndicatorProps) {
  const getBatteryConfig = () => {
    if (level <= 20) {
      return {
        color: 'text-danger-500',
        bg: 'bg-danger-100',
        Icon: BatteryLow,
        label: '低电量',
      };
    }
    if (level <= 50) {
      return {
        color: 'text-warning-500',
        bg: 'bg-warning-100',
        Icon: BatteryMedium,
        label: '中等',
      };
    }
    return {
      color: 'text-success-500',
      bg: 'bg-success-100',
      Icon: BatteryFull,
      label: '充足',
    };
  };

  const config = getBatteryConfig();
  const Icon = config.Icon;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={cn('flex items-center gap-1.5', config.color)}>
      <Icon className={sizeClasses[size]} />
      {showLabel && (
        <span className="text-sm font-medium">
          {level}% {config.label}
        </span>
      )}
    </div>
  );
}