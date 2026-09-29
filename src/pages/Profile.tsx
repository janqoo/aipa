import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 transition-colors py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {user?.name || 'User'}
              </h2>
              <p className="text-gray-400">
                {user?.email}
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <p className="text-white bg-gray-700 px-4 py-2 rounded-lg">
                {user?.name || 'Not set'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <p className="text-white bg-gray-700 px-4 py-2 rounded-lg">
                {user?.email || 'Not set'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Type
              </label>
              <p className="text-white bg-gray-700 px-4 py-2 rounded-lg capitalize">
                {user?.role || 'User'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Member Since
              </label>
              <p className="text-white bg-gray-700 px-4 py-2 rounded-lg">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-white mb-6">
            Account
          </h3>
          
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;