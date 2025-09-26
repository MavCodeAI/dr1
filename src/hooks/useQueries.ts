import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  Product,
  Order,
  Payment,
  DashboardAnalytics,
  LowStockProduct,
  SalesChartData,
  ProductPerformance,
} from '@/lib/types';

// Dashboard analytics
export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async (): Promise<DashboardAnalytics> => {
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Low stock products
export function useLowStockProducts() {
  return useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async (): Promise<LowStockProduct[]> => {
      const { data, error } = await supabase
        .from('low_stock_products')
        .select('*')
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Sales chart data
export function useSalesChartData(daysBack: number = 30) {
  return useQuery({
    queryKey: ['sales-chart-data', daysBack],
    queryFn: async (): Promise<SalesChartData[]> => {
      const { data, error } = await supabase
        .rpc('get_sales_chart_data', { days_back: daysBack });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Product performance
export function useProductPerformance(daysBack: number = 30) {
  return useQuery({
    queryKey: ['product-performance', daysBack],
    queryFn: async (): Promise<ProductPerformance[]> => {
      const { data, error } = await supabase
        .rpc('get_product_performance', { days_back: daysBack });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          ),
          payments (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

// Recent orders for dashboard
export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: ['recent-orders', limit],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Payments
export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async (): Promise<Payment[]> => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders (
            order_number,
            customer_name,
            customer_phone
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

// Pending payments
export function usePendingPayments() {
  return useQuery({
    queryKey: ['pending-payments'],
    queryFn: async (): Promise<Payment[]> => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders (
            order_number,
            customer_name,
            customer_phone,
            total_amount
          )
        `)
        .in('status', ['unpaid', 'partial'])
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}