'use client';

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="text-center text-white px-8">
          <div className="mb-8">
            <div className="mx-auto h-20 w-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <span className="text-3xl font-bold">MB</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Multi-Product Business</h1>
          <p className="text-xl opacity-90 mb-8 max-w-md">
            Complete business management solution for your Shilajit, Dry Fruits, Honey, and reseller products.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🏔️</div>
              <div className="text-sm font-medium">Premium Shilajit</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🌰</div>
              <div className="text-sm font-medium">Dry Fruits</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🍯</div>
              <div className="text-sm font-medium">Pure Honey</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">💼</div>
              <div className="text-sm font-medium">Business Tools</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">MB</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Multi-Product Business</h2>
            <p className="text-gray-600 mt-2">Manage your business with ease</p>
          </div>

          {/* Auth Toggle */}
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <div className="mt-8">
            {isLogin ? <LoginForm /> : <SignUpForm />}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2025 Multi-Product Business. All rights reserved.</p>
            <p className="mt-1">Built by MiniMax Agent</p>
          </div>
        </div>
      </div>
    </div>
  );
}