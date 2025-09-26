'use client';

import React from 'react';
import Link from 'next/link';
import { useLowStockProducts } from '@/hooks/useQueries';
import { formatCurrency } from '@/lib/utils';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CardSkeleton } from '@/components/ui/LoadingScreen';

export function LowStockAlert() {
  const { data: lowStockProducts, isLoading, error } = useLowStockProducts();

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Low Stock Alert
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load stock data</p>
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
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-2" />
            Low Stock Alert
          </h3>
          <Link
            href="/inventory"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            Manage Stock
          </Link>
        </div>
        
        {lowStockProducts && lowStockProducts.length > 0 ? (
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {product.category} • {formatCurrency(product.price || 0)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-orange-700 font-medium">
                        Stock: {product.stock}
                      </span>
                      <span className="text-xs text-gray-400">
                        Min: {product.min_stock}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((product.stock || 0) / (product.min_stock || 1)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="ml-2 text-xs text-orange-700 font-medium">
                        {Math.round(
                          ((product.stock || 0) / (product.min_stock || 1)) * 100
                        )}%
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="ml-3 inline-flex items-center p-1.5 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-green-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">All good!</h3>
            <p className="text-sm text-gray-500 mt-1">
              No products are running low on stock
            </p>
          </div>
        )}
      </div>
    </div>
  );
}