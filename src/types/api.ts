import { Template, UserStats, Notification } from './common';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export interface ApiServiceOptions {
  baseUrl: string;
  tokenProvider: () => Promise<string>;
  refreshTokenProvider: () => Promise<string>;
}

export interface TemplateResponse {
  success: boolean;
  template?: Template;
  error?: string;
}

export interface TemplatesResponse {
  templates: Template[];
  folders: string[];
  templates_by_folder: Record<string, Template[]>;
}

export interface OfficialTemplatesResponse {
  templates: Template[];
  categories: Record<string, Template[]>;
}

export interface UserStatsResponse extends UserStats {
  lastFetch?: number;
}

export interface NotificationsCountResponse {
  total: number;
  unread: number;
}

export interface MessageResponse {
  success: boolean;
  message_id?: string;
  error?: string;
}

export interface ChatResponse {
  success: boolean;
  chat_id?: string;
  error?: string;
}

export interface EnhancedPromptResponse {
  success: boolean;
  enhanced_prompt: string;
  error?: string;
}