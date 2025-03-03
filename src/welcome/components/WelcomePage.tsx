import React, { useState } from 'react';
import Button from '@/components/common/Button';
import LoginForm from './LoginForm';
import { useToast } from '@/components/common/ToastProvider';

const WelcomePage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/icons/icon48.png" alt="Archimind Logo" className="h-10 w-10" />
            <h1 className="ml-3 text-xl font-semibold text-primary">Archimind</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowLoginModal(true)}
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-center text-white">
            <h2 className="text-3xl font-bold">Welcome to Archimind</h2>
            <p className="mt-2 text-lg opacity-90">Your personal AI assistant for ChatGPT</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700">
                Archimind helps you get more out of your ChatGPT experience by tracking conversations,
                optimizing prompts, and providing valuable insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FeatureCard
                icon="📊"
                title="Track Analytics"
                description="Monitor your usage patterns and get insights into your conversations."
              />
              <FeatureCard
                icon="✨"
                title="Enhance Prompts"
                description="Get suggestions to improve your prompts for better results."
              />
              <FeatureCard
                icon="📝"
                title="Save Templates"
                description="Save and organize your favorite prompts for quick access."
              />
            </div>

            <div className="text-center">
              <Button 
                variant="primary"
                size="lg"
                onClick={() => setShowLoginModal(true)}
              >
                Get Started
              </Button>
              <p className="mt-4 text-sm text-gray-500">
                Sign in to start using all features of Archimind
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Archimind. All rights reserved.
          </p>
          <div className="mt-2 text-sm text-gray-400">
            <a href="#" className="hover:text-white mx-2">Privacy Policy</a>
            <span className="mx-1">•</span>
            <a href="#" className="hover:text-white mx-2">Terms of Service</a>
            <span className="mx-1">•</span>
            <a href="#" className="hover:text-white mx-2">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sign In</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowLoginModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <LoginForm
              onSuccess={() => {
                setShowLoginModal(false);
                showToast({
                  title: 'Success',
                  message: 'You have successfully signed in! Now head to ChatGPT to start using Archimind.',
                  type: 'success'
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default WelcomePage;