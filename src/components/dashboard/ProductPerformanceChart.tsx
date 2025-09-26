'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useProductPerformance } from '@/hooks/useQueries';
import { formatCurrency, truncateText } from '@/lib/utils';
import { ChartSkeleton } from '@/components/ui/LoadingScreen';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-blue-600">
            Revenue: {formatCurrency(data?.total_revenue || 0)}
          </p>
          <p className="text-sm text-green-600">
            Units Sold: {data?.total_sold || 0}
          </p>
          <p className="text-sm text-purple-600">
            Avg Price: {formatCurrency(data?.avg_price || 0)}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            Category: {data?.category}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function ProductPerformanceChart() {
  const { data: performanceData, isLoading, error } = useProductPerformance(30);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Product Performance (30 Days)
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load product performance data</p>
        </div>
      </div>
    );
  }

  // Get top 10 products by revenue
  const topProducts = performanceData?.slice(0, 10) || [];
  
  // Format data for chart
  const chartData = topProducts.map((product) => ({
    ...product,
    short_name: truncateText(product.product_name, 15),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Top Products (30 Days)
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Units Sold</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="short_name"
              stroke="#666"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="total_revenue"
              name="Revenue"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total_sold"
              name="Units Sold"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {chartData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No product performance data available</p>
        </div>
      )}
    </div>
  );
}