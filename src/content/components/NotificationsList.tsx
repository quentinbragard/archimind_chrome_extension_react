import React from 'react';
import Button from '@/components/common/Button';
import { Notification } from '@/types/common';
import { formatTime } from '@/utils/formatting';

interface NotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onAction: (id: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onAction,
}) => {
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    if (type.startsWith('welcome')) return '👋';
    if (type.startsWith('insight')) return '💡';
    if (type.startsWith('alert')) return '⚠️';
    if (type.startsWith('error')) return '❌';
    if (type.startsWith('update')) return '🔄';
    if (type.startsWith('tip')) return '💬';
    return 'ℹ️';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <svg className="w-8 h-8 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="block text-xl mb-2">📬</span>
        <p className="text-gray-500">No unread notifications</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Unread Notifications</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onMarkAllAsRead}
          disabled={notifications.length === 0}
        >
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 bg-white border-l-4 border-primary rounded-md shadow-sm hover:shadow-md transition-shadow ${
              notification.read_at ? 'opacity-50' : ''
            }`}
          >
            <div className="flex gap-3">
              <div className="text-xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {formatTime(notification.created_at)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                
                <div className="flex justify-between mt-2">
                  {notification.action_button && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onAction(notification.id)}
                    >
                      {notification.action_button}
                    </Button>
                  )}
                  
                  {!notification.read_at && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto text-gray-500"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsList;