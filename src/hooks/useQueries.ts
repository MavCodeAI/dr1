<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { apiCall } from '@/lib/api';

// Custom hook for fetching data
function useQuery(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiCall(endpoint);
        setData(result);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiCall(endpoint);
      setData(result);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
}

// Products queries
export const useProducts = () => {
  return useQuery('/api/products');
};

export const useProduct = (id: string) => {
  return useQuery(`/api/products/${id}`, [id]);
};

// Orders queries  
export const useOrders = () => {
  return useQuery('/api/orders');
};

export const useOrder = (id: string) => {
  return useQuery(`/api/orders/${id}`, [id]);
};

// Payments queries
export const usePayments = () => {
  return useQuery('/api/payments');
};

export const usePayment = (id: string) => {
  return useQuery(`/api/payments/${id}`, [id]);
};

// Users queries (owner only)
export const useUsers = () => {
  return useQuery('/api/users');
};

// Dashboard stats query
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from multiple endpoints
        const [orders, products] = await Promise.all([
          apiCall('/api/orders'),
          apiCall('/api/products'),
        ]);

        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum: number, order: any) => 
          sum + (order.total_amount || 0), 0) || 0;
        const pendingOrders = orders?.filter((order: any) => 
          order.status === 'pending')?.length || 0;
        const lowStockProducts = products?.filter((product: any) => 
          product.stock < 5)?.length || 0;

        setStats({
          totalOrders,
          totalRevenue,
          pendingOrders,
          lowStockProducts,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};

// Recent data queries
export const useRecentOrders = (limit: number = 5) => {
  return useQuery(`/api/orders?limit=${limit}`);
};

export const useLowStockProducts = () => {
  const { data: products, isLoading, error } = useProducts();
  
  const lowStockProducts = products?.filter((product: any) => 
    product.stock < 5) || [];

  return { 
    data: lowStockProducts, 
    isLoading, 
    error 
  };
};

// Sales data for charts
export const useSalesData = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        const orders = await apiCall('/api/orders');
        
        // Group orders by date for chart
        const salesByDate = orders?.reduce((acc: any, order: any) => {
          const date = new Date(order.created_at).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += order.total_amount || 0;
          return acc;
        }, {}) || {};

        const chartData = Object.entries(salesByDate).map(([date, amount]) => ({
          date,
          sales: amount,
        }));

        setSalesData(chartData);
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return { data: salesData, isLoading };
};
=======
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
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
