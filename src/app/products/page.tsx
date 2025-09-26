'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/useQueries';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency, getStockStatus, cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TableSkeleton } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductsPage() {
  const { data: products, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { isOwner } = useAuth();

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'main', label: 'Main Products' },
    { value: 'reseller', label: 'Reseller Items' },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load products</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your product inventory and pricing
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Product
            </Link>
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
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'relative inline-flex items-center px-4 py-2 rounded-l-md border text-sm font-medium',
                      viewMode === 'grid'
                        ? 'bg-primary-50 border-primary-500 text-primary-700 z-10'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    )}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border text-sm font-medium',
                      viewMode === 'list'
                        ? 'bg-primary-50 border-primary-500 text-primary-700 z-10'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    )}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className="p-4">
            {filteredProducts && filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock, product.min_stock);
                    return (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="aspect-w-1 aspect-h-1 bg-gray-200 group-hover:opacity-75">
                          <Image
                            src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full h-48 object-center object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500 capitalize mt-1">
                                {product.category}
                              </p>
                            </div>
                            <span className={`text-xs font-medium ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(product.price)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Stock: {product.stock} units
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <Link
                              href={`/products/${product.id}`}
                              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                            >
                              <EyeIcon className="h-4 w-4 inline mr-1" />
                              View
                            </Link>
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/products/${product.id}/edit`}
                                className="text-blue-600 hover:text-blue-500"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              {isOwner && (
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-500"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this product?')) {
                                      // Handle delete
                                    }
                                  }}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product.stock, product.min_stock);
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <Image
                                    className="h-10 w-10 rounded object-cover"
                                    src={product.image_url || 'https://via.placeholder.com/40x40?text=No+Image'}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.stock} units
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.status === 'out-of-stock' ? 'bg-red-100 text-red-800' : stockStatus.status === 'low-stock' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                {stockStatus.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <Link
                                href={`/products/${product.id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <EyeIcon className="h-4 w-4 inline" />
                              </Link>
                              <Link
                                href={`/products/${product.id}/edit`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="h-4 w-4 inline" />
                              </Link>
                              {isOwner && (
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this product?')) {
                                      // Handle delete
                                    }
                                  }}
                                >
                                  <TrashIcon className="h-4 w-4 inline" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8h.01M3 21h.01M12 3h.01"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first product.'}
                </p>
                <div className="mt-6">
                  <Link
                    href="/products/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Product
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}