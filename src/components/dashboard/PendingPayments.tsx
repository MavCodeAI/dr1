'use client';

import React from 'react';
import Link from 'next/link';
import { usePendingPayments } from '@/hooks/useQueries';
import { formatCurrency, formatDate, getPaymentMethodIcon } from '@/lib/utils';
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { TableSkeleton } from '@/components/ui/LoadingScreen';

export function PendingPayments() {
  const { data: pendingPayments, isLoading, error } = usePendingPayments();

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Pending Payments
          </h3>
          <TableSkeleton rows={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Pending Payments
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load payment data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CreditCardIcon className="h-5 w-5 text-yellow-500 mr-2" />
            Pending Payments
          </h3>
          <Link
            href="/payments"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            View all
          </Link>
        </div>
        
        {pendingPayments && pendingPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingPayments.map((payment) => {
                  const order = payment.orders as any;
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order?.order_number || 'N/A'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {order?.customer_name || 'N/A'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span className="flex items-center">
                          <span className="mr-1">
                            {getPaymentMethodIcon(payment.method)}
                          </span>
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-badge ${
                            payment.status === 'partial'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/payments/${payment.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Mark Paid
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">All payments up to date!</h3>
            <p className="text-sm text-gray-500 mt-1">
              No pending payments at this time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}