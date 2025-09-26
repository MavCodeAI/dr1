'use client';

import React, { useState, useEffect } from 'react';
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
import { apiCall } from '@/lib/api';

interface InventoryLog {
  id: string;
  product_id: string;
  change_type: 'add' | 'sale' | 'adjustment';
  quantity: number;
  note: string | null;
  created_at: string;
  product_name?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export default function InventoryPage() {
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'add' | 'sale' | 'adjustment'>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Since we don't have a separate inventory logs API endpoint,
      // we'll create mock data based on products for now
      const productsData = await apiCall('/api/products');
      setProducts(productsData || []);
      
      // Mock inventory logs - in a real app, you'd have a separate endpoint
      const mockLogs: InventoryLog[] = productsData?.map((product: Product, index: number) => ({
        id: `log-${index}`,
        product_id: product.id,
        change_type: 'add' as const,
        quantity: product.stock,
        note: 'Initial stock',
        created_at: new Date().toISOString(),
        product_name: product.name,
      })) || [];
      
      setInventoryLogs(mockLogs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = inventoryLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.note?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || log.change_type === filterType;
    const matchesProduct = !selectedProduct || log.product_id === selectedProduct;
    
    return matchesSearch && matchesType && matchesProduct;
  });

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'add':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'sale':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      case 'adjustment':
        return <AdjustmentsHorizontalIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'add':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'sale':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'adjustment':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <TableSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArchiveBoxIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Logs</h1>
              <p className="text-sm text-gray-500">Track stock changes and movements</p>
            </div>
          </div>
          
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Manage Products
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Change Type Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Changes</option>
                <option value="add">Stock Added</option>
                <option value="sale">Sales</option>
                <option value="adjustment">Adjustments</option>
              </select>
            </div>

            {/* Product Filter */}
            <div>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Inventory Logs Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <ArchiveBoxIcon className="mx-auto w-12 h-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No inventory logs</h3>
                      <p className="mt-2 text-gray-500">No inventory changes found with current filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{log.product_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border",
                          getChangeColor(log.change_type)
                        )}>
                          {getChangeIcon(log.change_type)}
                          {log.change_type.charAt(0).toUpperCase() + log.change_type.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "font-medium",
                          log.change_type === 'add' ? 'text-green-600' : 
                          log.change_type === 'sale' ? 'text-red-600' : 'text-yellow-600'
                        )}>
                          {log.change_type === 'add' ? '+' : log.change_type === 'sale' ? '-' : '±'}{log.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">
                          {log.note || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Stock Added</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryLogs.filter(log => log.change_type === 'add').reduce((sum, log) => sum + log.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <ArrowTrendingDownIcon className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryLogs.filter(log => log.change_type === 'sale').reduce((sum, log) => sum + log.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <AdjustmentsHorizontalIcon className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Adjustments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryLogs.filter(log => log.change_type === 'adjustment').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}