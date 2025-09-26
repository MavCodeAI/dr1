// API utility functions for authenticated requests

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(endpoint, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Products API
export const productsApi = {
  getAll: () => apiCall('/api/products'),
  create: (product: any) => apiCall('/api/products', { method: 'POST', body: product }),
  update: (id: string, product: any) => apiCall(`/api/products/${id}`, { method: 'PUT', body: product }),
  delete: (id: string) => apiCall(`/api/products/${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  getAll: () => apiCall('/api/orders'),
  create: (order: any) => apiCall('/api/orders', { method: 'POST', body: order }),
  update: (id: string, order: any) => apiCall(`/api/orders/${id}`, { method: 'PUT', body: order }),
};

// Payments API
export const paymentsApi = {
  getAll: () => apiCall('/api/payments'),
  create: (payment: any) => apiCall('/api/payments', { method: 'POST', body: payment }),
  update: (id: string, payment: any) => apiCall(`/api/payments/${id}`, { method: 'PUT', body: payment }),
};

// Users API
export const usersApi = {
  getAll: () => apiCall('/api/users'),
  create: (user: any) => apiCall('/api/users', { method: 'POST', body: user }),
};