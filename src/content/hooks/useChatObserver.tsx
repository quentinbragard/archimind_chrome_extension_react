import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api.service';
import { useToast } from '@/components/common/ToastProvider';

/**
 * Custom hook to observe chat for new messages and save them to the backend
 */
export default function useChatObserver(chatId: string | null) {
  const [lastProcessedTurn, setLastProcessedTurn] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  // Reset when chat ID changes
  useEffect(() => {
    setLastProcessedTurn(0);
    setIsProcessing(false);
  }, [chatId]);

  // Process a new message
  const processMessage = useCallback(
    async (article: Element) => {
      if (!chatId || isProcessing) return;

      try {
        setIsProcessing(true);

        // Extract turn number
        const dataTestId = article.getAttribute('data-testid');
        const match = dataTestId ? dataTestId.match(/conversation-turn-(\d+)/) : null;
        const turnNumber = match ? parseInt(match[1], 10) : null;

        if (turnNumber === null || turnNumber <= lastProcessedTurn) {
          setIsProcessing(false);
          return;
        }

        console.log(`🔄 Processing turn ${turnNumber}`);

        // Save chat title first
        const chatTitle = getChatTitle() || `Chat ${chatId}`;
        await apiService.saveChat({
          chatId,
          chatTitle,
          providerName: 'chatGPT',
        });

        // Extract and save user message
        const userMessageDiv = article.querySelector('div[data-message-author-role="user"]');
        if (userMessageDiv) {
          const messageId = userMessageDiv.getAttribute('data-message-id');
          const messageText = userMessageDiv.textContent?.trim() || '';
          
          if (messageId && messageText) {
            await apiService.saveMessage({
              messageId,
              message: messageText,
              role: 'user',
              rank: turnNumber - 1, // 0-based rank
              providerChatId: chatId,
            });
            console.log('✅ User message saved');
          }
        }

        // Extract and save assistant message
        const assistantMessageDiv = article.querySelector('div[data-message-author-role="assistant"]');
        if (assistantMessageDiv) {
          const messageId = assistantMessageDiv.getAttribute('data-message-id');
          const messageText = assistantMessageDiv.textContent?.trim() || '';
          
          if (messageId && messageText) {
            // Get model info
            const model = getModelInfo() || 'unknown';
            
            // Calculate thinking time (simplified, would be more complex in real implementation)
            const thinkingTime = 1.5; // Mock value, would be tracked in real implementation
            
            await apiService.saveMessage({
              messageId,
              message: messageText,
              role: 'assistant',
              rank: turnNumber - 1, // 0-based rank
              providerChatId: chatId,
              model,
              thinkingTime,
            });
            console.log('✅ Assistant message saved');
          }
        }

        // Update last processed turn
        setLastProcessedTurn(turnNumber);
      } catch (error) {
        console.error('❌ Error processing message:', error);
        showToast({
          title: 'Error',
          message: 'Failed to save conversation data',
          type: 'error',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [chatId, isProcessing, lastProcessedTurn, showToast]
  );

  // Observe DOM for new messages
  useEffect(() => {
    if (!chatId) return;

    console.log('👀 Starting chat observer for chatId:', chatId);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check for new conversation turns
          const articles = document.querySelectorAll('article[data-testid^="conversation-turn-"]');
          if (articles.length > 0) {
            // Process the latest article
            const latestArticle = articles[articles.length - 1];
            processMessage(latestArticle);
          }
        }
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Process any existing messages
    const existingArticles = document.querySelectorAll('article[data-testid^="conversation-turn-"]');
    if (existingArticles.length > 0) {
      // Process each article
      existingArticles.forEach((article) => {
        processMessage(article);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [chatId, processMessage]);

  return { lastProcessedTurn, isProcessing };
}

/**
 * Helper function to get the current chat title
 */
function getChatTitle(): string | null {
  // Try to get the title from the DOM
  const titleElement = document.querySelector('title');
  if (titleElement) {
    const title = titleElement.textContent;
    if (title && title !== 'ChatGPT' && !title.includes('New chat')) {
      return title.replace(' - ChatGPT', '');
    }
  }

  // Try to get from sidebar if available
  const activeLink = document.querySelector('a[href^="/c/"][aria-current="page"]');
  if (activeLink) {
    const title = activeLink.textContent?.trim();
    if (title && title !== 'New chat') {
      return title;
    }
  }

  return null;
}

/**
 * Helper function to get the model info
 */
function getModelInfo(): string | null {
  const modelButton = document.querySelector('button[data-testid="model-switcher-dropdown-button"]');
  if (modelButton) {
    return modelButton.textContent?.trim() || null;
  }
  
  // Fallback for custom GPT
  const customGptButton = document.querySelector('div[data-testid="undefined-button"]');
  if (customGptButton) {
    return customGptButton.textContent?.trim() || null;
  }
  
  return null;
}