/**
 * Common types used throughout the application
 */

export interface User {
    id: string;
    email: string;
    name?: string;
    profile_image?: string;
  }
  
  export interface AuthSession {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
  
  export interface ChatData {
    chatId: string;
    chatTitle: string;
    providerName: string;
  }
  
  export interface MessageData {
    messageId: string;
    message: string;
    role: 'user' | 'assistant' | 'system';
    rank: number;
    providerChatId: string;
    model?: string;
    thinkingTime?: number;
  }
  
  export interface Template {
    id: string;
    name: string;
    content: string;
    description?: string;
    folder?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Notification {
    id: string;
    title: string;
    body: string;
    type: string;
    read_at: string | null;
    created_at: string;
    action_button?: string;
  }
  
  export interface UserStats {
    total_prompts: number;
    average_score: number;
    energy_usage: number;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface ToastNotification {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }