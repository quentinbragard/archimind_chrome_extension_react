import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { User } from '@/types/common';

/**
 * Custom hook for authentication
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const userId = await authService.getUserId();
        
        if (userId) {
          // This is a simplified approach. In a real app, you might want to
          // fetch the full user profile from your backend
          setUser({ id: userId, email: 'user@example.com' });
        } else {
          setUser(null);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in with email and password
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authService.signInWithEmail(email, password);
      setUser(user);
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authService.signInWithGoogle();
      setUser(user);
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
}

export default useAuth;