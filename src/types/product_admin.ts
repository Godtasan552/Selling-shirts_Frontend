// ============================================
// types/product_admin.ts - FIXED & CLEANED
// ============================================

export interface Variant {
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
}

// Product from database (includes _id and imageUrl)
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  variants: Variant[];
  imageUrl?: string; // URL ของรูปที่อยู่ใน database
  createdBy?: string; // ผู้สร้างสินค้า
  updatedBy?: string; // ผู้อัพเดตสินค้า
  createdAt?: string | Date; // เวลาสร้าง (ISO string หรือ Date object)
  updatedAt?: string | Date; // เวลาอัพเดต (ISO string หรือ Date object)
}

// Form data type (ไม่มี imageUrl เพราะส่งเป็น File แยก)
export interface FormDataType {
  name: string;
  description: string;
  category: string;
  status: string;
  variants: Variant[];
}

// Order types
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

// Constants
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
export const SIZES = ['S', 'SS', 'SSS', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL'] as const;