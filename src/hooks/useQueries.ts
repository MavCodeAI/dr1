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