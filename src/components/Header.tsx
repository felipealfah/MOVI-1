import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="border-b px-6 py-4" style={{ backgroundColor: '#212121', borderColor: '#131313' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-white hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            <input
              type="text"
              placeholder="Search APIs, documentation..."
              className="pl-10 pr-4 py-2 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white w-96 border border-white"
              style={{ backgroundColor: '#131313', borderColor: 'white' }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-white hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            </span>
          </button>
          
          <div className="flex items-center space-x-2 border border-white px-3 py-2" style={{ backgroundColor: '#131313' }}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm text-white">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}