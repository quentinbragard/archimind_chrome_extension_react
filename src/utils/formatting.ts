/**
 * Format a timestamp into a readable string
 * @param timestamp - Timestamp to format
 * @param options - Formatting options
 * @returns Formatted time string
 */
export function formatTime(
    timestamp: string | Date,
    options: { relative?: boolean } = {}
  ): string {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    if (options.relative) {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
    }
    
    // Default to formatted date
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  }
  
  /**
   * Truncate text to a specific length
   * @param text - Text to truncate
   * @param maxLength - Maximum length
   * @returns Truncated text
   */
  export function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Format a number with thousand separators
   * @param num - Number to format
   * @returns Formatted number string
   */
  export function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  }
  
  /**
   * Format a file size in bytes to a human-readable string
   * @param bytes - Size in bytes
   * @param decimals - Number of decimal places
   * @returns Formatted file size string
   */
  export function formatFileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }