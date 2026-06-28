import { NavLink } from 'react-router-dom';
import { Map, MessageSquare, Bell, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';

const navItems = [
  { path: '/visitor', icon: Map, label: '地图', end: true },
  { path: '/visitor/my-feedback', icon: MessageSquare, label: '我的反馈', end: false },
];

export default function VisitorBottomNav() {
  const { logout, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 bg-white">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors touch-target',
                isActive ? 'text-primary-600' : 'text-gray-500 active:text-gray-700'
              )
            }
          >
            <item.icon size={22} strokeWidth={2} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/visitor/notifications"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors touch-target',
              isActive ? 'text-primary-600' : 'text-gray-500 active:text-gray-700'
            )
          }
        >
          <div className="relative">
            <Bell size={22} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-danger-500 rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">通知</span>
        </NavLink>
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-gray-500 active:text-gray-700 transition-colors touch-target"
        >
          <LogOut size={22} strokeWidth={2} />
          <span className="text-xs font-medium">退出</span>
        </button>
      </div>
    </nav>
  );
}