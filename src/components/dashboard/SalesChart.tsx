'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSalesChartData } from '@/hooks/useQueries';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ChartSkeleton } from '@/components/ui/LoadingScreen';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">
          {formatDate(label || '', 'short')}
        </p>
        {payload.map((pld, index) => (
          <p key={index} className="text-sm" style={{ color: pld.color }}>
            {`${pld.dataKey === 'sales' ? 'Sales' : 'Orders'}: ${
              pld.dataKey === 'sales' ? formatCurrency(pld.value) : pld.value
            }`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function SalesChart() {
  const { data: salesData, isLoading, error } = useSalesChartData(30);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Trend (30 Days)</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load sales data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Sales Trend (30 Days)</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Sales</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Orders</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => formatDate(value, 'short')}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#d946ef"
              strokeWidth={2}
              dot={{ fill: '#d946ef', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#d946ef', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {salesData && salesData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No sales data available</p>
        </div>
      )}
    </div>
  );
}