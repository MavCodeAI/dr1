export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'owner' | 'staff'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          role?: 'owner' | 'staff'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'owner' | 'staff'
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          category: 'main' | 'reseller'
          description: string | null
          price: number
          stock: number
          min_stock: number | null
          image_url: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'main' | 'reseller'
          description?: string | null
          price: number
          stock?: number
          min_stock?: number | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'main' | 'reseller'
          description?: string | null
          price?: number
          stock?: number
          min_stock?: number | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          customer_address: string
          status: 'pending' | 'processing' | 'delivered' | 'returned'
          total_amount: number
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          customer_address: string
          status?: 'pending' | 'processing' | 'delivered' | 'returned'
          total_amount: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          customer_address?: string
          status?: 'pending' | 'processing' | 'delivered' | 'returned'
          total_amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          subtotal?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          method: 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'other'
          status: 'paid' | 'unpaid' | 'partial'
          amount: number
          transaction_ref: string | null
          notes: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          method: 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'other'
          status?: 'paid' | 'unpaid' | 'partial'
          amount: number
          transaction_ref?: string | null
          notes?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          method?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'other'
          status?: 'paid' | 'unpaid' | 'partial'
          amount?: number
          transaction_ref?: string | null
          notes?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory_logs: {
        Row: {
          id: string
          product_id: string
          change_type: 'add' | 'sale' | 'adjustment'
          quantity: number
          previous_stock: number
          new_stock: number
          note: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          product_id: string
          change_type: 'add' | 'sale' | 'adjustment'
          quantity: number
          previous_stock: number
          new_stock: number
          note?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          product_id?: string
          change_type?: 'add' | 'sale' | 'adjustment'
          quantity?: number
          previous_stock?: number
          new_stock?: number
          note?: string | null
          created_at?: string
          created_by?: string
        }
      }
      marketing_posts: {
        Row: {
          id: string
          platform: 'facebook' | 'linkedin' | 'whatsapp'
          title: string | null
          content: string
          image_url: string | null
          status: 'scheduled' | 'posted' | 'failed'
          scheduled_at: string | null
          posted_at: string | null
          error_message: string | null
          engagement_data: Json | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          platform: 'facebook' | 'linkedin' | 'whatsapp'
          title?: string | null
          content: string
          image_url?: string | null
          status?: 'scheduled' | 'posted' | 'failed'
          scheduled_at?: string | null
          posted_at?: string | null
          error_message?: string | null
          engagement_data?: Json | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          platform?: 'facebook' | 'linkedin' | 'whatsapp'
          title?: string | null
          content?: string
          image_url?: string | null
          status?: 'scheduled' | 'posted' | 'failed'
          scheduled_at?: string | null
          posted_at?: string | null
          error_message?: string | null
          engagement_data?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
    }
    Views: {
      dashboard_analytics: {
        Row: {
          today_sales: number | null
          week_sales: number | null
          month_sales: number | null
          total_sales: number | null
          pending_orders: number | null
          processing_orders: number | null
          today_orders: number | null
          pending_payments: number | null
          partial_payments: number | null
        }
      }
      low_stock_products: {
        Row: {
          id: string | null
          name: string | null
          category: 'main' | 'reseller' | null
          stock: number | null
          min_stock: number | null
          price: number | null
          shortage: number | null
        }
      }
    }
    Functions: {
      get_sales_chart_data: {
        Args: {
          days_back?: number
        }
        Returns: {
          date: string
          sales: number
          orders: number
        }[]
      }
      get_product_performance: {
        Args: {
          days_back?: number
        }
        Returns: {
          product_id: string
          product_name: string
          category: 'main' | 'reseller'
          total_sold: number
          total_revenue: number
          avg_price: number
        }[]
      }
    }
  }
}

// Helper types
export type User = Database['public']['Tables']['users']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type InventoryLog = Database['public']['Tables']['inventory_logs']['Row'];
export type MarketingPost = Database['public']['Tables']['marketing_posts']['Row'];

export type DashboardAnalytics = Database['public']['Views']['dashboard_analytics']['Row'];
export type LowStockProduct = Database['public']['Views']['low_stock_products']['Row'];

export type SalesChartData = Database['public']['Functions']['get_sales_chart_data']['Returns'][0];
export type ProductPerformance = Database['public']['Functions']['get_product_performance']['Returns'][0];

// Enum types
export type UserRole = 'owner' | 'staff';
export type ProductCategory = 'main' | 'reseller';
export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'returned';
export type PaymentMethod = 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'other';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial';
export type InventoryChangeType = 'add' | 'sale' | 'adjustment';
export type MarketingPlatform = 'facebook' | 'linkedin' | 'whatsapp';
export type PostStatus = 'scheduled' | 'posted' | 'failed';

// Extended types with relations
export type OrderWithDetails = Order & {
  order_items: (OrderItem & {
    products: Product;
  })[];
  payments: Payment[];
};

export type ProductWithLogs = Product & {
  inventory_logs: InventoryLog[];
};

export type UserWithRole = User & {
  isOwner: boolean;
  isStaff: boolean;
};