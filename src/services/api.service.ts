import { 
    ApiServiceOptions, 
    RequestOptions,
    TemplateResponse,
    TemplatesResponse,
    OfficialTemplatesResponse,
    UserStatsResponse,
    NotificationsCountResponse,
    MessageResponse,
    ChatResponse,
    EnhancedPromptResponse
  } from '@/types/api';
  import { 
    ChatData, 
    MessageData, 
    Notification, 
    Template, 
    UserStats 
  } from '@/types/common';
  
  class ApiService {
    private baseUrl: string;
    private tokenProvider: () => Promise<string>;
    private refreshTokenProvider: () => Promise<string>;
  
    constructor(options: ApiServiceOptions) {
      this.baseUrl = options.baseUrl;
      this.tokenProvider = options.tokenProvider;
      this.refreshTokenProvider = options.refreshTokenProvider;
    }
  
    /**
     * Makes an API request with token handling
     */
    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
      try {
        // Get auth token
        let token = await this.tokenProvider();
        
        // Set default options
        const defaultOptions: RequestOptions = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Merge options
        const fetchOptions: RequestInit = {
          ...defaultOptions,
          ...options,
          headers: {
            ...defaultOptions.headers,
            ...options.headers
          }
        };
  
        // Handle query parameters
        let url = `${this.baseUrl}${endpoint}`;
        if (options.params) {
          const queryParams = new URLSearchParams();
          Object.entries(options.params).forEach(([key, value]) => {
            queryParams.append(key, String(value));
          });
          url += `?${queryParams.toString()}`;
        }
        
        // Make request
        const response = await fetch(url, fetchOptions);
        
        // Handle unauthorized (token expired)
        if (response.status === 403) {
          console.log('🔄 Token expired, refreshing...');
          token = await this.refreshTokenProvider();
          
          // Update authorization header with new token
          const newOptions = {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              'Authorization': `Bearer ${token}`
            }
          };
          
          // Retry request with new token
          return this.request<T>(endpoint, options);
        }
        
        // Handle error responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || `API error: ${response.status}`);
        }
        
        // Parse response
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`❌ API request failed (${endpoint}):`, error);
        throw error;
      }
    }
  
    /**
     * Get user statistics
     */
    async getUserStats(): Promise<UserStatsResponse> {
      return this.request<UserStatsResponse>('/stats/user');
    }
  
    /**
     * Get user's prompt templates
     */
    async getUserTemplates(): Promise<TemplatesResponse> {
      return this.request<TemplatesResponse>('/prompt-templates/templates');
    }
  
    /**
     * Get official prompt templates
     */
    async getOfficialTemplates(): Promise<OfficialTemplatesResponse> {
      return this.request<OfficialTemplatesResponse>('/prompt-templates/official-templates');
    }
  
    /**
     * Create a new template
     */
    async createTemplate(templateData: Partial<Template>): Promise<TemplateResponse> {
      return this.request<TemplateResponse>('/prompt-templates/template', {
        method: 'POST',
        body: JSON.stringify(templateData)
      });
    }
  
    /**
     * Update a template
     */
    async updateTemplate(templateId: string, templateData: Partial<Template>): Promise<TemplateResponse> {
      return this.request<TemplateResponse>(`/prompt-templates/template/${templateId}`, {
        method: 'PUT',
        body: JSON.stringify(templateData)
      });
    }
  
    /**
     * Delete a template
     */
    async deleteTemplate(templateId: string): Promise<TemplateResponse> {
      return this.request<TemplateResponse>(`/prompt-templates/template/${templateId}`, {
        method: 'DELETE'
      });
    }
  
    /**
     * Track template usage
     */
    async trackTemplateUsage(templateId: string): Promise<TemplateResponse> {
      return this.request<TemplateResponse>(`/prompt-templates/use-template/${templateId}`, {
        method: 'POST'
      });
    }
  
    /**
     * Save chat to backend
     */
    async saveChat(chatData: ChatData): Promise<ChatResponse> {
      return this.request<ChatResponse>('/save/chat', {
        method: 'POST',
        body: JSON.stringify({
          provider_chat_id: chatData.chatId,
          title: chatData.chatTitle,
          provider_name: chatData.providerName
        })
      });
    }
  
    /**
     * Save message to backend
     */
    async saveMessage(messageData: MessageData): Promise<MessageResponse> {
      return this.request<MessageResponse>('/save/message', {
        method: 'POST',
        body: JSON.stringify({
          message_id: messageData.messageId,
          content: messageData.message,
          role: messageData.role,
          rank: messageData.rank,
          provider_chat_id: messageData.providerChatId,
          model: messageData.model || 'unknown',
          thinking_time: messageData.thinkingTime || 0
        })
      });
    }
  
    /**
     * Fetch all notifications
     */
    async getNotifications(): Promise<Notification[]> {
      return this.request<Notification[]>('/notifications/');
    }
  
    /**
     * Fetch unread notifications
     */
    async getUnreadNotifications(): Promise<Notification[]> {
      return this.request<Notification[]>('/notifications/unread');
    }
  
    /**
     * Get notification counts
     */
    async getNotificationCounts(): Promise<NotificationsCountResponse> {
      return this.request<NotificationsCountResponse>('/notifications/count');
    }
  
    /**
     * Mark notification as read
     */
    async markNotificationRead(notificationId: string): Promise<{ success: boolean }> {
      return this.request<{ success: boolean }>(`/notifications/${notificationId}/read`, {
        method: 'POST'
      });
    }
  
    /**
     * Mark all notifications as read
     */
    async markAllNotificationsRead(): Promise<{ success: boolean }> {
      return this.request<{ success: boolean }>('/notifications/read-all', {
        method: 'POST'
      });
    }
  
    /**
     * Enhance a prompt
     */
    async enhancePrompt(draft_prompt: string): Promise<EnhancedPromptResponse> {
      return this.request<EnhancedPromptResponse>('/prompt-generator/enhance', {
        method: 'POST',
        body: JSON.stringify({ draft_prompt })
      });
    }
  }
  
  // Create the API service instance with default configuration
  export const apiService = new ApiService({
    baseUrl: 'http://127.0.0.1:8000', // You might want to make this configurable
    tokenProvider: async () => {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getAuthToken" }, (response) => {
          if (chrome.runtime.lastError || !response.success) {
            reject("Failed to get auth token");
          } else {
            resolve(response.token);
          }
        });
      });
    },
    refreshTokenProvider: async () => {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "refreshAuthToken" }, (response) => {
          if (chrome.runtime.lastError || !response.success) {
            reject("Failed to refresh auth token");
          } else {
            resolve(response.token);
          }
        });
      });
    }
  });
  
  export default ApiService;