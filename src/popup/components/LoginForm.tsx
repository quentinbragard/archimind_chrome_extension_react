import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import { useToast } from '@/components/common/ToastProvider';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast({
        title: 'Error',
        message: 'Please enter both email and password',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signInWithEmail(email, password);
      showToast({
        title: 'Success',
        message: 'You have successfully signed in',
        type: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Sign in failed',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      showToast({
        title: 'Success',
        message: 'You have successfully signed in with Google',
        type: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Google sign in failed',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 p-6 min-h-[400px] flex flex-col">
      <div className="text-center mb-6">
        <img src="/icons/icon128.png" alt="Archimind Logo" className="w-16 h-16 mx-auto mb-2" />
        <h1 className="text-xl font-semibold">Sign in to Archimind</h1>
        <p className="text-sm text-gray-600 mt-1">Access your templates and analytics</p>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 mb-4"
        disabled={isLoading}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="h-5 w-5 mr-2"
        />
        <span>Sign in with Google</span>
      </button>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-xs text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-4 text-center">
        <a
          href="https://archimind.ai/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
};

export default LoginForm;