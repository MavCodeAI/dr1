'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TableSkeleton } from '@/components/ui/LoadingScreen';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface InventoryLog {
  id: string;
  product_id: string;
  change_type: 'add' | 'sale' | 'adjustment';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  note: string | null;
  created_at: string;
  products: {
    name: string;
    category: string;
    price: number;
  } | null;
  users: {
    name: string;
  } | null;
}

function useInventoryLogs() {
  return useQuery({
    queryKey: ['inventory-logs'],
    queryFn: async (): Promise<InventoryLog[]> => {
      const { data, error } = await supabase
        .from('inventory_logs')
        .select(`
          *,
          products (
            name,
            category,
            price
          ),
          users (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export default function InventoryPage() {
  const { data: inventoryLogs, isLoading, error } = useInventoryLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredLogs = inventoryLogs?.filter((log) => {
    const matchesSearch = log.products?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.note?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || log.change_type === selectedType;
    return matchesSearch && matchesType;
  });

  const typeOptions = [
    { value: 'all', label: 'All Changes' },
    { value: 'add', label: 'Stock Added' },
    { value: 'sale', label: 'Sales' },
    { value: 'adjustment', label: 'Adjustments' },
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'sale':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      case 'adjustment':
        return <AdjustmentsHorizontalIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <ArchiveBoxIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = (type: string, quantity: number) => {
    if (type === 'add' || (type === 'adjustment' && quantity > 0)) {
      return 'text-green-600';
    } else if (type === 'sale' || (type === 'adjustment' && quantity < 0)) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          </div>
          <TableSkeleton rows={6} />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load inventory logs</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track stock movements and inventory changes
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArchiveBoxIcon className="-ml-1 mr-2 h-5 w-5" />
              Manage Products
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Stock Added Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {inventoryLogs?.filter(log => 
                        log.change_type === 'add' && 
                        new Date(log.created_at).toDateString() === new Date().toDateString()
                      ).reduce((sum, log) => sum + log.quantity, 0) || 0} units
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Sales Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.abs(inventoryLogs?.filter(log => 
                        log.change_type === 'sale' && 
                        new Date(log.created_at).toDateString() === new Date().toDateString()
                      ).reduce((sum, log) => sum + log.quantity, 0) || 0)} units
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Adjustments Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {inventoryLogs?.filter(log => 
                        log.change_type === 'adjustment' && 
                        new Date(log.created_at).toDateString() === new Date().toDateString()
                      ).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="sm:flex sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search by product name or note..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {typeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Logs Table */}
          <div className="overflow-hidden">
            {filteredLogs && filteredLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Before
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock After
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Changed By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {log.products?.name || 'Unknown Product'}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {log.products?.category} • {formatCurrency(log.products?.price || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getChangeIcon(log.change_type)}
                            <span className="ml-2 text-sm text-gray-900 capitalize">
                              {log.change_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'text-sm font-semibold',
                            getChangeColor(log.change_type, log.quantity)
                          )}>
                            {log.quantity > 0 ? '+' : ''}{log.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.previous_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.new_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.created_at, 'time')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.note ? (
                            <span className="max-w-xs truncate">{log.note}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.users?.name || 'System'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory changes found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search or filters.' : 'Inventory changes will appear here when stock is modified.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}