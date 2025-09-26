'use client';

import React from 'react';
import { StatsCards } from './StatsCards';
import { SalesChart } from './SalesChart';
import { RecentOrders } from './RecentOrders';
import { LowStockAlert } from './LowStockAlert';
import { PendingPayments } from './PendingPayments';
import { QuickActions } from './QuickActions';
import { ProductPerformanceChart } from './ProductPerformanceChart';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome back! 🚀
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <QuickActions />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <ProductPerformanceChart />
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LowStockAlert />
        </div>
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
      </div>

      {/* Pending Payments */}
      <PendingPayments />
    </div>
  );
}