// ============================================
// 3. types/admin.ts - NEW
// ============================================
export interface Variant {
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  status: string;
  variants: Variant[];
}

export interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  totalPrice: number;
  shippingCost: number;
  status: string;
  items: OrderItem[];
  paymentSlip?: string;
}

export interface FormDataType {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  status: string;
  variants: Variant[];
}

export const PRODUCT_STATUS = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  discontinued: { label: 'Discontinued', color: 'bg-red-100 text-red-800' },
} as const;

export const ORDER_STATUS = {
  pending_payment: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
  verifying_payment: { label: 'Verifying Payment', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  shipping: { label: 'Shipping', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
} as const;

export const CATEGORIES = ['t-shirt', 'polo', 'hoodie', 'jacket', 'other'] as const;
export const SIZES = ['S', 'SS', 'M', 'L', 'XL', '2XL', '3XL'] as const;

