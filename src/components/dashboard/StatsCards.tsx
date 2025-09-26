'use client';

import React from 'react';
import {
  BanknotesIcon,
  ShoppingCartIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';
import { useDashboardAnalytics } from '@/hooks/useQueries';
import { formatCurrency } from '@/lib/utils';
import { CardSkeleton } from '@/components/ui/LoadingScreen';

export function StatsCards() {
  const { data: analytics, isLoading, error } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Today\'s Sales',
      value: formatCurrency(analytics?.today_sales || 0),
      icon: BanknotesIcon,
      change: '+12%',
      changeType: 'positive' as const,
      description: 'from yesterday',
    },
    {
      name: 'Total Orders',
      value: analytics?.today_orders || 0,
      icon: ShoppingCartIcon,
      change: '+8%',
      changeType: 'positive' as const,
      description: 'today',
    },
    {
      name: 'Pending Orders',
      value: analytics?.pending_orders || 0,
      icon: CubeIcon,
      change: '-2%',
      changeType: 'negative' as const,
      description: 'vs last week',
    },
    {
      name: 'Pending Payments',
      value: formatCurrency(analytics?.pending_payments || 0),
      icon: ExclamationTriangleIcon,
      change: '+5%',
      changeType: 'neutral' as const,
      description: 'to collect',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-4 sm:pt-6 sm:px-6 rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <dt>
              <div className="absolute bg-primary-500 rounded-md p-3">
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : stat.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {stat.changeType === 'positive' ? (
                  <TrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                ) : stat.changeType === 'negative' ? (
                  <TrendingDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                ) : null}
                <span className="sr-only">
                  {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                </span>
                {stat.change}
              </p>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">{stat.description}</span>
                </div>
              </div>
            </dd>
          </div>
        );
      })}
    </div>
  );
}