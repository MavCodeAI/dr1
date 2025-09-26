'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({ 
  message = "Loading...", 
  className 
}: LoadingScreenProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-white z-50 flex items-center justify-center",
      className
    )}>
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">MB</span>
          </div>
        </div>
        
        {/* Loading animation */}
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
        
        {/* Loading message */}
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          {message}
        </p>
        
        {/* Loading dots */}
        <div className="mt-4 flex justify-center space-x-1">
          <div className="animate-bounce bg-primary-600 w-2 h-2 rounded-full" style={{ animationDelay: '0ms' }}></div>
          <div className="animate-bounce bg-primary-600 w-2 h-2 rounded-full" style={{ animationDelay: '150ms' }}></div>
          <div className="animate-bounce bg-primary-600 w-2 h-2 rounded-full" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loading components
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
        
        {/* Rows */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse bg-white p-6 rounded-lg shadow">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}