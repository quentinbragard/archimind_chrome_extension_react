import { useState, useEffect } from 'react';

/**
 * Custom hook to listen for URL changes and extract chat ID
 */
export default function useUrlChangeListener() {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);
  const [currentChatId, setCurrentChatId] = useState<string | null>(extractChatId(window.location.href));

  useEffect(() => {
    // Check URL every second
    const intervalId = setInterval(() => {
      const newUrl = window.location.href;
      if (newUrl !== currentUrl) {
        console.log('🔄 URL changed:', newUrl);
        setCurrentUrl(newUrl);
        
        const chatId = extractChatId(newUrl);
        if (chatId !== currentChatId) {
          console.log('🆔 Chat ID changed:', chatId);
          setCurrentChatId(chatId);
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentUrl, currentChatId]);

  return { currentUrl, currentChatId };
}

/**
 * Extract chat ID from URL
 */
function extractChatId(url: string): string | null {
  const match = url.match(/\/c\/([^/?]+)/);
  return match && match[1] ? match[1].trim() : null;
}