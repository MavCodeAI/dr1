'use client';

import React from 'react';
import Link from 'next/link';
import { useRecentOrders } from '@/hooks/useQueries';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { EyeIcon } from '@heroicons/react/24/outline';
import { TableSkeleton } from '@/components/ui/LoadingScreen';

export function RecentOrders() {
  const { data: orders, isLoading, error } = useRecentOrders(5);

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          <TableSkeleton rows={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load recent orders</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          <Link
            href="/orders"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            View all
          </Link>
        </div>
        
        {orders && orders.length > 0 ? (
          <div className="overflow-hidden">
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        #{order.order_number}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-badge ${
                          getStatusColor(order.status)
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customer_name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    {order.order_items && order.order_items.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {order.order_items.length} item(s) •{' '}
                        {order.order_items.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )}{' '}
                        units
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your recent orders will appear here
            </p>
            <div className="mt-4">
              <Link
                href="/orders/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create First Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}