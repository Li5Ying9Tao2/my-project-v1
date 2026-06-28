import { Bell, Trash2 } from 'lucide-react';
import { NotificationCard } from '../../components/ui/NotificationCard';
import { useAppStore } from '../../store/useAppStore';

export default function VisitorNotificationsPage() {
  const { notifications, markNotificationAsRead, clearNotifications } = useAppStore();

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">通知中心</h2>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-1"
          >
            <Trash2 size={18} />
            <span className="text-sm">清空</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <Bell size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">暂无通知</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}