import { create } from 'zustand';
import type { UserRole, Toilet, FeedbackTicket, Notification, Building } from '../types';

interface AppState {
  role: UserRole | null;
  isLoggedIn: boolean;
  username: string | null;

  buildings: Building[];
  toilets: Toilet[];
  notifications: Notification[];

  setRole: (role: UserRole) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setUsername: (username: string | null) => void;
  logout: () => void;

  setBuildings: (buildings: Building[]) => void;
  setToilets: (toilets: Toilet[]) => void;
  updateToiletStatus: (toiletId: string, status: Toilet['status']) => void;

  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;

  addFeedbackTicket: (ticket: FeedbackTicket) => void;
  updateTicketStatus: (ticketId: number, status: FeedbackTicket['ticketStatus']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: null,
  isLoggedIn: false,
  username: null,

  buildings: [],
  toilets: [],
  notifications: [],

  setRole: (role) => set({ role }),

  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

  setUsername: (username) => set({ username }),

  logout: () => set({
    role: null,
    isLoggedIn: false,
    username: null,
    notifications: []
  }),

  setBuildings: (buildings) => set({ buildings }),

  setToilets: (toilets) => set({ toilets }),

  updateToiletStatus: (toiletId, status) => set((state) => ({
    toilets: state.toilets.map((toilet) =>
      toilet.toiletId === toiletId
        ? { ...toilet, status, lastUpdated: new Date() }
        : toilet
    )
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  markNotificationAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    )
  })),

  clearNotifications: () => set({ notifications: [] }),

  addFeedbackTicket: (_ticket) => set((state) => ({
    notifications: [
      {
        id: `notif-${Date.now()}`,
        title: '反馈已提交',
        message: `您的反馈已提交成功，管理员正在处理中`,
        type: 'success',
        timestamp: new Date(),
        read: false,
      },
      ...state.notifications,
    ]
  })),

  updateTicketStatus: (ticketId, _status) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === `ticket-${ticketId}`
        ? { ...n, read: true }
        : n
    )
  })),
}));