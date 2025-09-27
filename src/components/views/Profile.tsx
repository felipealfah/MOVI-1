import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BuyCreditsModal from '../payments/BuyCreditsModal';
import { User, CreditCard, Settings, Shield, Bell } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
        <p className="text-gray-500">Manage your personal information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="border border-white rounded-2xl p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-white" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full border border-white rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                    style={{ backgroundColor: '#131313' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">E-mail</label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full border border-white rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                    style={{ backgroundColor: '#131313' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Company</label>
                <input
                  type="text"
                  placeholder="Your company name"
                  className="w-full border border-white rounded-lg px-3 py-2 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                  style={{ backgroundColor: '#131313' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself"
                  className="w-full border border-white rounded-lg px-3 py-2 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                  style={{ backgroundColor: '#131313' }}
                />
              </div>
              <button className="bg-white text-black font-medium px-6 py-2 rounded-lg hover:bg-white transition-all duration-200">
                Save Changes
              </button>
            </div>
          </div>
          {/* Security Settings */}
          <div className="border border-white rounded-2xl p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-white" />
              Security
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Change Password</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full border border-white rounded-lg px-3 py-2 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                    style={{ backgroundColor: '#131313' }}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full border border-white rounded-lg px-3 py-2 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                    style={{ backgroundColor: '#131313' }}
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full border border-white rounded-lg px-3 py-2 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                    style={{ backgroundColor: '#131313' }}
                  />
                </div>
                <button className="mt-3 bg-white hover:bg-white text-black font-medium px-4 py-2 rounded-lg transition-colors">
                  Update Password
                </button>
              </div>

              <div className="border-t border-white pt-6">
                <h3 className="text-lg font-medium text-white mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border border-white rounded-lg" style={{ backgroundColor: '#131313' }}>
                  <div>
                    <p className="text-white font-medium">2FA</p>
                    <p className="text-white text-sm">Add an extra layer of security</p>
                  </div>
                  <button className="bg-white hover:bg-white text-black font-medium px-4 py-2 rounded-lg transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <div className="border border-white rounded-2xl p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-white" />
              Account
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-white rounded-lg" style={{ backgroundColor: '#131313' }}>
                <div>
                  <p className="text-white font-medium">Plan</p>
                  <p className="text-white text-sm">Professional</p>
                </div>
                <span className="bg-white text-black px-3 py-1 rounded-lg text-sm font-medium">
                  Pro
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-white rounded-lg" style={{ backgroundColor: '#131313' }}>
                <div>
                  <p className="text-white font-medium">Credits</p>
                  <p className="text-white text-sm">Current balance</p>
                </div>
                <span className="text-white font-bold text-lg">
                  {user.credits.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-white rounded-lg" style={{ backgroundColor: '#131313' }}>
                <div>
                  <p className="text-white font-medium">Member since</p>
                  <p className="text-white text-sm">
                    {new Date(user.created_at).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowBuyCreditsModal(true)}
                className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-white transition-all duration-200"
              >
                Buy Credits
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-white rounded-2xl p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-white" />
              Notifications
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Promotional emails', checked: true },
                { label: 'API usage alerts', checked: true },
                { label: 'Security notifications', checked: true },
                { label: 'Product updates', checked: false }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white">{item.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="w-4 h-4 text-white bg-black border-white rounded focus:ring-white focus:ring-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="border border-white rounded-2xl p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-white" />
              Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Time Zone</label>
                <select className="w-full border border-white rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white" style={{ backgroundColor: '#131313' }}>
                  <option>America/New_York</option>
                  <option>UTC</option>
                  <option>America/Los_Angeles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Language</label>
                <select className="w-full border border-white rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white" style={{ backgroundColor: '#131313' }}>
                  <option>English</option>
                  <option>Português (Brasil)</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BuyCreditsModal 
        isOpen={showBuyCreditsModal} 
        onClose={() => setShowBuyCreditsModal(false)} 
      />
    </div>
  );
}