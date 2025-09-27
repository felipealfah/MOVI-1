import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';
import { 
  LayoutDashboard, 
  Cpu, 
  Key, 
  History, 
  User,
  Code,
  Menu,
  X,
  LogOut,
  CreditCard,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
  onBuyCredits?: () => void;
}

const menuItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'apis' as View, label: 'APIs', icon: Cpu },
  { id: 'tokens' as View, label: 'API Tokens', icon: Key },
  { id: 'history' as View, label: 'History', icon: History },
  { id: 'profile' as View, label: 'Profile', icon: User },
];

export default function Sidebar({ currentView, onViewChange, isOpen, onToggle, onBuyCredits }: SidebarProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 border-r border-white
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `} style={{ backgroundColor: '#212121' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: '#131313' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <Code className="w-5 h-5" style={{ color: '#131313' }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">MoviAPI</h1>
                  <p className="text-xs text-white">v2.0</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="lg:hidden p-1 text-white hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onViewChange(item.id);
                        if (window.innerWidth < 1024) onToggle();
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 text-left
                        transition-all duration-200 group
                        ${isActive 
                          ? 'bg-white text-black' 
                          : 'text-white hover:bg-white hover:text-black'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? '' : 'text-white group-hover:text-black'}`} style={{ color: isActive ? '#131313' : undefined }} />
                      <span className="font-medium transition-colors duration-200">{item.label}</span>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: '#131313' }} />
                      )}
                    </button>
                  </li>
                );
              })}
              
              {/* Buy Credits Menu Item */}
              <li>
                <button
                  onClick={() => {
                    if (onBuyCredits) onBuyCredits();
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 group text-white hover:bg-white hover:text-black"
                >
                  <CreditCard className="w-5 h-5 transition-colors duration-200 text-white group-hover:text-black" />
                  <span className="font-medium transition-colors duration-200">Buy Credits</span>
                </button>
              </li>
              
              {/* Documentation Menu Item */}
              <li>
                <button
                  onClick={() => {
                    onViewChange('documentation');
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left
                    transition-all duration-200 group
                    ${currentView === 'documentation' 
                      ? 'bg-white text-black' 
                      : 'text-white hover:bg-white hover:text-black'
                    }
                  `}
                >
                  <BookOpen className={`w-5 h-5 transition-colors duration-200 ${currentView === 'documentation' ? '' : 'text-white group-hover:text-black'}`} style={{ color: currentView === 'documentation' ? '#131313' : undefined }} />
                  <span className="font-medium transition-colors duration-200">Documentation</span>
                  {currentView === 'documentation' && (
                    <div className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: '#131313' }} />
                  )}
                </button>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: '#131313' }}>
            <div className="p-4 border border-white" style={{ backgroundColor: '#131313' }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: '#131313' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-white">{user?.credits?.toLocaleString() || 0} credits</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1 text-white hover:text-gray-300 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}