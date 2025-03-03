import { ReactNode } from 'react';
import { Notification, Template, UserStats, ToastNotification } from './common';

// Common Props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// Button Props
export interface ButtonProps extends BaseProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  isLoading?: boolean;
}

// Main Button Props
export interface MainButtonProps {
  notification?: string | null;
  pulse?: boolean;
  important?: boolean;
  onClick?: () => void;
}

// Modal Props
export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  footer?: ReactNode;
}

// Toast Props
export interface ToastProps {
  notification: ToastNotification;
  duration?: number;
  onClose?: () => void;
}

// Notification Props
export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onAction: (id: string) => void;
}

export interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onAction: (id: string) => void;
}

// Template Props
export interface TemplateItemProps {
  template: Template;
  onClick: (template: Template) => void;
  onPreview: (template: Template) => void;
}

export interface TemplatesListProps {
  templates: Template[];
  folders: string[];
  onUseTemplate: (template: Template) => void;
  onPreviewTemplate: (template: Template) => void;
  onCreateTemplate: () => void;
}

export interface TemplateFormProps {
  template?: Template;
  folders: string[];
  onSave: (template: Template) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

// Stats Props
export interface StatsPanelProps {
  stats: UserStats;
  isLoading?: boolean;
}

export interface StatItemProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  tooltip?: string;
  unit?: string;
}

// Quick Actions Props
export interface QuickActionProps {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
  onClick: () => void;
}

export interface QuickActionsListProps {
  actions: QuickActionProps[];
}