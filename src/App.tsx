import React, { useState } from 'react';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AuthPage from './components/auth/AuthPage';
import AuthCallback from './components/auth/AuthCallback';
import { Code } from 'lucide-react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/views/Dashboard';
import Apis from './components/views/Apis';
import Tokens from './components/views/Tokens';
import History from './components/views/History';
import Profile from './components/views/Profile';
import Documentation from './components/views/Documentation';
import BuyCreditsModal from './components/payments/BuyCreditsModal';
import ErrorBoundary from './components/ErrorBoundary';
import useErrorHandler from './hooks/useErrorHandler';

function AppContent() {
  const { user, loading, signOut, refreshUser } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

  // Initialize global error handling
  useErrorHandler();

  // Check if we're on the auth callback route
  const isAuthCallback = window.location.pathname === '/auth/callback';

  // Handle payment status
  useEffect(() => {
    const handlePaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        setPaymentMessage('Payment successful! Your credits have been added.');
        // Refresh user data to get updated credits with delay
        console.log('Payment successful, refreshing user data...');
        setTimeout(async () => {
          await refreshUser(true); // Skip loading state for background refresh
          console.log('User data refreshed after payment');
        }, 2000); // Wait 2 seconds for webhook to process
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        // Clear message after 5 seconds
        setTimeout(() => setPaymentMessage(null), 5000);
      } else if (paymentStatus === 'canceled') {
        setPaymentMessage('Payment was canceled.');
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        // Clear message after 3 seconds
        setTimeout(() => setPaymentMessage(null), 3000);
      }
    };

    handlePaymentStatus();
  }, [refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131313' }}>
        <div className="text-center relative">
          <button
            onClick={() => {
              console.log('Logout clicked');
              signOut();
            }}
            className="absolute -top-16 right-0 bg-white text-black px-4 py-2 font-medium hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
          <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
            <Code className="w-8 h-8 animate-pulse" style={{ color: '#131313' }} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">MoviAPI</h1>
          <p className="text-white opacity-60">Loading your workspace...</p>
          <div className="mt-4 text-xs text-white opacity-40">
            Debug: Loading state = {loading ? 'true' : 'false'}, User = {user ? 'exists' : 'null'}
          </div>
        </div>
      </div>
    );
  }

  // Handle auth callback route
  if (isAuthCallback) {
    return <AuthCallback />;
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'apis':
        return <Apis />;
      case 'tokens':
        return <Tokens />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'documentation':
        return <Documentation onViewChange={setCurrentView} onBuyCredits={() => setShowBuyCreditsModal(true)} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#131313' }}>
      {/* Payment Status Message */}
      {paymentMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 border border-white text-white max-w-sm" style={{ backgroundColor: '#212121' }}>
          <div className="flex items-center justify-between">
            <span>{paymentMessage}</span>
            <button
              onClick={() => setPaymentMessage(null)}
              className="ml-2 text-white hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="relative flex h-screen overflow-hidden">
        <ErrorBoundary componentName="Sidebar">
          <Sidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onBuyCredits={() => setShowBuyCreditsModal(true)}
          />
        </ErrorBoundary>

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <ErrorBoundary componentName="Header">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          </ErrorBoundary>
          <main className="flex-1 overflow-auto">
            <ErrorBoundary componentName={`${currentView}View`}>
              {currentView === 'dashboard' ? (
                <Dashboard onViewChange={setCurrentView} />
              ) : (
                renderView()
              )}
            </ErrorBoundary>
          </main>
        </div>

        {/* Buy Credits Modal */}
        <ErrorBoundary componentName="BuyCreditsModal">
          <BuyCreditsModal
            isOpen={showBuyCreditsModal}
            onClose={() => setShowBuyCreditsModal(false)}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary componentName="App">
      <AuthProvider>
        <DataProvider>
          <ErrorBoundary componentName="AuthProvider">
            <AppContent />
          </ErrorBoundary>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;