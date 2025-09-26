import clsx from 'clsx';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return clsx(inputs.filter(Boolean));
}

export function formatCurrency(amount: number, currency = 'PKR') {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace('PKR', currency);
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short') {
  const d = new Date(date);
  
  switch (format) {
    case 'long':
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
}

export function formatPhone(phone: string) {
  // Format Pakistani phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+92 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `+92 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

export function generateOrderNumber() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.getTime().toString().slice(-4);
  return `ORD-${dateStr}-${timeStr}`;
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'returned':
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'unpaid':
      return 'bg-red-100 text-red-800';
    case 'partial':
      return 'bg-orange-100 text-orange-800';
    case 'scheduled':
      return 'bg-gray-100 text-gray-800';
    case 'posted':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPaymentMethodIcon(method: string) {
  switch (method.toLowerCase()) {
    case 'cash':
      return '💵';
    case 'bank':
      return '🏦';
    case 'easypaisa':
      return '📱';
    case 'jazzcash':
      return '📲';
    default:
      return '💳';
  }
}

export function truncateText(text: string, length = 50) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function generateWhatsAppMessage(
  productName: string,
  price: number,
  companyName = 'Multi-Product Business'
) {
  const message = `Hi! I'm interested in ${productName} priced at ${formatCurrency(price)}. Could you please provide more details?\n\nFrom: ${companyName}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function calculateOrderTotal(items: { quantity: number; price: number }[]) {
  return items.reduce((total, item) => total + (item.quantity * item.price), 0);
}

export function getStockStatus(stock: number, minStock: number = 5) {
  if (stock === 0) return { status: 'out-of-stock', color: 'text-red-600', label: 'Out of Stock' };
  if (stock <= minStock) return { status: 'low-stock', color: 'text-orange-600', label: 'Low Stock' };
  return { status: 'in-stock', color: 'text-green-600', label: 'In Stock' };
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string) {
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}